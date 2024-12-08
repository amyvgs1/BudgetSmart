import { useState } from "react";
import UserDrawer from "./UserDrawer";
import Calculator from "./calculator";
import calc from "../assets/calc.png";

export default function UserNavBar() {
    const [showCalculator, setShowCalculator] = useState(false);

    const toggleCalculator = () => {
        setShowCalculator(!showCalculator); // Toggle calculator visibility
    };

    return (
        <div className="shadow-md w-full fixed top-0 left-0 z-50">
            <div className="md:flex items-center justify-between bg-white py-4 md:px-10 px-7">
                <div className="flex text-2xl cursor-pointer items-center gap-2">
                    <UserDrawer />
                </div>

                <ul className="flex pl-9 md:pl-0 md:flex md:items-center">
                    {/* Calculator Toggle Button */}
                    <div
                        onClick={toggleCalculator}
                        className="h-10 w-10 rounded-full bg-blue-300 hover:bg-blue-100 flex items-center justify-center cursor-pointer"
                    >
                        <img
                            className="object-cover"
                            src={calc}
                            alt="Calculator"
                            width={40}
                            height={40}
                        />
                    </div>
                </ul>
            </div>

            {/* Calculator */}
            {showCalculator && (
                <div
                    className="fixed top-20 right-10"
                    style={{ width: "300px" }} 
                >
                    <Calculator />
                </div>
            )}
        </div>
    );
}
