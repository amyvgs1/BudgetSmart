import { useEffect, useState } from "react";
import BudgetName from "./BudgetName";
import CreateButton from "./CreateButton";
import { supabase } from '../../config/supabase';

export default function BudgetListDisplay(props) {
    const [userBudgets, setUserBudgets] = useState([]);
    const user_id = sessionStorage.getItem("user_id");

    const manageCreate = () => {
        props.setShowLists(false);
    }

    useEffect(() => {
        const fetchBudgetLists = async () => {
            try {
                const userId = sessionStorage.getItem('user_id');
                
                // Get all budget IDs where the user is a member
                const { data: memberBudgetIds, error: memberError } = await supabase
                    .from('group_plan_members')
                    .select('budget_id')
                    .eq('member_id', userId);

                if (memberError) {
                    console.error('Error fetching member budgets:', memberError);
                    throw memberError;
                }

                // Get user's own budgets
                const { data: ownBudgets, error: ownError } = await supabase
                    .from('budget_plan')
                    .select('*')
                    .eq('user_id', userId);

                if (ownError) {
                    console.error('Error fetching own budgets:', ownError);
                    throw ownError;
                }

                // If there are group memberships, get those budgets
                let groupBudgets = [];
                if (memberBudgetIds && memberBudgetIds.length > 0) {
                    const budgetIds = memberBudgetIds.map(item => item.budget_id);
                    console.log('Fetching group budgets with IDs:', budgetIds);

                    const { data: groupData, error: groupError } = await supabase
                        .from('budget_plan')
                        .select('*')
                        .in('budget_id', budgetIds);

                    if (groupError) {
                        console.error('Error fetching group budgets:', groupError);
                        throw groupError;
                    }
                    
                    console.log('Fetched group budgets:', groupData);
                    groupBudgets = groupData || [];
                }

                // Combine and deduplicate budgets
                const allBudgets = [...(ownBudgets || []), ...groupBudgets];
                const uniqueBudgets = Array.from(new Map(allBudgets.map(item => [item.budget_id, item])).values());
                
                setUserBudgets(uniqueBudgets);
            } catch (error) {
                console.error('Error fetching budget lists:', error);
            }
        };

        fetchBudgetLists();
    }, []);

    return (
        <>
            <div className="flex flex-col justify-center items-center w-full h-screen font-Outfit">
                <div className="font-bold text-left w-1/2 text-4xl mb-5 mt-10">
                    <h1>My Budget Lists</h1>
                </div>

                <div className="flex flex-col items-center h-3/4 w-1/2 shadow-lg bg-gray-100 overflow-y-scroll space-y-3 p-5">
                    {userBudgets.length === 0 ?
                        <h1>Create Your First Budget List!</h1> :
                        userBudgets.map((element) => {
                            return (
                                <BudgetName 
                                    key={element.budget_id}
                                    id={element.budget_id}
                                    totalBudget={element.total_budget}
                                    name={element.budget_name}
                                    isGroup={element.is_group_plan}
                                />
                            );
                        })
                    }
                </div>

                <div className="bottom-0 left-0 absolute m-5">
                    <CreateButton clickFunc={() => manageCreate()} />
                </div>
            </div>
        </>
    );
}