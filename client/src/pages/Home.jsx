// this page is the home page, or the page that all users will first see when accessing the website. Not user dashboard

import NavBar from "../components/NavBar";
import mainImage from "../assets/budgeting.png";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <>
            <NavBar />

            <div className="bg-gradient-to-r from-blue-800 to-blue-500 h-screen w-full flex flex-col items-center justify-center space-x-4">
                <div className=" text-center">
                    <span className=" font-Outfit text-7xl font-bold"><h1>Where Budgeting Meets Efficiency</h1></span>
                    <p className="font-Outfit text-2xl">We get it. Budgeting can be hard, let us help!</p>
                    <div class="relative mt-10">
                        {/* <input type="email" class="w-full bg-transparent placeholder:text-black text-black text-sm border border-slate-200 rounded-md pl-3 pr-16 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Email Address" /> */}
                        <Link to='/create'>
                            <button
                                class="w-50 h-10 rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-md text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button"
                            >
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex flex-col mt-5 mb-5 pl-20 pr-20 items-center justify-center">
                <span className="text-center text-5xl font-Outfit font-semibold"><h1>Our Purpose</h1></span>
                <div className="inline-flex items-center">
                    <span className="font-Outfit text-2xl"><p>Our purpose is simple. We are here to provide reliable and useful features which are aimed to help you budget better. Any person or groups wanting to have an application ready to help them with their economic goals is a perfect candidate for BudgetSmart, plus it's free.</p></span>
                    <img src={mainImage} />
                </div>

            </div>

            <div className=" flex flex-row w-full  mt-5 mb-5 items-center justify-center">
                <span className="text-center text-4xl font-Outfit font-semibold"><h1>What We Offer:</h1></span>
                <div className="size-40 rounded-md bg-blue-100 ml-10"><p>Efficiency</p></div>
                <div className="size-40 rounded-md bg-blue-100 ml-10"><p>Ease</p></div>
                <div className="size-40 rounded-md bg-blue-100 ml-10"><p>Unique Budgeting Plans</p></div>
                <div className="size-40 rounded-md bg-blue-100 ml-10"><p>Communication Among Friends</p></div>
            </div>
        </>
    );

}