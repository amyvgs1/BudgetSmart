// this page is where users can create an account. will have to implement a axios section to create a new database entry
import { useState } from "react";
import moneyback from "../assets/moneyback2.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateAccount(props) {
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

        if(password !== rePass){
            return setMessage("Passwords do not match, please retype.");
        }

        try{
            const res = await axios.post('http://localhost:8080/create', 
                {
                    firstName:firstName,
                    lastName:lastName,
                    username:username,
                    email: email,
                    password: password
                }
            );

            props.setAuth(true);
            navigate("/dashboard");

        } catch (err){
            if(err.response){
                setMessage(err.response.data.message)
            } 
            //else {
            //     setMessage("all good") // error
            // }
        }
        e.preventDefault()
    }



    return (
        <>
            <div className="flex items-center justify-center w-full h-screen" style={{backgroundImage:`url(${moneyback})`}}>
                <div className="w-50 bg-white justify-center text-center rounded-md shadow-lg p-8 mt-10">
                    <span className="font-Outfit text-4xl font-semibold"><h1>Create Account</h1></span>
                    <p>Say hello to budgeting the right way</p>

                    <span className="text-red-500 font-semibold"><p>{message}</p></span>

                    <form className="mt-5 grid grid-cols-4 gap-4 mb-3">
                        <div className="col-span-2 ">
                            <p>First Name</p>
                            <input value={firstName} className={inputStyle} placeholder="Jane" onChange={(e) => setFirstName(e.target.value)}></input>
                        </div>

                        <div className="col-span-2">
                            <p>last Name</p>
                            <input value={lastName} className={inputStyle} placeholder="Doe" onChange={(e) => setLastName(e.target.value)}></input>
                        </div>

                        <div className="col-span-4">
                            <p>email</p>
                            <input value={email} className={inputStyle} placeholder="example@email.com" onChange={(e) => setEmail(e.target.value)}></input>
                        </div>

                        <div className="col-span-4">
                            <p>Username</p>
                            <input value={username} className={inputStyle} placeholder="Username" onChange={(e) => setUsername(e.target.value)}></input>
                        </div>

                        <div className="col-span-2">
                            <p>password</p>
                            <input value={password} className={inputStyle} placeholder="password" onChange={(e) => setPassword(e.target.value)}></input>
                        </div>

                        <div className="col-span-2">
                            <p>retype password</p>
                            <input value={rePass} className={inputStyle} placeholder="retype password" onChange={(e) => setRePass(e.target.value)}></input>
                        </div>

                        <button type="button" onClick={createAccount} className="col-span-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Submit</button>
                    </form>

                    <Link to="/login" className="text-blue-500 hover:underline"><p>Have an account already? Log-In here!</p></Link>

                </div>
            </div>
        </>
    );
}