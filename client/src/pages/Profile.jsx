import { useState } from "react";
import moneyback from "../assets/moneyback2.png";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from '../config/supabase';

export default function CreateAccount() {
    const inputStyle = 'appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white';

    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rePass, setRePass] = useState("");
    const [message, setMessage] = useState("");

    const createAccount = async (e) => {
        e.preventDefault();

        if (password !== rePass) {
            return setMessage("Passwords do not match, please retype.");
        }

        try {
            // Check if user already exists in users table
            const { data: existingUser } = await supabase
                .from('users')
                .select('email')
                .eq('email', email)
                .single();

            if (existingUser) {
                setMessage("An account with this email already exists.");
                return;
            }

            // Create an authenticated user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (authError) throw authError;

            if (!authData.user?.id) {
                throw new Error("Failed to create user account");
            }

            // Insert user details into custom users table
            const { error: userError } = await supabase
                .from('users')
                .insert([
                    {
                        user_id: authData.user.id,
                        first_name: firstName,
                        last_name: lastName,
                        username: username,
                        email: email,
                        password: password
                    }
                ]);

            if (userError) {
                console.error('User table error:', userError);
                await supabase.auth.admin.deleteUser(authData.user.id); // Clean up auth user if insertion fails
                throw userError;
            }

            // Create initial entry in user_savings table
            const { error: savingsError } = await supabase
                .from('user_savings')
                .insert([
                    {
                        user_id: authData.user.id,
                        total_saved: 0,
                        savings_goal: 2000
                    }
                ]);

            if (savingsError) {
                console.error('Savings table error:', savingsError);
                await supabase.auth.admin.deleteUser(authData.user.id); // Clean up auth user if savings creation fails
                throw savingsError;
            }

            setMessage("Account created successfully!");
            navigate("/login");

        } catch (error) {
            console.error('Error:', error);
            setMessage(error.message || "Failed to create account");
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-screen" style={{ backgroundImage: `url(${moneyback})` }}>
            <div className="w-50 bg-white justify-center text-center rounded-md shadow-lg p-8 mt-10">
                <span className="font-Outfit text-4xl font-semibold"><h1>Create Account</h1></span>
                <p>Say hello to budgeting the right way</p>

                <span className="text-red-500 font-semibold"><p>{message}</p></span>

                <form className="mt-5 grid grid-cols-4 gap-4 mb-3">
                    <div className="col-span-2">
                        <p>First Name</p>
                        <input value={firstName} className={inputStyle} placeholder="Jane" onChange={(e) => setFirstName(e.target.value)} />
                    </div>

                    <div className="col-span-2">
                        <p>Last Name</p>
                        <input value={lastName} className={inputStyle} placeholder="Doe" onChange={(e) => setLastName(e.target.value)} />
                    </div>

                    <div className="col-span-4">
                        <p>Email</p>
                        <input value={email} className={inputStyle} placeholder="example@email.com" onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="col-span-4">
                        <p>Username</p>
                        <input value={username} className={inputStyle} placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                    </div>

                    <div className="col-span-2">
                        <p>Password</p>
                        <input type="password" value={password} className={inputStyle} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div className="col-span-2">
                        <p>Retype Password</p>
                        <input type="password" value={rePass} className={inputStyle} placeholder="Retype Password" onChange={(e) => setRePass(e.target.value)} />
                    </div>

                    <button type="button" onClick={createAccount} className="col-span-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Submit</button>
                </form>

                <Link to="/login" className="text-blue-500 hover:underline"><p>Have an account already? Log-In here!</p></Link>
            </div>
        </div>
    );
}
