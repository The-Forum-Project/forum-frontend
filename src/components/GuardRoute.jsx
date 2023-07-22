import React from "react";
import { Outlet } from "react-router-dom";
import LoginPage from "../pages/LoginPage";


export default function GuardRoute() {
    let token = localStorage.getItem("token");
    return (token !== null) ? <Outlet /> : <LoginPage />;
}