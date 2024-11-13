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
        const getUserBudgets = async () => {
            try {
                const { data, error } = await supabase
                    .from('budget_plan')
                    .select('*')
                    .eq('user_id', user_id)
                    .order('created_at', { ascending: false });

                if (error) {
                    throw error;
                }

                setUserBudgets(data);
            } catch (e) {
                console.error('Error fetching budgets:', e);
            }
        };

        getUserBudgets();
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