import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

export default function AddFriends() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('search');
    const [users, setUsers] = useState([]);
    const [pendingRequests, setPendingRequests] = useState({
        received: [],
        sent: []
    });
    const [currentFriends, setCurrentFriends] = useState([]);
    const [mutualFriends, setMutualFriends] = useState({});
    const userId = sessionStorage.getItem("user_id");

    // Search users
    const searchUsers = async () => {
        try {
            console.log('Searching for:', searchQuery);
            
            // More flexible search query
            const { data, error } = await supabase
                .from('users')
                .select('user_id, username, first_name, last_name')
                .or(`username.ilike.%${searchQuery}%, email.ilike.%${searchQuery}%, first_name.ilike.%${searchQuery}%, last_name.ilike.%${searchQuery}%`)
                .neq('user_id', userId)
                .limit(10);

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            console.log('Search results:', data);

            // Filter out existing friends and pending requests
            const filteredUsers = data.filter(user => 
                !currentFriends.some(friend => friend.user_id === user.user_id) &&
                !pendingRequests.sent.some(req => req.friend_id === user.user_id) &&
                !pendingRequests.received.some(req => req.user_id === user.user_id)
            );

            console.log('Filtered results:', filteredUsers);
            setUsers(filteredUsers);

        } catch (error) {
            console.error('Error searching users:', error);
            setUsers([]);
        }
    };

    // Fetch friend requests
    const fetchRequests = async () => {
        try {
            console.log('Fetching requests for user:', userId);
            
            // Fetch sent requests
            const { data: sentData, error: sentError } = await supabase
                .from('friends')
                .select(`
                    friendship_id,
                    friend_id,
                    users!friends_friend_id_fkey (
                        username,
                        first_name,
                        last_name
                    )
                `)
                .eq('user_id', userId)
                .eq('status', 'pending');

            // Fetch received requests
            const { data: receivedData, error: receivedError } = await supabase
                .from('friends')
                .select(`
                    friendship_id,
                    user_id,
                    users!friends_user_id_fkey (
                        username,
                        first_name,
                        last_name
                    )
                `)
                .eq('friend_id', userId)
                .eq('status', 'pending');

            console.log('Requests data:', { sent: sentData, received: receivedData });

            if (sentError) throw sentError;
            if (receivedError) throw receivedError;

            setPendingRequests({
                sent: sentData || [],
                received: receivedData || []
            });
        } catch (error) {
            console.error('Error in fetchRequests:', error);
        }
    };

    // Fetch current friends
    const fetchFriends = async () => {
        try {
            console.log('Fetching friends for user:', userId);
            
            // Fetch friends where user is the sender
            const { data: sentFriends, error: sentError } = await supabase
                .from('friends')
                .select(`
                    friendship_id,
                    friend_id,
                    users!friends_friend_id_fkey (
                        username,
                        first_name,
                        last_name
                    )
                `)
                .eq('user_id', userId)
                .eq('status', 'accepted');

            // Fetch friends where user is the receiver
            const { data: receivedFriends, error: receivedError } = await supabase
                .from('friends')
                .select(`
                    friendship_id,
                    user_id,
                    users!friends_user_id_fkey (
                        username,
                        first_name,
                        last_name
                    )
                `)
                .eq('friend_id', userId)
                .eq('status', 'accepted');

            console.log('Friends data:', { sent: sentFriends, received: receivedFriends });

            if (sentError) throw sentError;
            if (receivedError) throw receivedError;

            // Combine both lists
            const allFriends = [
                ...(sentFriends || []).map(friend => ({
                    friendship_id: friend.friendship_id,
                    friend_id: friend.friend_id,
                    username: friend.users.username,
                    first_name: friend.users.first_name,
                    last_name: friend.users.last_name
                })),
                ...(receivedFriends || []).map(friend => ({
                    friendship_id: friend.friendship_id,
                    friend_id: friend.user_id,
                    username: friend.users.username,
                    first_name: friend.users.first_name,
                    last_name: friend.users.last_name
                }))
            ];

            console.log('Combined friends list:', allFriends);
            setCurrentFriends(allFriends);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    // Send friend request with notification
    const sendRequest = async (friendId, friendUsername) => {
        try {
            console.log('Starting friend request...', { userId, friendId });
            
            // Begin a transaction
            const { data: friendData, error: friendError } = await supabase
                .from('friends')
                .insert([{
                    user_id: userId,
                    friend_id: friendId,
                    status: 'pending'
                }])
                .select();

            console.log('Friend request result:', { friendData, friendError });

            if (friendError) {
                console.error('Supabase friend request error:', friendError);
                throw friendError;
            }

            try {
                // Create notification for recipient
                const { data: notifData, error: notifError } = await supabase
                    .from('notifications')
                    .insert([{
                        user_id: friendId,
                        type: 'friend_request',
                        message: `${sessionStorage.getItem('username')} sent you a friend request`,
                        related_id: userId
                    }])
                    .select();

                console.log('Notification result:', { notifData, notifError });

                if (notifError) {
                    console.error('Supabase notification error:', notifError);
                    // Don't throw here, just log the error
                }
            } catch (notifError) {
                console.error('Error creating notification:', notifError);
                // Continue execution even if notification fails
            }

            // Update UI
            setUsers(users.filter(user => user.user_id !== friendId));
            await fetchRequests();
            
            console.log('Friend request completed successfully');
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    // Accept friend request with notification
    const acceptRequest = async (friendshipId, friendId, friendUsername) => {
        try {
            // Update friend request status
            const { error: updateError } = await supabase
                .from('friends')
                .update({ status: 'accepted' })
                .eq('friendship_id', friendshipId);

            if (updateError) throw updateError;

            // Create notification for the original sender
            const { error: notifError } = await supabase
                .from('notifications')
                .insert([{
                    user_id: friendId,
                    type: 'friend_accepted',
                    message: `${sessionStorage.getItem('username')} accepted your friend request`,
                    related_id: userId
                }]);

            if (notifError) throw notifError;

            // Refresh lists
            await fetchRequests();
            await fetchFriends();
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    // Delete friend request
    const deleteRequest = async (friendshipId, friendId, type) => {
        try {
            const { error } = await supabase
                .from('friends')
                .delete()
                .eq('friendship_id', friendshipId);

            if (error) throw error;

            // Create notification if it's a rejection
            if (type === 'reject') {
                await supabase
                    .from('notifications')
                    .insert([{
                        user_id: friendId,
                        type: 'friend_rejected',
                        message: `${sessionStorage.getItem('username')} declined your friend request`,
                        related_id: userId
                    }]);
            }

            await fetchRequests();
        } catch (error) {
            console.error('Error deleting friend request:', error);
        }
    };

    // Get mutual friends
    const getMutualFriends = async (targetUserId) => {
        try {
            // Get current user's friends
            const { data: myFriends, error: myError } = await supabase
                .from('friends')
                .select('friend_id')
                .eq('user_id', userId)
                .eq('status', 'accepted');

            if (myError) throw myError;

            // Get target user's friends
            const { data: theirFriends, error: theirError } = await supabase
                .from('friends')
                .select('friend_id')
                .eq('user_id', targetUserId)
                .eq('status', 'accepted');

            if (theirError) throw theirError;

            // Find mutual friends
            const myFriendIds = myFriends.map(f => f.friend_id);
            const theirFriendIds = theirFriends.map(f => f.friend_id);
            const mutual = myFriendIds.filter(id => theirFriendIds.includes(id));

            // Get mutual friends' details
            if (mutual.length > 0) {
                const { data: mutualDetails, error: detailsError } = await supabase
                    .from('users')
                    .select('user_id, username, first_name, last_name')
                    .in('user_id', mutual);

                if (detailsError) throw detailsError;

                setMutualFriends(prev => ({
                    ...prev,
                    [targetUserId]: mutualDetails
                }));
            }
        } catch (error) {
            console.error('Error getting mutual friends:', error);
        }
    };

    // Add to useEffect for search results
    useEffect(() => {
        if (users.length > 0) {
            users.forEach(user => getMutualFriends(user.user_id));
        }
    }, [users]);

    // Search debounce effect
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.length >= 1) {  // Changed from 3 to 1
                searchUsers();
            } else {
                setUsers([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    // Tab change effect
    useEffect(() => {
        console.log('Tab changed to:', activeTab);
        if (activeTab === 'requests') {
            fetchRequests();
        }
    }, [activeTab]);

    // Add useEffect to fetch friends when tab changes
    useEffect(() => {
        if (activeTab === 'friends') {
            fetchFriends();
        }
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-gray-100 pt-20 font-Outfit">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Friends</h1>
                </div>

                {/* Navigation Tabs */}
                <div className="flex justify-center gap-4 mb-8">
                    <button 
                        onClick={() => setActiveTab('search')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                            activeTab === 'search' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                    >
                        Search Users
                    </button>
                    <button 
                        onClick={() => setActiveTab('requests')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                            activeTab === 'requests' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                    >
                        Friend Requests
                    </button>
                    <button 
                        onClick={() => setActiveTab('friends')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                            activeTab === 'friends' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                    >
                        My Friends
                    </button>
                </div>

                {/* Content Area */}
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
                    {/* Search Section */}
                    {activeTab === 'search' && (
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search users..."
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {users && users.map(user => (
                                <div key={user.user_id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                    <div>
                                        <p className="font-semibold">{user.first_name} {user.last_name}</p>
                                        <p className="text-gray-600 text-sm">@{user.username}</p>
                                    </div>
                                    <button 
                                        onClick={() => sendRequest(user.user_id, user.username)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                                    >
                                        Add Friend
                                    </button>
                                </div>
                            ))}
                            {searchQuery && users.length === 0 && (
                                <p className="text-center text-gray-500">No users found</p>
                            )}
                        </div>
                    )}

                    {/* Requests Section */}
                    {activeTab === 'requests' && (
                        <div className="space-y-6">
                            {/* Received Requests Section */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Received Requests</h3>
                                {pendingRequests.received && pendingRequests.received.length > 0 ? (
                                    pendingRequests.received.map(request => (
                                        <div key={request.friendship_id} className="flex items-center justify-between p-4 border rounded-lg mb-2">
                                            <div>
                                                <p className="font-semibold">
                                                    {request.users.first_name} {request.users.last_name}
                                                </p>
                                                <p className="text-gray-600 text-sm">
                                                    @{request.users.username}
                                                </p>
                                            </div>
                                            <div className="space-x-2">
                                                <button 
                                                    onClick={() => acceptRequest(request.friendship_id, request.user_id, request.users.username)}
                                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                                >
                                                    Accept
                                                </button>
                                                <button 
                                                    onClick={() => deleteRequest(request.friendship_id, request.user_id, 'reject')}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No pending requests</p>
                                )}
                            </div>

                            {/* Sent Requests Section */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Sent Requests</h3>
                                {pendingRequests.sent && pendingRequests.sent.length > 0 ? (
                                    pendingRequests.sent.map(request => (
                                        <div key={request.friendship_id} className="flex items-center justify-between p-4 border rounded-lg mb-2">
                                            <div>
                                                <p className="font-semibold">
                                                    {request.users.first_name} {request.users.last_name}
                                                </p>
                                                <p className="text-gray-600 text-sm">
                                                    @{request.users.username}
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => deleteRequest(request.friendship_id, request.friend_id, 'cancel')}
                                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                            >
                                                Cancel Request
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No sent requests</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Friends Section */}
                    {activeTab === 'friends' && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold mb-4">My Friends</h3>
                            {currentFriends.length > 0 ? (
                                currentFriends.map(friend => (
                                    <div key={friend.friendship_id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <p className="font-semibold">
                                                {friend.first_name} {friend.last_name}
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                @{friend.username}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => deleteRequest(friend.friendship_id, friend.friend_id, 'remove')}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            Remove Friend
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No friends yet</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
