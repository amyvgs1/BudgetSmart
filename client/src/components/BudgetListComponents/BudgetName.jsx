import individual from "/src/assets/individual.png";
import group from "/src/assets/group.png";
import { useLocation, useNavigate } from "react-router-dom";

export default function BudgetName(props) {
    const navigate = useNavigate();


    const manageDisplay = () => {
        navigate(`/budgetdisplay/${props.id}`, {state: {name: props.name, total: props.totalBudget}});
    }


    return (
        <div onClick={manageDisplay} className="flex flex-row flex-none justify-center items-center w-full h-24 bg-blue-500 hover:bg-blue-300 hover:cursor-pointer space-x-4 rounded-md text-2xl">
            <h1>{props.name}</h1>
            {props.isGroup ? <img src={group} width={20} height={20} /> : <img src={individual} width={20} height={20} />}
        </div>
    );
}