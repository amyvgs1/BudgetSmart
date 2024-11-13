import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import BudgetListItem from "../components/BudgetListItem";
import { supabase } from '../config/supabase';

export default function PlanDisplay() {
    const [budgetItems, setBudgetItems] = useState([]);
    const [groupMembers, setGroupMembers] = useState([]);
    const [isGroupPlan, setIsGroupPlan] = useState(false);
    const [progress, setProgress] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);

    const { budgetId } = useParams();
    const location = useLocation();
    const budgetName = location.state?.name;
    const budgetAmount = location.state?.total;

    useEffect(() => {
        const fetchBudgetData = async () => {
            try {
                // Fetch budget plan details
                const { data: budgetData, error: budgetError } = await supabase
                    .from('budget_plan')
                    .select('is_group_plan')
                    .eq('budget_id', budgetId)
                    .single();

                if (budgetError) throw budgetError;
                setIsGroupPlan(budgetData.is_group_plan);

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
    }, [budgetId, budgetAmount]);

    // Function to determine progress bar color
    const getProgressColor = () => {
        if (progress > 100) return 'bg-red-500';
        if (progress > 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-screen font-Outfit">
            <div className="text-6xl font-semibold mb-5">
                <h1>{budgetName}</h1>
            </div>

            <div className="text-4xl text-slate-400 mb-5">
                <p>Total Budget Allocated: ${budgetAmount}</p>
            </div>

            {/* Progress Bar Section */}
            <div className="w-3/4 mb-10">
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">
                        Budget Progress: ${totalSpent.toFixed(2)} / ${budgetAmount}
                    </span>
                    <span className="text-sm font-semibold">
                        {progress.toFixed(1)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                        className={`${getProgressColor()} h-4 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                </div>
                {progress > 100 && (
                    <p className="text-red-500 text-sm mt-1">
                        Over budget by ${(totalSpent - budgetAmount).toFixed(2)}
                    </p>
                )}
            </div>
            
            {/* Group Members Section */}
            {isGroupPlan && groupMembers.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl text-slate-600 mb-3">Group Members</h2>
                    <div className="flex flex-wrap gap-2">
                        {groupMembers.map((member) => (
                            <span 
                                key={member.member_id} 
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                            >
                                {member.member_name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Budget Items Section */}
            <span className="text-2xl text-slate-600"><p>Your Budget Items</p></span>
            <div className="flex flex-col justify-center items-center w-3/4 space-y-3">
                {budgetItems.length === 0 ? 
                    <h1>Add Budget Items!</h1> : 
                    budgetItems.map((element) => {
                        return <BudgetListItem 
                            key={element.item_id}
                            name={element.item_name} 
                            amount={element.amount}
                        />
                    })
                }
            </div>
        </div>
    );
}