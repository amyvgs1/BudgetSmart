import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import BudgetListItem from "../components/BudgetListItem";

export default function PlanDisplay(){
    // store budget list items
    const [budgetItems, setBudgetItems] = useState([]);

    // use given parameters from previous components
    const {budgetId} = useParams();
    const location = useLocation();

    // store state variables
    const budgetName = location.state?.name;
    const budgetAmount = location.state?.total;

    useEffect(() => {
        const obtainBudgetItems = async() => {
            console.log(budgetId);
            const res = await axios.get(`http://localhost:8080/api/budgetdisplay/${budgetId}`);
            console.log(res.data.items);
            setBudgetItems(res.data.items);
        };

        obtainBudgetItems();
    }, [])

    return(
        <div className="flex flex-col justify-center items-center w-full h-screen font-Outfit">
            <div className="text-6xl font-semibold mb-5">
                <h1>{budgetName}</h1>
            </div>

            <div className="text-4xl text-slate-400 mb-10">
                <p>Total Budget Allocated: ${budgetAmount}</p>
            </div>
            
            <span className="text-2xl text-slate-600"><p>Your Budget Items</p></span>
            <div className="flex flex-col justfiy-center items-center w-3/4 space-y-3">
                {budgetItems.length === 0 ? 
                    <h1>Add Budget Items!</h1> : 
                    budgetItems.map((element) => {
                        return <BudgetListItem name={element.item_name} amount={element.amount}/>
                    })
                }
            </div>

        </div>
    );
}