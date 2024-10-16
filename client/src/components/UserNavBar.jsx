export default function UserNavBar() {
    return (
        <div className="shadow-md w-full fixed top-0 left-0">
            <div className="md:flex items-center justify-between bg-white py-4 md:px-10 px-7">
                <div className="flex text-2xl cursor-pointer items-center gap-2">
                    <Link to='/dashboard'>
                        <span className="font-bold">BudgetSmart</span>
                    </Link>
                </div>

                
            </div>
        </div>
    );
}