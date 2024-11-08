import { useState } from "react";
import PlanForm from "./PlanForm";
import ChooseBudget from "./ChooseBudget";

export default function CreateBudget(props) {
    const [chooseBudget, setBudgetType] = useState(false);
    const [isGroup, setGroup] = useState(false);

    return (
        <div className="flex flex-col justify-center items-center h-screen w-full">
            {chooseBudget ? <PlanForm addBudgetLists={props.addBudgetLists} setShowLists={props.setShowLists} setBudgetType={setBudgetType} isGroup={isGroup} /> : <ChooseBudget setShowLists={props.setShowLists} setBudgetType={setBudgetType} setGroup={setGroup} />}
        </div>
    );
}