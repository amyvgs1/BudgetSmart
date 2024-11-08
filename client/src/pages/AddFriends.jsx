import { useState } from 'react';

export default function AddFriends() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('search');
    const [pendingList, setPendingList] = useState(new Set()); // Track pending requests

    // Static data for demonstration
    const sampleUsers = [
        { id: 1, username: "sarah.mitchell", name: "Sarah Mitchell" },
        { id: 2, username: "mike_wilson87", name: "Mike Wilson" },
        { id: 3, username: "emily.brooks", name: "Emily Brooks" },
        { id: 4, username: "alex_thompson", name: "Alex Thompson" },
    ];

    const [pendingRequests, setPendingRequests] = useState([
        { id: 1, username: "david.parker22", name: "David Parker", type: "received" },
        { id: 2, username: "lisa_anderson", name: "Lisa Anderson", type: "sent" },
        { id: 3, username: "chris.murphy89", name: "Chris Murphy", type: "received" },
    ]);

    const [currentFriends, setCurrentFriends] = useState([
        { id: 1, username: "john.doe", name: "John Doe", since: "March 2024" },
        { id: 2, username: "amy.smith", name: "Amy Smith", since: "February 2024" },
        { id: 3, username: "robert_jones", name: "Robert Jones", since: "January 2024" },
    ]);

    // Handle add friend button
    const handleAddFriend = (userId) => {
        setPendingList(prev => new Set([...prev, userId]));
        // Add to pending requests
        const user = sampleUsers.find(u => u.id === userId);
        setPendingRequests(prev => [...prev, {
            id: userId,
            username: user.username,
            name: user.name,
            type: "sent"
        }]);
    };

    // Handle accept friend request
    const handleAcceptRequest = (requestId) => {
        // Find the request
        const request = pendingRequests.find(r => r.id === requestId);
        // Add to friends
        setCurrentFriends(prev => [...prev, {
            id: requestId,
            username: request.username,
            name: request.name,
            since: "Just now"
        }]);
        // Remove from pending
        setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    };

    // Handle decline/remove friend
    const handleRemoveRequest = (requestId) => {
        setPendingRequests(prev => prev.filter(r => r.id !== requestId));
        setPendingList(prev => {
            const newSet = new Set(prev);
            newSet.delete(requestId);
            return newSet;
        });
    };

    // Handle remove friend
    const handleRemoveFriend = (friendId) => {
        setCurrentFriends(prev => prev.filter(f => f.id !== friendId));
    };

    // Filter users based on search query
    const filteredUsers = sampleUsers.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                            {filteredUsers.map(user => (
                                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                    <div>
                                        <p className="font-semibold">{user.name}</p>
                                        <p className="text-gray-600 text-sm">@{user.username}</p>
                                    </div>
                                    {pendingList.has(user.id) ? (
                                        <button 
                                            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full transition-all duration-200"
                                            disabled
                                        >
                                            Pending
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleAddFriend(user.id)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200"
                                        >
                                            Add Friend
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Requests Section */}
                    {activeTab === 'requests' && (
                        <div className="space-y-4">
                            {pendingRequests.map(request => (
                                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                    <div>
                                        <p className="font-semibold">{request.name}</p>
                                        <p className="text-gray-600 text-sm">@{request.username}</p>
                                        <p className="text-sm text-blue-500">{request.type === 'received' ? 'Wants to be your friend' : 'Request sent'}</p>
                                    </div>
                                    {request.type === 'received' && (
                                        <div className="space-x-2">
                                            <button 
                                                onClick={() => handleAcceptRequest(request.id)}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200"
                                            >
                                                Accept
                                            </button>
                                            <button 
                                                onClick={() => handleRemoveRequest(request.id)}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all duration-200"
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                    {request.type === 'sent' && (
                                        <button 
                                            onClick={() => handleRemoveRequest(request.id)}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Friends Section */}
                    {activeTab === 'friends' && (
                        <div className="space-y-4">
                            {currentFriends.map(friend => (
                                <div key={friend.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                    <div>
                                        <p className="font-semibold">{friend.name}</p>
                                        <p className="text-gray-600 text-sm">@{friend.username}</p>
                                        <p className="text-sm text-gray-500">Friends since {friend.since}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleRemoveFriend(friend.id)}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all duration-200"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
