import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddFriends() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('search');
    const [users, setUsers] = useState([]);
    const [pendingRequests, setPendingRequests] = useState({
        received: [],
        sent: []
    });
    const [currentFriends, setCurrentFriends] = useState([]);
    const userId = sessionStorage.getItem("user_id");

    useEffect(() => {
        console.log('Logged in as user ID:', userId);
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (activeTab === 'search' && searchQuery.length >= 1) {
                searchUsers();
            }
        }, 300); // Add a small delay to prevent too many requests

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    useEffect(() => {
        if (activeTab === 'requests') {
            fetchRequests();
        } else if (activeTab === 'friends') {
            fetchFriends();
        }
    }, [activeTab]);

    const searchUsers = async () => {
        try {
            console.log('Current user ID:', userId);
            console.log('Searching for:', searchQuery);
            const response = await axios.get(`http://localhost:8080/api/users/search`, {
                params: { 
                    query: searchQuery, 
                    currentUserId: userId 
                }
            });
            console.log('Search results:', response.data);
            setUsers(response.data.users || []);
        } catch (error) {
            console.error('Error searching users:', error);
            setUsers([]);
        }
    };

    const fetchRequests = async () => {
        try {
            console.log('Fetching requests for user:', userId);
            const response = await axios.get(`http://localhost:8080/api/friends/requests/${userId}`);
            console.log('Requests response:', response.data);
            setPendingRequests({
                received: response.data.received || [],
                sent: response.data.sent || []
            });
        } catch (error) {
            console.error('Error fetching requests:', error);
            setPendingRequests({ received: [], sent: [] });
        }
    };

    const fetchFriends = async () => {
        try {
            console.log('Fetching friends for user:', userId);
            const response = await axios.get(`http://localhost:8080/api/friends/${userId}`);
            console.log('Friends response:', response.data);
            setCurrentFriends(response.data.friends || []);
        } catch (error) {
            console.error('Error fetching friends:', error);
            setCurrentFriends([]);
        }
    };

    const handleAddFriend = async (friendId) => {
        try {
            console.log('Sending friend request:', { userId, friendId });
            const response = await axios.post('http://localhost:8080/api/friends/request', {
                userId: Number(userId),  // Ensure userId is a number
                friendId: Number(friendId)  // Ensure friendId is a number
            });
            console.log('Friend request response:', response.data);
            
            // Show success message
            alert('Friend request sent successfully!');
            
            // Refresh the lists
            searchUsers();
            fetchRequests();
        } catch (error) {
            console.error('Error sending friend request:', error);
            // Show error message to user
            alert(error.response?.data?.error || 'Failed to send friend request');
        }
    };

    const handleAcceptRequest = async (friendshipId) => {
        try {
            await axios.put(`http://localhost:8080/api/friends/request/${friendshipId}`, {
                status: 'accepted'
            });
            fetchRequests(); // Refresh pending requests
            fetchFriends(); // Refresh friends list
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleRemoveRequest = async (friendshipId) => {
        try {
            console.log('Removing friend request:', friendshipId);
            await axios.delete(`http://localhost:8080/api/friends/${friendshipId}`);
            
            // Refresh both lists
            fetchRequests();
            searchUsers(); // Refresh search results as the user might now be searchable
            
            // Show success message
            alert('Friend request removed successfully');
        } catch (error) {
            console.error('Error removing friend request:', error);
            alert('Failed to remove friend request');
        }
    };

    const handleCancelRequest = async (friendshipId) => {
        try {
            console.log('Canceling friend request:', friendshipId);
            await axios.delete(`http://localhost:8080/api/friends/${friendshipId}`);
            
            // Refresh both lists
            fetchRequests();
            searchUsers(); // Refresh search results as the user might now be searchable
            
            // Show success message
            alert('Friend request canceled successfully');
        } catch (error) {
            console.error('Error canceling friend request:', error);
            alert('Failed to cancel friend request');
        }
    };

    const handleRemoveFriend = async (friendshipId) => {
        try {
            await axios.delete(`http://localhost:8080/api/friends/${friendshipId}`);
            fetchFriends(); // Refresh friends list
        } catch (error) {
            console.error('Error removing friend:', error);
        }
    };

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
                                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                    <div>
                                        <p className="font-semibold">{user.name}</p>
                                        <p className="text-gray-600 text-sm">@{user.username}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleAddFriend(user.id)}
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
                                                <p className="font-semibold">{request.name}</p>
                                                <p className="text-gray-600 text-sm">@{request.username}</p>
                                            </div>
                                            <div className="space-x-2">
                                                <button 
                                                    onClick={() => handleAcceptRequest(request.friendship_id)}
                                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                                >
                                                    Accept
                                                </button>
                                                <button 
                                                    onClick={() => handleRemoveRequest(request.friendship_id)}
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
                                                <p className="font-semibold">{request.name}</p>
                                                <p className="text-gray-600 text-sm">@{request.username}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleCancelRequest(request.friendship_id)}
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
                                    <div key={friend.user_id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <p className="font-semibold">{friend.name}</p>
                                            <p className="text-gray-600 text-sm">@{friend.username}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleRemoveFriend(friend.friendship_id)}
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
