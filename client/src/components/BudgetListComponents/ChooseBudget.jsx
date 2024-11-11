import indvidual from "/src/assets/individual.png";
import group from "/src/assets/group.png";

export default function ChooseBudget(props) {

    // behavior for back button to go back to budget list page
    const backBehavior = () => {
        props.setShowLists(true);
    }

    // keep track of which budget option user chose
    function choiceBehavior(budgetPlan) {
        props.setBudgetType(true);
        props.setGroup(budgetPlan);
    }

    return (
        <div className="flex flex-col justify-center items-center w-full h-screen">

            <div className="mb-5 text-3xl font-bold">
                <p>Choose Budget Type</p>
            </div>

            <div className="flex flex-row justify-center items-center relative w-3/4 h-1/4 space-x-5">

                <div onClick={() => choiceBehavior(false)} className="flex flex-row justify-center items-center w-1/2 h-full text-2xl font-semibold space-x-5 bg-blue-300 hover:bg-blue-200 hover:cursor-pointer hover:shadow-lg hover:shadow-blue-800 hover:font-bold rounded-md">
                    <h1>Individual</h1>
                    <img src={indvidual} width={60} height={60} />
                </div>

                <div onClick={() => choiceBehavior(true)} className="flex flex-row justify-center items-center w-1/2 h-full text-2xl font-semibold space-x-5 bg-blue-300 hover:bg-blue-200 hover:cursor-pointer hover:shadow-lg hover:shadow-blue-800 hover:font-bold rounded-md">
                    <h1>Group</h1>
                    <img src={group} width={60} height={60} />
                </div>
            </div>

            <div onClick={backBehavior} className="mt-5 text-blue-700 hover:text-blue-500 hover:cursor-pointer hover:underline">
                <p>Go Back to Previous Screen</p>
            </div>
        </div>
    );

}