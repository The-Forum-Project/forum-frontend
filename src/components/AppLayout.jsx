import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppLayout() {
    const location = useLocation();
    useEffect(() => {
        console.log("AppLayout useEffect(): location =", location);
    }, [location]);

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}