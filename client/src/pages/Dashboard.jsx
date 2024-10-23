// user dashboard, the first thing a user will see upon a successful login

// try data persistence with useContext
import { useLocation, useParams } from "react-router-dom";

export default function Dashboard(){
    const location = useLocation();

    const user = location.state?.name;
    const user_id = location.state?.id;

    return(

        <>
            <div className="flex flex-col items-center justify-center w-screen h-screen bg-blue-300 font-Outfit text-3xl font-semibold">
                <p>Hello,</p>
                <p>{user}</p>
            </div>
        </>
    );
}