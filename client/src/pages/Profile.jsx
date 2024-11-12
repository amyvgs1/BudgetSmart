import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../config/supabase';

export default function Profile() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    
    // Form states
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            // Clear session storage
            sessionStorage.clear();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
            setMessage('Error signing out');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            // First update auth
            const { error: authError } = await supabase.auth.updateUser({
                password: newPassword
            });
            if (authError) throw authError;

            // Then update the users table
            const { data: { user } } = await supabase.auth.getUser();
            const { error: dbError } = await supabase
                .from('users')
                .update({ password: newPassword })
                .eq('user_id', user.id);
            
            if (dbError) throw dbError;

            setMessage('Password updated successfully! Signing out...');
            setTimeout(() => {
                handleSignOut();
            }, 2000);
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleEmailChange = async (e) => {
        e.preventDefault();
        
        if (newEmail !== confirmEmail) {
            setMessage('Emails do not match');
            return;
        }

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            
            // Force update the auth email using admin API
            const { error: adminError } = await supabase.auth.admin.updateUserById(
                user.id,
                { email: newEmail, email_confirm: true }
            );
            if (adminError) throw adminError;

            // Update the users table
            const { error: dbError } = await supabase
                .from('users')
                .update({ email: newEmail })
                .eq('user_id', user.id);
                
            if (dbError) throw dbError;

            setMessage('Email updated successfully! Please sign in with your new email.');
            setTimeout(() => {
                handleSignOut();
            }, 2000);
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-20 font-Outfit">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-8">Profile Settings</h1>
                
                {message && (
                    <div className="mb-4 p-3 rounded bg-blue-100 text-blue-800 text-center">
                        {message}
                    </div>
                )}

                {/* Change Password Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Update Password
                        </button>
                    </form>
                </div>

                {/* Change Email Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Change Email</h2>
                    <form onSubmit={handleEmailChange} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2">New Email</label>
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Confirm New Email</label>
                            <input
                                type="email"
                                value={confirmEmail}
                                onChange={(e) => setConfirmEmail(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Update Email
                        </button>
                    </form>
                </div>

                {/* Sign Out Button */}
                <button
                    onClick={handleSignOut}
                    className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}