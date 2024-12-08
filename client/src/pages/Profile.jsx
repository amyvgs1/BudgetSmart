import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../config/supabase';

export default function Profile(props) {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Form states
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');

    const [passwordDisable, setPasswordDisable] = useState(true);
    const [emailDisable, setEmailDisable] = useState(true);

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            localStorage.clear();
            props.setAuth(false);
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
            setIsError(true);
            return;
        }

        try {
            const { error: authError } = await supabase.auth.updateUser({
                password: newPassword
            });
            if (authError) throw authError;

            const { data: { user } } = await supabase.auth.getUser();
            const { error: dbError } = await supabase
                .from('users')
                .update({ password: newPassword })
                .eq('user_id', user.id);
            
            if (dbError) throw dbError;

            setMessage('Password updated successfully! Signing out...');
            setIsError(false);
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
            setIsError(true);
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { error: adminError } = await supabase.auth.admin.updateUserById(
                user.id,
                { email: newEmail, email_confirm: true }
            );
            if (adminError) throw adminError;

            const { error: dbError } = await supabase
                .from('users')
                .update({ email: newEmail })
                .eq('user_id', user.id);
                
            if (dbError) throw dbError;

            setMessage('Email updated successfully! Please sign in with your new email.');
            setIsError(false);
            setTimeout(() => {
                handleSignOut();
            }, 2000);
        } catch (error) {
            setMessage(error.message);
        }
    };

    const togglePasswordDisable = () => setPasswordDisable(!passwordDisable);
    const toggleEmailDisable = () => setEmailDisable(!emailDisable);

    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen font-Outfit mt-40 mb-20">
            <div className="flex flex-col justify-center items-center mb-5 text-5xl font-bold mt-10">
                <h1>Profile/Settings</h1>
                <span className={`text-sm font-medium text-${isError ? "red-500" : "green-500"}`}>
                    <p>{message}</p>
                </span>
            </div>

            {/* Change Password Section */}
            <div className="flex flex-row space-x-5 mb-5">
                <span className="text-3xl font-semibold">
                    <h1>Change Password</h1>
                </span>
                <button onClick={togglePasswordDisable} className="bg-blue-700 rounded-lg text-white w-40 hover:bg-blue-500">Change</button>
            </div>
            <div style={passwordDisable ? {pointerEvents : "none", opacity:"0.35"} :{}} className="bg-white w-1/2 h-1/3 mb-20 p-5 shadow-lg rounded-lg">
                <form className="w-full flex flex-col justify-center items-center" onSubmit={handlePasswordChange}>
                    <span><p>New Password:</p></span>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        required
                    />
                    <p>Retype New Password:</p>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        required
                    />
                    <button type="submit" className="bg-blue-700 rounded-lg w-10 h-10 text-white">Ok!</button>
                </form>
            </div>

            {/* Change Email Section */}
            <div className="flex flex-row space-x-5 mb-5">
                <span className="text-3xl font-semibold">
                    <h1>Change Email:</h1>
                </span>
                <button onClick={toggleEmailDisable} className="bg-blue-700 rounded-lg text-white w-40 hover:bg-blue-500">Change</button>
            </div>
            <div style={emailDisable ? { pointerEvents: "none", opacity: "0.35" } : {}} className="bg-white w-1/2 h-1/3 mb-5 p-5 shadow-lg rounded-lg">
                <form className="w-full flex flex-col justify-center items-center" onSubmit={handleEmailChange}>
                    <p>New Email:</p>
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        required
                    />
                    <p>Retype New Email:</p>
                    <input
                        type="email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        required
                    />
                    <button type="submit" className="bg-blue-700 rounded-lg w-10 h-10 text-white">Ok!</button>
                </form>
            </div>

            {/* Logout Button */}
            <button onClick={handleSignOut} className="flex justify-center items-center w-1/4 h-10 bg-orange-500 hover:bg-orange-300 text-center mt-10 rounded-lg font-Outfit text-2xl">
                Logout
            </button>
        </div>
    );
}
