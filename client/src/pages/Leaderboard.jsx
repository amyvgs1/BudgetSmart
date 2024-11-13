import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

export default function LeaderBoard() {
    const [activeView, setActiveView] = useState('global');
    const [friendsData, setFriendsData] = useState([]);
    const [globalData, setGlobalData] = useState([]);
    const userId = sessionStorage.getItem("user_id");

    // Fetch global data
    useEffect(() => {
        if (activeView === 'global') {
            fetchGlobalLeaderboard();
        }
    }, [activeView]);

    // Fetch friends data
    useEffect(() => {
        if (activeView === 'friends') {
            fetchFriendsLeaderboard();
        }
    }, [activeView]);

    const fetchGlobalLeaderboard = async () => {
        try {
            // First get the current user's savings data
            const { data: currentUserSavings, error: currentUserError } = await supabase
                .from('user_savings')
                .select(`
                    user_id,
                    total_saved,
                    savings_goal,
                    users (
                        username
                    )
                `)
                .eq('user_id', userId)
                .single();

            if (currentUserError && currentUserError.code !== 'PGRST116') { // Ignore "not found" error
                throw currentUserError;
            }

            // Then get all users' data
            const { data: users, error } = await supabase
                .from('users')
                .select(`
                    user_id,
                    username
                `);

            if (error) throw error;

            // Get all savings data
            const { data: allSavings, error: savingsError } = await supabase
                .from('user_savings')
                .select('*');

            if (savingsError) throw savingsError;

            // Combine the data
            const transformedUsers = users.map(user => {
                const savings = allSavings?.find(s => s.user_id === user.user_id) || {
                    total_saved: 0,
                    savings_goal: 2000
                };

                return {
                    username: user.username,
                    totalSaved: savings.total_saved || 0,
                    goal: savings.savings_goal || 2000
                };
            })
            .sort((a, b) => b.totalSaved - a.totalSaved)
            .map((user, index) => ({
                ...user,
                rank: index + 1
            }));

            // Highlight current user
            const finalData = transformedUsers.map(user => ({
                ...user,
                isCurrentUser: user.username === currentUserSavings?.users?.username
            }));

            setGlobalData(finalData);
        } catch (error) {
            console.error('Error fetching global leaderboard:', error);
            setGlobalData([]);
        }
    };

    const fetchFriendsLeaderboard = async () => {
        try {
            // Get current user's data with savings
            const { data: currentUser, error: currentUserError } = await supabase
                .from('user_savings')
                .select(`
                    total_saved,
                    savings_goal,
                    users (
                        username
                    )
                `)
                .eq('user_id', userId)
                .single();

            if (currentUserError) throw currentUserError;

            // Get all friends (both as user and friend)
            const { data: friendsAsUser, error: friendsAsUserError } = await supabase
                .from('friends')
                .select(`
                    friend:users!friends_friend_id_fkey (
                        user_id,
                        username
                    )
                `)
                .eq('user_id', userId)
                .eq('status', 'accepted');

            const { data: friendsAsFriend, error: friendsAsFriendError } = await supabase
                .from('friends')
                .select(`
                    user:users!friends_user_id_fkey (
                        user_id,
                        username
                    )
                `)
                .eq('friend_id', userId)
                .eq('status', 'accepted');

            if (friendsAsUserError) throw friendsAsUserError;
            if (friendsAsFriendError) throw friendsAsFriendError;

            // Get all friend IDs
            const friendIds = [
                ...friendsAsUser.map(f => f.friend.user_id),
                ...friendsAsFriend.map(f => f.user.user_id)
            ];

            // Fetch savings data for all friends
            const { data: friendsSavings, error: savingsError } = await supabase
                .from('user_savings')
                .select('*')
                .in('user_id', friendIds);

            if (savingsError) throw savingsError;

            // Combine all friends data
            const allFriends = [
                ...friendsAsUser.map(f => {
                    const savings = friendsSavings.find(s => s.user_id === f.friend.user_id);
                    return {
                        username: f.friend.username,
                        totalSaved: savings?.total_saved || 0,
                        goal: savings?.savings_goal || 2000,
                        isCurrentUser: false
                    };
                }),
                ...friendsAsFriend.map(f => {
                    const savings = friendsSavings.find(s => s.user_id === f.user.user_id);
                    return {
                        username: f.user.username,
                        totalSaved: savings?.total_saved || 0,
                        goal: savings?.savings_goal || 2000,
                        isCurrentUser: false
                    };
                })
            ];

            // Add current user and combine all data
            const allUsers = [
                {
                    username: currentUser.users.username,
                    totalSaved: currentUser.total_saved || 0,
                    goal: currentUser.savings_goal || 2000,
                    isCurrentUser: true
                },
                ...allFriends
            ];

            // Sort by total saved and add ranks
            const rankedUsers = allUsers
                .sort((a, b) => b.totalSaved - a.totalSaved)
                .map((user, index) => ({
                    ...user,
                    rank: index + 1
                }));

            console.log('Transformed friends data:', rankedUsers);
            setFriendsData(rankedUsers);

        } catch (error) {
            console.error('Error fetching friends leaderboard:', error);
            setFriendsData([]);
        }
    };

    // Function to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Function to calculate progress percentage
    const calculateProgress = (saved, goal) => {
        return Math.min((saved / goal) * 100, 100);
    };

    return (
        <div className="min-h-screen bg-gray-100 pt-20 font-Outfit">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">BudgetSmart Leaderboard</h1>
                    
                    {/* Toggle Buttons */}
                    <div className="flex justify-center gap-4 mb-4 mt-6">
                        <button 
                            onClick={() => setActiveView('global')}
                            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                                activeView === 'global' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                        >
                            Global
                        </button>
                        <button 
                            onClick={() => setActiveView('friends')}
                            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                                activeView === 'friends' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                        >
                            Friends
                        </button>
                    </div>
                    
                    <p className="text-gray-600">
                        {activeView === 'global' ? 'Top Savers Worldwide' : 'Your Friends\' Rankings'}
                    </p>
                </div>

                {/* Leaderboard Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left">Rank</th>
                                <th className="px-6 py-3 text-left">Username</th>
                                <th className="px-6 py-3 text-left">Total Saved</th>
                                <th className="px-6 py-3 text-left">Goal</th>
                                <th className="px-6 py-3 text-left">Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(activeView === 'global' ? globalData : friendsData).map((user) => (
                                <tr 
                                    key={user.rank}
                                    className={`border-b hover:bg-gray-50 ${
                                        user.rank <= 3 ? 'bg-blue-50' : ''
                                    } ${
                                        user.isCurrentUser ? 'bg-yellow-50' : ''
                                    }`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {user.rank === 1 && <span className="text-2xl mr-2">🥇</span>}
                                            {user.rank === 2 && <span className="text-2xl mr-2">🥈</span>}
                                            {user.rank === 3 && <span className="text-2xl mr-2">🥉</span>}
                                            {user.rank > 3 && <span className="font-semibold">{user.rank}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-semibold ${user.isCurrentUser ? 'text-blue-600' : ''}`}>
                                            {user.username} {user.isCurrentUser && '(You)'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{formatCurrency(user.totalSaved)}</td>
                                    <td className="px-6 py-4">{formatCurrency(user.goal)}</td>
                                    <td className="px-6 py-4 w-1/4">
                                        <div className="relative pt-1">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div className={`text-xs font-semibold inline-block ${
                                                    calculateProgress(user.totalSaved, user.goal) >= 100 
                                                        ? 'text-green-600' 
                                                        : 'text-blue-600'
                                                }`}>
                                                    {calculateProgress(user.totalSaved, user.goal).toFixed(1)}%
                                                </div>
                                            </div>
                                            <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                                                <div 
                                                    style={{ width: `${calculateProgress(user.totalSaved, user.goal)}%` }}
                                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                                        calculateProgress(user.totalSaved, user.goal) >= 100 
                                                            ? 'bg-green-500' 
                                                            : 'bg-blue-500'
                                                    }`}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Legend */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>🥇 Gold Tier • 🥈 Silver Tier • 🥉 Bronze Tier</p>
                </div>
            </div>
        </div>
    );
}