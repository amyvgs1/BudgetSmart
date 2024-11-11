// things to implement:
// 1. user change email and password
// 2. user can log out

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"

export default function Profile(props) {
    // obtain user id 
    const user_id = sessionStorage.getItem("user_id");


    // identify if error message
    const [isError, setIsError] = useState(false);


    const navigate = useNavigate();
    const [passwordDisable, setPasswordDisable] = useState(true);
    const [emailDisable, setEmailDisable] = useState(true);

    // values for password change
    const[newPass, setNewPass] = useState("");
    const [rePass, setRePass] = useState("")

    //values for email change
    const [newEmail, setNewEmail] = useState("");
    const [reEmail, setReEmail] = useState("");

    // message for succesful changes 
    const [message, setMessage] = useState("");


    // function for changing password
    const changePass = async(e) => {
        e.preventDefault();

        if(newPass !== rePass){
            setMessage("Please ensure that new password and retyped password match");
            setIsError(true);
            return;
        }


        try{
            const res = await axios.post("http://localhost:8080/api/changepass", {newPass:newPass, user_id:user_id});
            console.log(res.data.message);

            // proper ui changes
            setIsError(false);
            setMessage("Successful Password Change");
            setNewPass("");
            setRePass("");

        } catch (err){
            console.error(err);
        }
    }


    // function for changing email
    const changeEmail = async(e) => {
        e.preventDefault();

        if(newEmail !== reEmail){
            setMessage("Please Ensure that Emails match");
            setIsError(true);
            return;
        }

        try{
            const res = await axios.post("http://localhost:8080/api/changeemail", {newEmail: newEmail, user_id: user_id});

            // ui changes
            setIsError(false);
            setMessage("Successful Email Change");
            setNewEmail("");
            setReEmail("");

        } catch (err){
            console.error(err);
        }
    }
    

    const disablePass = () => {
        setPasswordDisable(!passwordDisable);
    };

    const disableEmail = () => {
        setEmailDisable(!emailDisable);
    };

    const logout = () => {
        console.log("works");

        // get rid of all stored session values when logging out
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("user_name");

        props.setAuth(false);
        navigate('/login');
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center  w-screen h-screen font-Outfit mt-40 mb-20">
                <div className="flex flex-col justify-center items-center mb-5 text-5xl font-bold mt-10">
                    <h1>Profile/Settings</h1>
                    <span className={`text-sm font-medium text-${isError ? "red-500" : "green-500"}`}><p>{message}</p></span>
                </div>

                <div className="flex flex-row space-x-5 mb-5">
                    <span className="text-3xl font-semibold">
                        <h1>Change Password</h1>
                    </span>

                    <button onClick={disablePass} className="bg-blue-700 rounded-lg text-white w-40 hover:bg-blue-500">Change</button>
                </div>


                <div style={passwordDisable ? {pointerEvents : "none", opacity:"0.35"} :{}} className="bg-white w-1/2 h-1/3 mb-20 p-5 shadow-lg rounded-lg">
                    <form className="w-full flex flex-col justify-center items-center">
                        <span className="l"><p>New Password:</p></span>
                        <input value={newPass} onChange={(e) => setNewPass(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"></input>

                        <p>Retype New Password:</p>
                        <input value={rePass} onChange={(e) => setRePass(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"/>

                        <button type="button" className="bg-blue-700 rounded-lg w-10 h-10 text-white" onClick={changePass}>Ok!</button>
                    </form>
                </div>

                <div className="flex flex-row space-x-5 mb-5">
                    <span className="text-3xl font-semibold">
                        <h1>Change Email:</h1>
                    </span>

                    <button onClick={disableEmail} className="bg-blue-700 rounded-lg text-white w-40 hover:bg-blue-500">Change</button>
                </div>

                <div style={emailDisable ? { pointerEvents: "none", opacity: "0.35" } : {}} className="bg-white w-1/2 h-1/3 mb-5 p-5 shadow-lg rounded-lg">
                    <form className="w-full flex flex-col justify-center items-center">
                        <p>New Email:</p>
                        <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"></input>

                        <p>Retype New Password:</p>
                        <input value={reEmail} onChange={(e) => setReEmail(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" />

                        <button className="bg-blue-700 rounded-lg w-10 h-10 text-white" onClick={changeEmail}>Ok!</button>
                    </form>
                </div>


                <button onClick={logout} className="flex justify-center items-center w-1/4 h-10 bg-orange-500 hover:bg-orange-300 text-center mt-10 rounded-lg font-Outfit text-2xl">
                     Logout
                </button>



            </div>
        </>
    )

}