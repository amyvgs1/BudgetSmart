// this page is the home page, or the page that all users will first see when accessing the website. Not user dashboard
import { Link } from "react-router-dom";

// better to keep in assets
import mainImage from "../assets/budgeting.png"
import homeback from "../assets/homeback.jpg"
import HomeGridDisplay from "../components/HomeGridDisplay";

export default function Home() {
    const featureList = [
        {"name": "Personal/Group Budget Planner", "description": "We offer both group and personal budget plan functionalities. This flexibility allows for users to create plans with the friends for trips or even just solo plans to budget properly"},
        {"name" : "User Dashboard", "description": "Our user dashboard feature allows for our users to easily access different parts our application while offering user data visualizations to make our application emersive"},
        {"name" : "Budget Calender", "description" : "Users can easily set end and start dates to the various plans they created and visualize these expected timelines using our budgeting calender feature"},
        {"name" : "Website Articles", "description": "We also offer articles regarding budgeting and finance for our users to read while using our application."},
        {"name" : "Friend Adder", "description": "Users can add their friends and family and creating plans involving whoever they desire."},
        {"name" : "Leaderboard", "description": "A small added twist to our website, you can comepete with added friends and family memebers to see who is the most financially responsible!"}
    ]



    return (
        <>
            <div style={{ backgroundImage: `url(${homeback})` }} className="bg-cover bg-no-repeat h-screen w-full flex flex-col items-center justify-center space-x-4 mt-10">
                <div className="text-center">       
                    <h1 className="font-Outfit text-8xl font-extrabold text-white">
                        Where <span className="text-orange-600">Budgeting</span> Meets <span className="text-blue-600">Efficiency</span>
                    </h1>

                    <br/>

                    <p className="font-Outfit text-2xl text-white">We get it. Budgeting can be hard, let us help!</p>
                    <div className="relative mt-10">
                        <Link to='/create'>
                            <button
                                className="z-0 w-72 h-14 rounded bg-transparent border-4 border-orange-500 py-1 px-2.5 border-transparent text-center text-md text-white transition-all shadow-sm hover:shadow focus:bg-orange-600 focus:shadow-none active:bg-orange-600 hover:bg-orange-600 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button"
                            >
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex flex-col mt-10 mb-5 items-center justify-center font-Outfit text-center">
                <h1 className="text-center text-5xl mb-5">Our Purpose</h1>
                <p className="text-xl">The purpose of our website is to provide our users and their friends a comfortable and easy way to budget intelligently. Our website is perfect for those who need help budgeting properly for everyday tasks, group trips, and additional expenses for special occassions. We offer a plethora of tools to aid in budgeting.</p>

                <h1 className="text-center text-5xl mt-20 mb-5">Our Tools</h1>
                <p className="text-xl mb-5">Here is an overview of all of our offered services, read them to further understand what we offer.</p>


                <div className="grid grid-cols-4 w-3/4 gap-4">
                    {featureList.map((feature) => {
                        return <HomeGridDisplay feature={feature["name"]} description={feature["description"]}/>
                    })}
                </div>

                <div className="w-full bg-blue-400 mt-20 p-10">
                    <h1 className="text-center text-5xl mb-5">Enjoy Our Website</h1>

                    <div className="flex flex-row gap-10 justify-center items-center">
                        <img className="w-1/2" src={mainImage} height={300} width={300}/>
                        <p className="text-xl w-1/2">We hope you enjoy our website and all of the features we offer. You can begin signing up or logging in to enjoy our services. Make sure to add your friends and family to fully enjoy in-depth group and individual budget planning</p>

                    </div>

                </div>

                <div className="flex flex-row  items-center border-t-2 w-full h-16 p-5">
                    <p className="text-slate-500">© 2024 BudgetSmart, Inc. All rights reserved</p>
                </div>

            </div>

        </>
    );

}