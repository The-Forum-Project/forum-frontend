import React from "react";
import { Outlet } from "react-router-dom";
import HomePage from "../pages/HomePage";


export default function GuardRoute() {
    let authority = localStorage.getItem("authority");
    return (authority === 'super' || authority === 'admin') ? <Outlet /> : <HomePage />;
}