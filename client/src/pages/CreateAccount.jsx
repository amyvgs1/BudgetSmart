// this page is where users can create an account. will have to implement a axios section to create a new database entry

import NavBar from "../components/NavBar";
import moneyback from "../assets/moneyback2.png";
import { Link } from "react-router-dom";

export default function CreateAccount() {
    const inputStyle = 'appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white';

    return (
        <>
            <NavBar />
            <div className="flex items-center justify-center w-full h-screen" style={{backgroundImage:`url(${moneyback})`}}>
                <div className="w-50 bg-white justify-center text-center rounded-md shadow-lg p-5 mt-10">
                    <span className="font-Outfit text-4xl font-semibold"><h1>Create Account</h1></span>
                    <p>Say hello to budgeting the right way</p>

                    <form className="mt-5 grid grid-cols-4 gap-4 mb-3">
                        <div className="col-span-2 ">
                            <p>First Name</p>
                            <input className={inputStyle} placeholder="Jane"></input>
                        </div>

                        <div className="col-span-2">
                            <p>last Name</p>
                            <input className={inputStyle} placeholder="Doe"></input>
                        </div>

                        <div className="col-span-4">
                            <p>email</p>
                            <input className={inputStyle} placeholder="example@email.com"></input>
                        </div>

                        <div className="col-span-4">
                            <p>Username</p>
                            <input className={inputStyle} placeholder="Username"></input>
                        </div>

                        <div className="col-span-2">
                            <p>password</p>
                            <input className={inputStyle} placeholder="password"></input>
                        </div>

                        <div className="col-span-2">
                            <p>retype password</p>
                            <input className={inputStyle} placeholder="retype password"></input>
                        </div>

                        <button className="col-span-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Submit</button>
                    </form>

                    <Link to="/login"><p>Have an account already? Log-In here!</p></Link>

                </div>
            </div>
        </>
    );
}