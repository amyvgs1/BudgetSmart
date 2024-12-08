import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <div className="z-30 shadow-md w-full fixed top-0 left-0">
            <div className="md:flex items-center justify-between bg-white py-4 md:px-10 px-7">
                <div className="flex text-2xl cursor-pointer items-center gap-2">
                    <Link to='/'>
                        <span className="font-bold">BudgetSmart</span>
                    </Link>
                </div>

                <ul className="flex pl-9 md:pl-0 md:flex md:items-center">
                    <Link to='/faq'>
                        <li className="font-semibold my-7 md:my-0 md:ml-8 hover:bg-blue-400 p-2 rounded-lg">FAQs</li>
                    </Link>

                    <Link to='/about'>
                        <li className="font-semibold my-7 md:my-0 md:ml-8 hover:bg-blue-400 p-2 rounded-lg">About Us</li>
                    </Link>

                    <Link to='/login'>
                        <button className='btn bg-orange-400 text-white md:ml-8 font-semibold px-3 py-1 rounded hover:bg-orange-500'>Log-In</button>
                    </Link>
                </ul>
            </div>
        </div>
    );
}