import { useState } from "react";
import ListItem from "./ListItem";
import axios from "axios";

// this page is responsible for creating budget plans

export default function PlanForm(props) {
    const [errorMessage, setErrorMessage] = useState("");
    const [listItems, addListItem] = useState([]);
    const [memberList, addMember] = useState([]);
    const [memberName, setMemberName] = useState("");
    const [budgetName, setBudgetName] = useState("");
    const [budgetAmount, setBudgetAmount] = useState("");
    const [itemName, setItemName] = useState("");
    const [itemAmount, setItemAmount] = useState(0);
    const [currCategory, setCategory] = useState(1);


    // logic for submitting a budget plan form
    const submitBehavior = async(e) => {
        // validation logic
        if (budgetName === "") {
            setErrorMessage("Please Provide a Valid Budget Plan Name");
            return;
        }

        // on success logic
        // props.addBudgetLists({ name: budgetName, items: listItems, isGroup: props.isGroup });

        console.log(listItems);
        const res = await axios.post("http://localhost:8080/api/mybudgets-create", 
            {
                user_id: sessionStorage.getItem("user_id"), 
                budgetName: budgetName,
                budgetAmount: budgetAmount,
                isGroup: props.isGroup,
                budgetItems:listItems
            }
        );

        console.log(res.data.message);
        props.setShowLists(true);
        e.preventDefault();
    }

    const handleSelection = (e) => {
        setCategory(e.target.value);
    }


    // logic for going back to previous step
    const backBehavior = () => {
        props.setBudgetType(false);
    }

    const handleListItem = (currname, curramount) => {
        if (currname === "" || curramount === 0) {
            setErrorMessage("Please Give a Name For The Budget Item or Provide Proper Budget Item Amount");
            return;
        }

        if (currCategory === "category") {
            setErrorMessage("Please Provide Proper Category for Budget Item");
            return;
        }

        // add items to item list
        addListItem([...listItems, { name: currname, category: currCategory, amount: curramount }]);

        // after each item submit, clear values for next potential item
        setErrorMessage("");
        setItemName("");
        setCategory(1);
        setItemAmount(0);
    }


    // adding memebers to a group budget plan
    const handleTeamMember = (name) => {
        if (name === ""){
            setErrorMessage("Please Provide a Team Member Name");
            return;
        }
        
        addMember([...memberList, name]);
        setMemberName("");
    }

    return (
        <div className="flex flex-col justify-center items-center w-full h-full font-Outfit mt-20">

            <div onClick={backBehavior} className="top-0 left-0 fixed mt-20 ml-5 text-2xl text-blue-700 hover:cursor-pointer hover:text-blue-500">
                <p>Back</p>
            </div>

            <div className="text-3xl font-semibold mt-10">
                <h1>{`${props.isGroup ? "Group Plan" : "Individual Plan"}`}</h1>
            </div>


            <div className="flex flex-col justify-center items-center h-full w-1/2 shadow-lg overflow-y-scroll p-10">
                <form className="flex flex-col items-center w-full h-full space-y-7">
                    {errorMessage !== "" && <h1 className="text-red-400">{errorMessage}</h1>}

                    <p>Budget Name:</p>
                    <div className="w-full">
                        <input placeholder="Sample input" className="bg-gray-200 w-full h-10 rounded-md p-5" value={budgetName} onChange={(e) => setBudgetName(e.target.value)} />
                    </div>

                    <p>Budget Amount:</p>
                    <div className="flex flex-row w-full justify-center items-center space-x-1">
                        <p>$</p>
                        <input placeholder="budget amount" className="bg-gray-200 h-10 rounded-md p-5 w-3/4" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)}/>
                    </div>

                    <div className="flex flex-row justify-center items-center w-full space-x-3 opacity-50">

                        <div className="flex flex-col w-1/2">
                            <p>Start Date:</p>
                            <input className="bg-gray-200 h-10 rounded-md p-5 w-full" disabled />
                        </div>

                        <div className="flex flex-col w-1/2">
                            <p>End Date:</p>
                            <input className="bg-gray-200 h-10 rounded-md p-5 w-full" disabled/>
                        </div>
                    </div>

                    {props.isGroup &&
                        <div className="flex flex-col justify-center items-center w-full">
                            <p>Add Group Members:</p>
                            <div className="flex flex-row w-full space-x-2">
                                <input placeholder="member name" className="bg-gray-200 w-3/4 h-10 rounded-md p-5" value={memberName} onChange={(e) => setMemberName(e.target.value)}></input>
                                <button type="button" onClick={() => handleTeamMember(memberName)} className="w-1/4 h-10 bg-orange-400">Add Member</button>
                            </div>

                            {/* Implement a display for added members*/}
                            <div>

                            </div>
                        </div>
                    }

                    <p>Add Budget Items:</p>
                    <div className="w-full flex flex-row justify-center items-center space-x-2">

                        <div className="flex flex-row w-3/4">
                            <input placeholder="sample item" className="bg-gray-200 w-3/4 h-10 focus:bg-gray-100 p-5" value={itemName} onChange={(e) => setItemName(e.target.value)} />
                            <div className="border-l-2 border-gray-300 h-10 bg-blue-400 w-0.5"></div>
                            <select className="w-1/4 bg-gray-200 h-10" value={currCategory} onChange={handleSelection}>
                                <option value={1} disabled>Category</option>
                                <option value={2}>Food</option>
                                <option value={3}>Bills</option>
                                <option value={4}>Clothing</option>
                                <option value={5}>Other</option>
                            </select>
                        </div>

                        <input placeholder="budget amount" className="bg-gray-200 w-1/4 h-10 rounded-md focus:bg-gray-100 p-5" value={itemAmount} onChange={(e) => setItemAmount(e.target.value)} />

                        <div className="flex justify-center items-center text-center rounded-full bg-orange-500 h-10 w-10 hover:cursor-pointer hover:bg-orange-200" onClick={() => handleListItem(itemName, itemAmount)}>
                            <p>+</p>
                        </div>
                    </div>


                    {listItems.length !== 0 ?
                        <div className="h-1/3 flex flex-col justify-content items-center w-full space-y-3 mb-10">
                            <h1>Current Budget Items:</h1>
                            <div className="flex flex-col justify-content items-center space-y-3 h-4/5 w-full overflow-y-scroll">
                                {listItems.map((element, index) => {
                                    return <ListItem addListItem={addListItem} itemsList={listItems} itemName={element.name} itemAmount={element.amount} index={index} />
                                })}
                            </div>
                            <button type="button" onClick={submitBehavior} className="rounded-lg bg-orange-200 w-1/2 h-1/5 hover:pointer-cursor hover:bg-orange-100 p-2">Create Plan</button>
                        </div>
                        :
                        <div className="w-1/2 h-10 mb-10">
                            <button type="button" onClick={submitBehavior} className="rounded-lg bg-orange-200 w-full h-full hover:pointer-cursor hover:bg-orange-100 p-2">Create Plan</button>
                        </div>
                    }

                    {/* <div className="w-1/2 h-10 mb-10">
                        <button type="button" onClick={submitBehavior} className="rounded-lg bg-orange-200 w-full h-full hover:pointer-cursor hover:bg-orange-100">Create Plan</button>
                    </div> */}
                </form>
            </div>


        </div>
    );
}