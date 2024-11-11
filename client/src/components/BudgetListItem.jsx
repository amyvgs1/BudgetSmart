export default function BudgetListItem(props){
    return(
        <div className="flex flex-row justify-center items-center w-1/2 h-10 rounded-md bg-blue-400 space-x-10 p-5">
            <p>{props.name}</p>
            <p>(amount ${props.amount})</p>
        </div>
    );
}