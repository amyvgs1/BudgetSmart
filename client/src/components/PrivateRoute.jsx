import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute(props){
    console.log(props.auth)
    return (props.auth ? <Outlet /> : <Navigate to="/login"/>);
}