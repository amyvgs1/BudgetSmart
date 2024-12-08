import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import BudgetListItem from "../components/BudgetListItem";
import { supabase } from '../config/supabase';

export default function PlanDisplay() {
    const { budgetId } = useParams();
    const location = useLocation();
    
    const [displayName, setDisplayName] = useState(location?.state?.name || '');
    const [displayAmount, setDisplayAmount] = useState(location?.state?.total || 0);
    const [budgetItems, setBudgetItems] = useState([]);
    const [groupMembers, setGroupMembers] = useState([]);
    const [isGroupPlan, setIsGroupPlan] = useState(false);
    const [progress, setProgress] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editedBudgetAmount, setEditedBudgetAmount] = useState(0);
    const [editedName, setEditedName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [newItemName, setNewItemName] = useState('');
    const [newItemAmount, setNewItemAmount] = useState('');
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [isEditingItem, setIsEditingItem] = useState(false);
    const [editingItemId, setEditingItemId] = useState(null);
    const [editedItemName, setEditedItemName] = useState('');
    const [editedItemAmount, setEditedItemAmount] = useState('');

    // Move fetchBudgetData outside of useEffect
    const fetchBudgetData = async () => {
        try {
            // First fetch the budget plan details
            const { data: budgetData, error: budgetError } = await supabase
                .from('budget_plan')
                .select('*')
                .eq('budget_id', budgetId)
                .single();

            if (budgetError) throw budgetError;

            setIsGroupPlan(budgetData.is_group_plan);
            setEditedName(budgetData.budget_name);
            setEditedBudgetAmount(budgetData.total_budget);

            // Fetch budget items separately
            const { data: itemsData, error: itemsError } = await supabase
                .from('budget_items')
                .select('*')
                .eq('budget_id', budgetId);

            if (itemsError) throw itemsError;
            setBudgetItems(itemsData);

            // Calculate total spent and progress
            const spent = itemsData.reduce((sum, item) => sum + item.amount, 0);
            setTotalSpent(spent);
            setProgress((spent / budgetData.total_budget) * 100);

            // If it's a group plan, fetch members separately
            if (budgetData.is_group_plan) {
                const { data: membersData, error: membersError } = await supabase
                    .from('group_plan_members')
                    .select(`
                        budget_id,
                        member_id,
                        username
                    `)
                    .eq('budget_id', budgetId);

                if (membersError) {
                    console.error('Error fetching members:', membersError);
                    throw membersError;
                }

                console.log('Fetched group members:', membersData);
                setGroupMembers(membersData || []);
            }
        } catch (e) {
            console.error('Error fetching budget data:', e);
        }
    };

    // Update the useEffect to run when needed
    useEffect(() => {
        if (budgetId) {
            fetchBudgetData();
        }
    }, [budgetId]);

    // Update the useEffect to use displayName and displayAmount
    useEffect(() => {
        setEditedName(displayName);
        setEditedBudgetAmount(displayAmount);
    }, [displayName, displayAmount]);

    // Function to determine progress bar color
    const getProgressColor = () => {
        if (progress > 100) return 'bg-red-500';
        if (progress > 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const addBudgetItem = async () => {
        try {
            const { error } = await supabase
                .from('budget_items')
                .insert({
                    budget_id: budgetId,
                    item_name: newItemName,
                    amount: parseFloat(newItemAmount)
                });

            if (error) throw error;

            // Reset form and refresh data
            setNewItemName('');
            setNewItemAmount('');
            setIsAddingItem(false);
            fetchBudgetData();
        } catch (error) {
            console.error('Error adding budget item:', error);
        }
    };

    const deleteBudgetItem = async (itemId) => {
        try {
            const { error } = await supabase
                .from('budget_items')
                .delete()
                .eq('item_id', itemId);

            if (error) throw error;
            fetchBudgetData();
        } catch (error) {
            console.error('Error deleting budget item:', error);
        }
    };

    const updateBudgetPlan = async () => {
        try {
            const { data, error: updateError } = await supabase
                .from('budget_plan')
                .update({
                    budget_name: editedName,
                    total_budget: parseFloat(editedBudgetAmount)
                })
                .eq('budget_id', budgetId)
                .select();

            if (updateError) {
                console.error('Update error:', updateError);
                throw updateError;
            }

            if (!data || data.length === 0) {
                console.error('No data returned from update');
                return;
            }

            // Update display values
            setDisplayName(editedName);
            setDisplayAmount(parseFloat(editedBudgetAmount));
            setIsEditing(false);
            
            // Fetch fresh data for other components
            await fetchBudgetData();
            
        } catch (error) {
            console.error('Error updating budget plan:', error);
        }
    };

    const removeGroupMember = async (memberId) => {
        try {
            const { error } = await supabase
                .from('group_plan_members')
                .delete()
                .eq('budget_id', budgetId)
                .eq('member_id', memberId);

            if (error) throw error;
            fetchBudgetData();
        } catch (error) {
            console.error('Error removing group member:', error);
        }
    };

    const searchUsers = async (term) => {
        if (term.length < 3) return;
        
        try {
            const { data, error } = await supabase
                .from('users')
                .select('user_id, username')
                .ilike('username', `%${term}%`)
                .limit(5);

            if (error) throw error;
            
            // Filter out existing members
            const filteredResults = data.filter(user => 
                !groupMembers.some(member => member.member_id === user.user_id)
            );

            setSearchResults(filteredResults);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const editBudgetItem = async (itemId) => {
        try {
            const { error } = await supabase
                .from('budget_items')
                .update({
                    item_name: editedItemName,
                    amount: parseFloat(editedItemAmount)
                })
                .eq('item_id', itemId);

            if (error) throw error;

            // Reset edit state
            setIsEditingItem(false);
            setEditingItemId(null);
            setEditedItemName('');
            setEditedItemAmount('');
            
            // Refresh data
            fetchBudgetData();
        } catch (error) {
            console.error('Error updating budget item:', error);
        }
    };

    const startEditingItem = (item) => {
        setEditingItemId(item.item_id);
        setEditedItemName(item.item_name);
        setEditedItemAmount(item.amount.toString());
        setIsEditingItem(true);
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-screen font-Outfit p-8">
            {/* Title Section */}
            <div className="flex items-center justify-between w-3/4 mb-8">
                <div className="flex items-center gap-4">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="text-5xl font-semibold px-3 py-1 border rounded focus:outline-none focus:border-blue-500"
                        />
                    ) : (
                        <h1 className="text-5xl font-semibold">{displayName}</h1>
                    )}
                </div>
                <button
                    onClick={() => isEditing ? updateBudgetPlan() : setIsEditing(true)}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg"
                >
                    {isEditing ? 'Save Changes' : 'Edit Budget'}
                </button>
            </div>

            {/* Budget Amount Section */}
            <div className="w-3/4 mb-8">
                {isEditing ? (
                    <div className="flex items-center gap-3 text-3xl text-slate-600">
                        <span>Total Budget: $</span>
                        <input
                            type="number"
                            value={editedBudgetAmount}
                            onChange={(e) => setEditedBudgetAmount(e.target.value)}
                            className="w-40 px-3 py-1 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                ) : (
                    <p className="text-3xl text-slate-600">Total Budget: ${displayAmount}</p>
                )}
            </div>

            {/* Progress Bar Section */}
            <div className="w-3/4 mb-10 bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between mb-3">
                    <span className="text-lg font-semibold text-slate-700">
                        Budget Progress: ${totalSpent.toFixed(2)} / ${displayAmount}
                    </span>
                    <span className="text-lg font-semibold text-slate-700">
                        {progress.toFixed(1)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-5">
                    <div
                        className={`${getProgressColor()} h-5 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                </div>
                {progress > 100 && (
                    <p className="text-red-500 font-semibold mt-2">
                        Over budget by ${(totalSpent - displayAmount).toFixed(2)}
                    </p>
                )}
            </div>
            
            {/* Group Members Section */}
            {isGroupPlan && (
                <div className="w-3/4 mb-8 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-slate-700">Group Members</h2>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {groupMembers && groupMembers.map((member) => (
                            <div 
                                key={member.member_id}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium"
                            >
                                <span>{member.username}</span>
                                {isEditing && (
                                    <button
                                        onClick={() => removeGroupMember(member.member_id)}
                                        className="text-red-500 hover:text-red-700 ml-2"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {isEditing && (
                        <div className="mt-4">
                            <input
                                type="text"
                                placeholder="Search users to add..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    searchUsers(e.target.value);
                                }}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            {searchResults.length > 0 && (
                                <div className="mt-2 border rounded-lg shadow-sm divide-y">
                                    {searchResults.map(user => (
                                        <div
                                            key={user.user_id}
                                            onClick={() => {
                                                setSelectedMembers([...selectedMembers, user]);
                                                setSearchResults([]);
                                                setSearchTerm('');
                                            }}
                                            className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <div className="font-medium">{user.username}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            
            {/* Budget Items Section */}
            <div className="w-3/4 bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-slate-700">Your Budget Items</h2>
                    <button
                        onClick={() => setIsAddingItem(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Add Item
                    </button>
                </div>

                {isAddingItem && (
                    <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                        <div className="flex gap-4 mb-2">
                            <input
                                type="text"
                                placeholder="Item name"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                className="flex-1 p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                value={newItemAmount}
                                onChange={(e) => setNewItemAmount(e.target.value)}
                                className="w-32 p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsAddingItem(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addBudgetItem}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {budgetItems.length === 0 ? (
                        <p className="text-center text-gray-500">No budget items yet</p>
                    ) : (
                        budgetItems.map((element) => (
                            <div key={element.item_id} 
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                            >
                                <div className="flex-1 flex justify-between items-center">
                                    <span className="text-lg font-medium text-slate-700">{element.item_name}</span>
                                    <span className="text-lg font-semibold text-slate-800 ml-4">${element.amount}</span>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => startEditingItem(element)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteBudgetItem(element.item_id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}