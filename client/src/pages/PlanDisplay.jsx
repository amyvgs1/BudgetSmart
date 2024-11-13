import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import BudgetListItem from "../components/BudgetListItem";

export default function PlanDisplay(){
    // store budget list items
    const [budgetItems, setBudgetItems] = useState([]);
<<<<<<< Updated upstream
=======
    const [groupMembers, setGroupMembers] = useState([]);
    const [isGroupPlan, setIsGroupPlan] = useState(false);
    const [progress, setProgress] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [newItemName, setNewItemName] = useState('');
    const [newItemAmount, setNewItemAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [editedBudgetAmount, setEditedBudgetAmount] = useState('');
    const [budgetAmount, setBudgetAmount] = useState(0);
    const [showAddMemberForm, setShowAddMemberForm] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');
    const [isAddingMember, setIsAddingMember] = useState(false);
>>>>>>> Stashed changes

    // use given parameters from previous components
    const {budgetId} = useParams();
    const location = useLocation();

    // store state variables
    const budgetName = location.state?.name;
    const navigate = useNavigate();

    useEffect(() => {
<<<<<<< Updated upstream
        const obtainBudgetItems = async() => {
            console.log(budgetId);
            const res = await axios.get(`http://localhost:8080/api/budgetdisplay/${budgetId}`);
            console.log(res.data.items);
            setBudgetItems(res.data.items);
        };

        obtainBudgetItems();
    }, [])

    return(
=======
        const fetchBudgetData = async () => {
            try {
                // Fetch budget plan details
                const { data: budgetData, error: budgetError } = await supabase
                    .from('budget_plan')
                    .select('is_group_plan, start_date, end_date, total_budget')
                    .eq('budget_id', budgetId)
                    .single();

                if (budgetError) throw budgetError;
                setIsGroupPlan(budgetData.is_group_plan);
                setStartDate(budgetData.start_date);
                setEndDate(budgetData.end_date);
                if (budgetData.total_budget) {
                    setBudgetAmount(budgetData.total_budget);
                }

                // Fetch budget items
                const { data: itemsData, error: itemsError } = await supabase
                    .from('budget_items')
                    .select('*')
                    .eq('budget_id', budgetId);

                if (itemsError) throw itemsError;
                setBudgetItems(itemsData);

                // Calculate total spent and progress
                const spent = itemsData.reduce((sum, item) => sum + item.amount, 0);
                setTotalSpent(spent);
                setProgress((spent / budgetAmount) * 100);

                // If it's a group plan, fetch group members
                if (budgetData.is_group_plan) {
                    const { data: membersData, error: membersError } = await supabase
                        .from('budget_group_members')
                        .select('*')
                        .eq('budget_id', budgetId);

                    if (membersError) throw membersError;
                    setGroupMembers(membersData);
                }
            } catch (e) {
                console.error('Error fetching budget data:', e);
            }
        };

        fetchBudgetData();
    }, [budgetId]);

    // Function to determine progress bar color
    const getProgressColor = () => {
        const currentProgress = budgetAmount > 0 ? (totalSpent / budgetAmount * 100) : 0;
        if (currentProgress > 100) return 'bg-red-500';
        if (currentProgress > 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { data, error } = await supabase
                .from('budget_items')
                .insert([
                    {
                        budget_id: budgetId,
                        item_name: newItemName,
                        amount: parseFloat(newItemAmount)
                    }
                ])
                .select();

            if (error) throw error;

            // Update the local state with the new item
            setBudgetItems([...budgetItems, data[0]]);
            
            // Update total spent and progress
            const newTotal = totalSpent + parseFloat(newItemAmount);
            setTotalSpent(newTotal);
            setProgress((newTotal / budgetAmount) * 100);

            // Clear the form and hide it
            setNewItemName('');
            setNewItemAmount('');
            setShowAddForm(false);
        } catch (error) {
            console.error('Error adding budget item:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateBudget = async (e) => {
        e.preventDefault();
        
        try {
            const { error } = await supabase
                .from('budget_plan')
                .update({ total_budget: parseFloat(editedBudgetAmount) })
                .eq('budget_id', budgetId);

            if (error) throw error;

            // Update local state
            const newAmount = parseFloat(editedBudgetAmount);
            setBudgetAmount(newAmount);
            
            // Recalculate progress with current totalSpent and new budget amount
            const newProgress = (totalSpent / newAmount) * 100;
            setProgress(newProgress);
            
            setIsEditingBudget(false);
            
            // Update the budgetAmount in the location state if needed
            if (location.state) {
                location.state.total = newAmount;
            }
        } catch (error) {
            console.error('Error updating budget amount:', error);
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        setIsAddingMember(true);

        try {
            const { data, error } = await supabase
                .from('budget_group_members')
                .insert([
                    {
                        budget_id: budgetId,
                        member_name: newMemberName
                    }
                ])
                .select();

            if (error) throw error;

            // Update the local state with the new member
            setGroupMembers([...groupMembers, data[0]]);
            
            // Clear the form and hide it
            setNewMemberName('');
            setShowAddMemberForm(false);
        } catch (error) {
            console.error('Error adding group member:', error);
        } finally {
            setIsAddingMember(false);
        }
    };

    return (
>>>>>>> Stashed changes
        <div className="flex flex-col justify-center items-center w-full h-screen font-Outfit">
            <div className="text-6xl font-semibold mb-5">
                <h1>{budgetName}</h1>
            </div>

<<<<<<< Updated upstream
            <div className="text-4xl text-slate-400 mb-10">
                <p>Total Budget Allocated: ${budgetAmount}</p>
            </div>
            
=======
            <div className="mb-5">
                <span className={`px-4 py-2 rounded-full ${
                    isGroupPlan 
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                }`}>
                    {isGroupPlan ? '👥 Group Plan' : '👤 Individual Plan'}
                </span>
            </div>

            <div className="text-4xl text-slate-400 mb-5 flex items-center gap-2">
                {!isEditingBudget ? (
                    <>
                        <p>Total Budget Allocated: ${budgetAmount}</p>
                        <button
                            onClick={() => {
                                setIsEditingBudget(true);
                                setEditedBudgetAmount(budgetAmount.toString());
                            }}
                            className="text-blue-500 hover:text-blue-600 text-2xl"
                        >
                            ✎
                        </button>
                    </>
                ) : (
                    <form onSubmit={handleUpdateBudget} className="flex items-center gap-2">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <input
                                type="number"
                                value={editedBudgetAmount}
                                onChange={(e) => setEditedBudgetAmount(e.target.value)}
                                className="pl-8 pr-4 py-2 border rounded-lg text-2xl w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-2xl"
                        >
                            ✓
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditingBudget(false)}
                            className="text-red-500 hover:text-red-600 text-2xl"
                        >
                            ✕
                        </button>
                    </form>
                )}
            </div>

            {/* Add Date Range Section */}
            <div className="text-lg text-slate-500 mb-5">
                {startDate && endDate && (
                    <p>
                        {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                    </p>
                )}
            </div>

            {/* Modified Progress Bar Section */}
            <div className="w-1/2 mb-10">
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">
                        Budget Progress: ${totalSpent.toFixed(2)} / ${budgetAmount}
                    </span>
                    <span className="text-sm font-semibold">
                        {budgetAmount > 0 ? (totalSpent / budgetAmount * 100).toFixed(1) : 0}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className={`${getProgressColor()} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min((totalSpent / budgetAmount * 100) || 0, 100)}%` }}
                    ></div>
                </div>
                {totalSpent > budgetAmount && (
                    <p className="text-red-500 text-sm mt-1">
                        Over budget by ${(totalSpent - budgetAmount).toFixed(2)}
                    </p>
                )}
            </div>
            
            {/* Group Members Section */}
            {isGroupPlan && (
                <div className="mb-8 w-3/4 max-w-md">
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">Group Members</h2>
                            {!showAddMemberForm && (
                                <button
                                    onClick={() => setShowAddMemberForm(true)}
                                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    + Add Member
                                </button>
                            )}
                        </div>

                        {showAddMemberForm && (
                            <div className="mb-4 border-b pb-4">
                                <form onSubmit={handleAddMember} className="space-y-3">
                                    <input
                                        type="text"
                                        value={newMemberName}
                                        onChange={(e) => setNewMemberName(e.target.value)}
                                        placeholder="Enter member name"
                                        required
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            disabled={isAddingMember}
                                            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                                        >
                                            {isAddingMember ? 'Adding...' : 'Add Member'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddMemberForm(false);
                                                setNewMemberName('');
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {groupMembers.length === 0 ? (
                                <p className="text-gray-500 text-sm">No members added yet</p>
                            ) : (
                                groupMembers.map((member) => (
                                    <span 
                                        key={member.member_id} 
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md flex items-center gap-2"
                                    >
                                        <span className="text-blue-500">👤</span>
                                        {member.member_name}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Add Budget Item Button & Form */}
            <div className="w-3/4 max-w-md mb-8">
                {!showAddForm ? (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        + Add New Budget Item
                    </button>
                ) : (
                    <div className="bg-white p-4 rounded-lg shadow-md border">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Add New Item</h3>
                            <button
                                onClick={() => {
                                    setShowAddForm(false);
                                    setNewItemName('');
                                    setNewItemAmount('');
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div className="flex flex-col space-y-2">
                                <input
                                    type="text"
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    placeholder="Item name"
                                    required
                                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    value={newItemAmount}
                                    onChange={(e) => setNewItemAmount(e.target.value)}
                                    placeholder="Amount"
                                    step="0.01"
                                    min="0"
                                    required
                                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                                >
                                    {isSubmitting ? 'Adding...' : 'Add Budget Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* Budget Items Section */}
>>>>>>> Stashed changes
            <span className="text-2xl text-slate-600"><p>Your Budget Items</p></span>
            <div className="flex flex-col justfiy-center items-center w-3/4 space-y-3">
                {budgetItems.length === 0 ? 
                    <h1>Add Budget Items!</h1> : 
                    budgetItems.map((element) => {
                        return <BudgetListItem name={element.item_name} amount={element.amount}/>
                    })
                }
            </div>

<<<<<<< Updated upstream
=======
            {/* Back button moved to bottom */}
            <div className="mt-8 mb-8">
                <button
                    onClick={() => navigate('/mybudgets')}
                    className="text-blue-500 hover:text-blue-600 text-lg flex items-center gap-2"
                >
                    <span>←</span> Back to My Budgets
                </button>
            </div>
>>>>>>> Stashed changes
        </div>
    );
}