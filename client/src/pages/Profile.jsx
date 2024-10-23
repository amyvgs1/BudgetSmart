// things to implement:
// 1. user change email and password
// 2. user can log out

import { useState } from "react";
import { useNavigate } from "react-router-dom"

export default function Profile(props) {
    const navigate = useNavigate();
    const [passwordDisable, setPasswordDisable] = useState(true);
    const [emailDisable, setEmailDisable] = useState(true);


    const showTemp = () => {
        alert("Still working on it...");
    };

    const disablePass = () => {
        setPasswordDisable(!passwordDisable);
    };

    const disableEmail = () => {
        setEmailDisable(!emailDisable);
    };

    const logout = () => {
        console.log("works");
        props.setAuth(false);
        navigate('/login');
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center  w-screen h-screen font-Outfit mt-10">
                <div className="mb-5 text-5xl font-bold mt-5">
                    <h1>Profile/Settings</h1>
                </div>

                <div className="flex flex-row space-x-5 mb-5">
                    <span className="text-3xl font-semibold">
                        <h1>Change Password</h1>
                    </span>

                    <button onClick={disablePass} className="bg-blue-700 rounded-lg text-white w-40 hover:bg-blue-500">Change</button>
                </div>


                <div style={passwordDisable ? {pointerEvents : "none", opacity:"0.35"} :{}} className="bg-white w-1/2 h-1/3 mb-5 p-5 shadow-lg rounded-lg">
                    <form>
                        <p>New Password:</p>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"></input>

                        <p>Retype New Password:</p>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"/>

                        <button onClick={showTemp}>Ok!</button>
                    </form>
                </div>

                <div className="flex flex-row space-x-5 mb-5">
                    <span className="text-3xl font-semibold">
                        <h1>Change Email:</h1>
                    </span>

                    <button onClick={disableEmail} className="bg-blue-700 rounded-lg text-white w-40 hover:bg-blue-500">Change</button>
                </div>

                <div style={emailDisable ? { pointerEvents: "none", opacity: "0.35" } : {}} className="bg-white w-1/2 h-1/3 mb-5 p-5 shadow-lg rounded-lg">
                    <form>
                        <p>New Email:</p>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"></input>

                        <p>Retype New Password:</p>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" />

                        <button onClick={showTemp}>Ok!</button>
                    </form>
                </div>


                <button onClick={logout} className="flex justify-center items-center w-1/4 h-10 bg-orange-500 hover:bg-orange-300 text-center mt-10 rounded-lg font-Outfit text-2xl">
                     Logout
                </button>



            </div>
        </>
    )

}