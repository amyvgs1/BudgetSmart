import { useState, useEffect } from 'react';
import axios from 'axios';

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
            const response = await axios.get('http://localhost:8080/api/users/all');
            const users = response.data.users;

            // Users are already sorted and ranked on the server
            setGlobalData(users);
        } catch (error) {
            console.error('Error fetching global leaderboard:', error);
            setGlobalData([]);
        }
    };

    const fetchFriendsLeaderboard = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/friends/leaderboard/${userId}`);
            setFriendsData(response.data.friends);
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
                                    <td className="px-6 py-4 font-semibold">{user.username}</td>
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
