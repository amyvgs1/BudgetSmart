import { Link } from "react-router-dom";
import UserDrawer from "./UserDrawer";
import Calculator from "./calculator";
import { useState } from "react";
import calc from "../assets/calc.png";
import NotificationBell from './NotificationBell';

export default function UserNavBar() {
    return (
        <div className="shadow-md w-full fixed top-0 left-0">
            <div className="md:flex items-center justify-between bg-white py-4 md:px-10 px-7">
                <div className="flex text-2xl cursor-pointer items-center gap-2">
                    <UserDrawer/>
                </div>

                <ul className="flex pl-9 md:pl-0 md:flex md:items-center gap-4">
                    <NotificationBell />
                </ul>
            </div>
        </div>
    );
}