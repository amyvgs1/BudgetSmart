// this is the page that is for user login. this is an example of being able to access the database

// useNavigate allows us to access all routes that we have created
// the useStates are meant to monitor user inputted email and password to verify credentials and there is one to set a message based on output of verification

// the verify login arrow function is meant to verify user input login credentials. it works as follows:
// 1. The function will try to communicate with the server by sending the login information
// 2. Based on server response, axios.post will either succeed or fail. 
// 3. if axios.post is successful, then the logic within the try block will continue being executed
// 4. if not, then an error will be caught and dealt with accordingly


import moneyback from "../assets/moneyback2.png";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useState } from "react";
import { supabase } from '../config/supabase'

export default function Login(props){
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [message, setMessage] = useState('');

    const inputStyle = 'appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white';

    const verifyLogin = async (e) =>{
        e.preventDefault()

        try{
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: pass
            })

            if (error) throw error

            // Store user session
            sessionStorage.setItem('user_id', data.user.id)
            sessionStorage.setItem('user_name', `${data.user.user_metadata.first_name} ${data.user.user_metadata.last_name}`)
            
            props.setAuth(true)
            navigate('/dashboard')

        } catch(err) {
            console.error('Error:', err.message);
            setMessage(err.message)
        }
    }

    return(
        <>
            <div className="flex items-center justify-center w-full h-screen" style={{ backgroundImage: `url(${moneyback})` }}>
                <div className="w-50 bg-white justify-center text-center rounded-md shadow-lg p-8">
                    <span className="font-Outfit text-4xl font-semibold"><h1>Log In</h1></span>
                    <p>Welcome Back!</p>
                    <span className="text-red-500 font-semibold"><p>{message}</p></span>

                    <form onSubmit={verifyLogin} className="mt-5 grid grid-cols-4 gap-4 mb-3">
                        <div className="col-span-4 ">
                            <p>Email</p>
                            <input value={email} className={inputStyle} placeholder="Your Email" onChange={(e) => setEmail(e.target.value)}></input>
                        </div>

                        <div className="col-span-4">
                            <p>Password</p>
                            <input value={pass} className={inputStyle} placeholder="Your Password" onChange={(e) => setPass(e.target.value)}></input>
                        </div>

                        <button type="submit" className="col-span-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Login</button>
                    </form>

                    <Link to="/create" className="text-blue-500 hover:underline"><p>Dont have an account? Create one here!</p></Link>

                </div>
            </div>
        </>
    );
}