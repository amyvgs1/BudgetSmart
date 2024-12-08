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
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [friends, setFriends] = useState([]);

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

    useEffect(() => {
        if (props.isGroup) {
            fetchFriends();
        }
    }, [props.isGroup]);

    const fetchFriends = async () => {
        try {
            const userId = sessionStorage.getItem('user_id');
            
            // Get friends where user is the requester
            const { data: friendsAsUser, error: friendsAsUserError } = await supabase
                .from('friends')
                .select('friend:friend_id(user_id, username, first_name, last_name)')
                .eq('user_id', userId)
                .eq('status', 'accepted');

            // Get friends where user is the friend
            const { data: friendsAsFriend, error: friendsAsFriendError } = await supabase
                .from('friends')
                .select('user:user_id(user_id, username, first_name, last_name)')
                .eq('friend_id', userId)
                .eq('status', 'accepted');

            if (friendsAsUserError || friendsAsFriendError) throw error;

            const allFriends = [
                ...friendsAsUser.map(f => f.friend),
                ...friendsAsFriend.map(f => f.user)
            ];
            setFriends(allFriends);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const searchUsers = async (term) => {
        if (term.length < 3) {
            setSearchResults([]);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('users')
                .select('user_id, username, first_name, last_name')
                .ilike('username', `%${term}%`)
                .limit(5);

            if (error) throw error;
            
            // Add console.log to debug
            console.log('Search results:', data);
            
            // Filter out current user and already selected members
            const filteredResults = data.filter(user => 
                user.user_id !== sessionStorage.getItem('user_id') &&
                !selectedMembers.find(m => m.user_id === user.user_id)
            );

            setSearchResults(filteredResults);
        } catch (error) {
            console.error('Error searching users:', error);
            setSearchResults([]);
        }
    };

    const addGroupMember = (member) => {
        if (!selectedMembers.find(m => m.user_id === member.user_id)) {
            setSelectedMembers([...selectedMembers, member]);
        }
        setSearchTerm('');
        setSearchResults([]);
    };

    const removeMember = (userId) => {
        setSelectedMembers(selectedMembers.filter(m => m.user_id !== userId));
    };

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

            // If it's a group plan, add members
            if (props.isGroup && selectedMembers.length > 0) {
                try {
                    // First, let's log the table structure
                    const { data: tableInfo, error: tableError } = await supabase
                        .from('notifications')
                        .select()
                        .limit(1);
                    
                    console.log('Notifications table structure:', tableInfo);

                    const groupMembers = selectedMembers.map(member => ({
                        budget_id: budgetData.budget_id,
                        member_id: member.user_id,
                        username: member.username
                    }));

                    const { error: membersError } = await supabase
                        .from('group_plan_members')
                        .insert(groupMembers);

                    if (membersError) throw membersError;

                    // Create notifications for each member
                    const notifications = selectedMembers.map(member => ({
                        user_id: member.user_id,
                        type: 'group_plan_added',
                        // Try both message and content
                        ...(tableInfo?.[0]?.message !== undefined ? { message: `You've been added to the group budget plan: ${budgetName}` } : {}),
                        ...(tableInfo?.[0]?.content !== undefined ? { content: `You've been added to the group budget plan: ${budgetName}` } : {}),
                        read: false
                    }));

                    console.log('Attempting to insert notifications:', notifications);

                    const { error: notifError } = await supabase
                        .from('notifications')
                        .insert(notifications);

                    if (notifError) {
                        console.error('Notification error:', notifError);
                        throw notifError;
                    }
                } catch (error) {
                    console.error('Error in group member/notification creation:', error);
                    throw error;
                }
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
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Add Group Members</h3>
                            
                            {/* Friends List */}
                            <div className="mb-4">
                                <h4 className="text-md mb-2">Your Friends</h4>
                                <div className="flex flex-wrap gap-2">
                                    {friends.map(friend => (
                                        <button
                                            key={friend.user_id}
                                            onClick={() => addGroupMember(friend)}
                                            className="px-3 py-1 bg-blue-100 rounded-full hover:bg-blue-200"
                                        >
                                            {friend.username}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Search Users */}
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        console.log('Search term:', value); // Debug log
                                        setSearchTerm(value);
                                        searchUsers(value);
                                    }}
                                    placeholder="Search users by username..."
                                    className="w-full p-2 border rounded"
                                />
                                {searchResults.length > 0 && (
                                    <div className="mt-2 border rounded-lg shadow-sm">
                                        {searchResults.map(user => (
                                            <div
                                                key={user.user_id}
                                                onClick={() => addGroupMember(user)}
                                                className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                            >
                                                <div className="font-medium">{user.username}</div>
                                                <div className="text-sm text-gray-600">
                                                    {user.first_name} {user.last_name}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Selected Members */}
                            <div>
                                <h4 className="text-md mb-2">Selected Members:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedMembers.map(member => (
                                        <div
                                            key={member.user_id}
                                            className="px-3 py-1 bg-blue-200 rounded-full flex items-center"
                                        >
                                            <span>{member.username}</span>
                                            <button
                                                onClick={() => removeMember(member.user_id)}
                                                className="ml-2 text-red-500"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
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