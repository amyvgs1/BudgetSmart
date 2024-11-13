import { useState, useEffect } from "react";
import ListItem from "./ListItem";
import { supabase } from '../../config/supabase';

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
    const [currCategory, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Fetch categories when component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data, error } = await supabase
                    .from('category')
                    .select('*');
                
                if (error) throw error;
                setCategories(data);
                if (data.length > 0) setCategory(data[0].category_id); // Set default category
            } catch (error) {
                console.error('Error fetching categories:', error);
                setErrorMessage("Failed to load categories");
            }
        };

        fetchCategories();
    }, []);

    // logic for submitting a budget plan form
    const submitBehavior = async(e) => {
        e.preventDefault();
        
        // Validation
        if (budgetName === "") {
            setErrorMessage("Please Provide a Valid Budget Plan Name");
            return;
        }

        if (!startDate || !endDate) {
            setErrorMessage("Please provide both start and end dates");
            return;
        }

        // Validate end date is after start date
        if (new Date(endDate) < new Date(startDate)) {
            setErrorMessage("End date must be after start date");
            return;
        }

        try {
            // First, insert the budget plan
            const { data: budgetData, error: budgetError } = await supabase
                .from('budget_plan')
                .insert([{
                    user_id: sessionStorage.getItem("user_id"),
                    budget_name: budgetName,
                    total_budget: budgetAmount,
                    curr_val: 0,
                    successful: false,
                    is_group_plan: props.isGroup,
                    start_date: startDate,
                    end_date: endDate
                }])
                .select()
                .single();

            if (budgetError) throw budgetError;

            // Insert budget items
            if (listItems.length > 0) {
                const budgetItems = listItems.map(item => ({
                    budget_id: budgetData.budget_id,
                    category_id: parseInt(item.category),
                    amount: parseFloat(item.amount),
                    item_name: item.name
                }));

                const { error: itemsError } = await supabase
                    .from('budget_items')
                    .insert(budgetItems);

                if (itemsError) throw itemsError;
            }

            // Insert group members if it's a group plan
            if (props.isGroup && memberList.length > 0) {
                const groupMembers = memberList.map(memberName => ({
                    budget_id: budgetData.budget_id,
                    member_name: memberName
                }));

                const { error: membersError } = await supabase
                    .from('budget_group_members')
                    .insert(groupMembers);

                if (membersError) throw membersError;
            }

            props.setShowLists(true);

        } catch (error) {
            console.error('Error creating budget:', error);
            setErrorMessage("Failed to create budget. Please try again.");
        }
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

        if (currCategory === "") {
            setErrorMessage("Please Select a Category for Budget Item");
            return;
        }

        // add items to item list
        addListItem([...listItems, { name: currname, category: currCategory, amount: curramount }]);

        // after each item submit, clear values for next potential item
        setErrorMessage("");
        setItemName("");
        setCategory("");
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
                <form onSubmit={submitBehavior} className="flex flex-col justify-center items-center w-3/4 space-y-5">
                    {errorMessage !== "" && <h1 className="text-red-400">{errorMessage}</h1>}

                    <p>Budget Name:</p>
                    <div className="w-full">
                        <input placeholder="Budget Name" className="bg-gray-200 w-full h-10 rounded-md p-5" value={budgetName} onChange={(e) => setBudgetName(e.target.value)} />
                    </div>

                    <p>Budget Amount:</p>
                    <div className="flex flex-row w-full justify-center items-center space-x-1">
                        <p>$</p>
                        <input placeholder="Budget Amount" className="bg-gray-200 h-10 rounded-md p-5 w-3/4" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)}/>
                    </div>

                    <div className="flex flex-row justify-between w-full space-x-4">
                        <div className="flex flex-col w-1/2">
                            <label className="mb-2">Start Date:</label>
                            <input 
                                type="date" 
                                className="bg-gray-200 h-10 rounded-md p-2 focus:bg-gray-100"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col w-1/2">
                            <label className="mb-2">End Date:</label>
                            <input 
                                type="date" 
                                className="bg-gray-200 h-10 rounded-md p-2 focus:bg-gray-100"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                                min={startDate} // Prevent end date being before start date
                            />
                        </div>
                    </div>

                    {props.isGroup && (
                        <div className="flex flex-col justify-center items-center w-full">
                            <p>Add Group Members:</p>
                            <div className="flex flex-row w-full space-x-2">
                                <input 
                                    placeholder="member name" 
                                    className="bg-gray-200 w-3/4 h-10 rounded-md p-5" 
                                    value={memberName} 
                                    onChange={(e) => setMemberName(e.target.value)}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => handleTeamMember(memberName)} 
                                    className="w-1/4 h-10 bg-orange-400 hover:bg-orange-300 rounded-md"
                                >
                                    Add Member
                                </button>
                            </div>
                            
                            {/* Display added members */}
                            <div className="mt-4 w-full">
                                {memberList.length > 0 && (
                                    <div className="flex flex-col space-y-2">
                                        <p className="font-semibold">Added Members:</p>
                                        {memberList.map((member, index) => (
                                            <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                                                <span>{member}</span>
                                                <button 
                                                    onClick={() => addMember(memberList.filter((_, i) => i !== index))}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <p>Add Budget Items:</p>
                    <div className="w-full flex flex-row justify-center items-center space-x-2">

                        <div className="flex flex-row w-3/4">
                            <input 
                                placeholder="Budget Item Name" 
                                className="bg-gray-200 w-3/4 h-10 focus:bg-gray-100 p-5" 
                                value={itemName} 
                                onChange={(e) => setItemName(e.target.value)} 
                            />
                            <div className="border-l-2 border-gray-300 h-10 bg-blue-400 w-0.5"></div>
                            <select 
                                className="w-1/4 bg-gray-200 h-10" 
                                value={currCategory} 
                                onChange={handleSelection}
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category.category_id} value={category.category_id}>
                                        {category.category_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <input 
                            placeholder="budget amount" 
                            className="bg-gray-200 w-1/4 h-10 rounded-md focus:bg-gray-100 p-5" 
                            value={itemAmount} 
                            onChange={(e) => setItemAmount(e.target.value)} 
                        />

                        <div className="flex justify-center items-center text-center rounded-full bg-orange-500 h-10 w-10 hover:cursor-pointer hover:bg-orange-200" 
                            onClick={() => handleListItem(itemName, itemAmount)}
                        >
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