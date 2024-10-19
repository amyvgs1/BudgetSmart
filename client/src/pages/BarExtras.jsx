// this is for the extra pages like faq and about us

import NavBar from "../components/NavBar";
import { ToggleBox } from "../components/ToggleBox";
import aboutUs from "../assets/aboutUs.png";

export function FAQ() {
    const toggleContent = [
        { question: "How much does it cost?", answer: "Our services are completely free and we plan to keep it that way so there's no excuse to budget the right way" },
        { question: "How many budget plans can I create?", answer: "Our application allows you to create an unlimited amount of budget plans for free. So don't worry just budget away." },
        { question: "How do I start?", answer: "The process is simple, go to our home page, click get started, and provide with valid information to create your new account" }
    ];

    return (
        <>
            <NavBar />
            <div className="h-screen w-screen flex flex-col justify-center font-Outfit">
                <div className="flex justify-center p-5 mb-5 mt-20 bg-blue-200"><span className="font-bold text-5xl"><h1>Frequently Asked Questions (FAQs)</h1></span></div>
                <span className="text-center text-2xl"><h1>You Have Questions? Hopefully We Were Able To Answer Some Below: </h1></span>

                <div className="flex flex-col items-center h-3/4 mt-10">
                    {toggleContent.map((element) => {
                        return (<ToggleBox question={element.question} content={element.answer} />);
                    })}
                </div>
            </div>
        </>
    );
}

export function AboutUs() {
    return (
        <>
            <NavBar />
            <div className="h-screen w-screen flex flex-row font-Outfit">
                <div className="flex flex-col justify-center items-center h-screen w-2/5 bg-blue-200">
                    <span className="text-6xl font-bold"><h1>About</h1></span>
                    <span className="text-6xl font-bold"><h1>Us</h1></span>
                    <img src={aboutUs} />
                </div>

                <div className="flex flex-col justify-center items-center h-screen w-3/5 p-20">
                    <span className="text-2xl"><p>We are BudgetSmart, an application dedicated to making the lives of our users simple by introducing budgeting features. With our application, users can create a plethora of bugeting plans (both personal and as a group). We also consider our traveling users, we still want to maintain their bugeting regardless of their locations. If you want to start bugeting, let us help you do bugeting the right way.</p></span>
                    
                </div>

            </div>

        </>
    );
}