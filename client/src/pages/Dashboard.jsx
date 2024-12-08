// user dashboard, the first thing a user will see upon a successful login

// example of sessionStorage down below. using sessionStorage.getItem(whatever name) you can obtain values to reuse. when you refresh the page
// the data will persist. you can use the stored user_id for future queries now.

import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from '../config/supabase';

export default function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('User');
    const [budgetOverview, setBudgetOverview] = useState({
        totalBudget: 0,
        spent: 0,
        remaining: 0,
        savingsGoal: 0,
        savedAmount: 0,
        recentTransactions: [
            { id: 1, description: "Grocery Shopping", amount: -120, date: "2024-03-15" },
            { id: 2, description: "Salary Deposit", amount: 2500, date: "2024-03-14" },
            { id: 3, description: "Netflix Subscription", amount: -15, date: "2024-03-13" },
        ]
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = sessionStorage.getItem("user_id");
                const { data, error } = await supabase
                    .from('users')
                    .select('first_name, last_name')
                    .eq('user_id', userId)
                    .single();

                if (error) throw error;

                if (data) {
                    const fullName = `${data.first_name} ${data.last_name}`;
                    setUserName(fullName);
                    sessionStorage.setItem("user_name", fullName);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUserName('User');
            }
        };

        const fetchUserSavings = async () => {
            try {
                const userId = sessionStorage.getItem("user_id");
                const { data, error } = await supabase
                    .from('user_savings')
                    .select('*, users!inner(*)')
                    .eq('user_id', userId)
                    .single();

                if (error) throw error;

                if (data) {
                    setBudgetOverview(prev => ({
                        ...prev,
                        savingsGoal: data.savings_goal,
                        savedAmount: data.total_saved,
                        remaining: data.savings_goal - data.total_saved
                    }));
                }
            } catch (error) {
                console.error('Error fetching user savings:', error);
            }
        };

        fetchUserData();
        fetchUserSavings();
    }, []);

    const dashboardItems = [
        { name: "My Budgets", url: "/mybudgets", bgColor: "bg-blue-400", icon: "💰" },
        { name: "Friends", url: "/friends", bgColor: "bg-green-400", icon: "👥" },
        { name: "Leaderboard", url: "/leaderboard", bgColor: "bg-yellow-400", icon: "🏆" },
        { name: "Currency", url: "/converter", bgColor: "bg-purple-400", icon: "💱" },
        { name: "Articles", url: "/articles", bgColor: "bg-red-400", icon: "📚" },
        { name: "Profile", url: "/profile", bgColor: "bg-orange-400", icon: "👤" }
    ];

    // Calculate percentages for progress bars
    const savingsPercentage = (budgetOverview.savedAmount / budgetOverview.savingsGoal) * 100;

    return (
        <div className="min-h-screen bg-gray-100 pt-20 font-Outfit">
            <div className="container mx-auto px-4">
                {/* Welcome Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Welcome, {userName}!
                    </h1>
                    <p className="text-gray-600">Here's your financial overview</p>
                </div>

                {/* Budget at a Glance Section */}
                <div className="max-w-6xl mx-auto mb-12">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Savings Overview</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Savings Progress */}
                            <div className="bg-green-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-green-800 mb-2">Savings Progress</h3>
                                <div className="mb-2">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Saved: ${budgetOverview.savedAmount}</span>
                                        <span>Goal: ${budgetOverview.savingsGoal}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(savingsPercentage, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <p className="text-green-600 font-semibold">
                                    ${budgetOverview.remaining} to go
                                </p>
                            </div>

                            {/* Recent Transactions */}
                            <div className="bg-purple-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-purple-800 mb-2">Recent Transactions</h3>
                                <div className="space-y-2">
                                    {budgetOverview.recentTransactions.map(transaction => (
                                        <div key={transaction.id} className="flex justify-between items-center">
                                            <span className="text-sm truncate">{transaction.description}</span>
                                            <span className={`text-sm font-semibold ${
                                                transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                ${Math.abs(transaction.amount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Title */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
                </div>

                {/* Navigation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {dashboardItems.map((item) => (
                        <div
                            key={item.name}
                            onClick={() => navigate(item.url)}
                            className={`${item.bgColor} hover:opacity-90 transition-all duration-200 
                                      rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105`}
                        >
                            <div className="flex flex-col items-center text-white">
                                <span className="text-4xl mb-4">{item.icon}</span>
                                <h2 className="text-2xl font-semibold">{item.name}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}