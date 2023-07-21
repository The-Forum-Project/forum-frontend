import React from "react";
import { Outlet } from "react-router-dom";
import LoginPage from "../pages/LoginPage";


export default function GuardRoute() {
    return true ? <Outlet /> : <LoginPage />;
}