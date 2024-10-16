import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute(props){
    return props.isLoggedIn ? <Outlet /> : <Navigate to="/login"/>
}