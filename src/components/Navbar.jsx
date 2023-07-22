import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    let profileId = localStorage.getItem("userId");
    let token = localStorage.getItem("token");
    let authority = localStorage.getItem("authority");
    console.log("Navbar render");
    const clearLocalStorage = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("authority");
        localStorage.removeItem("userId");
    };

    return (
        <div className="nav">
            {!token && (
                <Link to="/users/login">Login</Link>
            )}
            {token && (
                <Link to="/users/login" onClick={clearLocalStorage}>Logout</Link>
            )}
            <Link to="/users/register">Register</Link>
            {token && (
                <>
                    <Link to="/home">Home</Link>
                    <Link to={`/users/profile/${profileId}`}>Profile</Link>
                </>
            )}
            {(authority === 'admin' || authority === 'super') && (
                <>
                    <Link to="/users">Users</Link>
                    <Link to="/messages">Messages Management</Link>
                </>
            )}
            <Link to="/contactus">Contact Us</Link>
        </div>
    );
}