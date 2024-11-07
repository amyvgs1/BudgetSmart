// user dashboard, the first thing a user will see upon a successful login

// example of sessionStorage down below. using sessionStorage.getItem(whatever name) you can obtain values to reuse. when you refresh the page
// the data will persist. you can use the stored user_id for future queries now.

import { useLocation, useParams } from "react-router-dom";

export default function Dashboard(){
    
    const location = useLocation();

    const user = location.state?.name;
    const user_id = location.state?.id;

    return(

        <>
            <div className="flex flex-col items-center justify-center w-screen h-screen bg-blue-300 font-Outfit text-3xl font-semibold">
                <p>Hello,</p>
                <p>{sessionStorage.getItem("user_name")}</p>
            </div>
        </>
    );
}