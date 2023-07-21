import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const profileId = "123";
    console.log("Navbar render");
    return (
        <div className="nav">
            <Link to="/users/login">Login</Link>
            <Link to="/users/register">Register</Link>
            <Link to="/home">Home</Link>
            <Link to={`/users/profile/${profileId}`}>Profile</Link>
            <Link to="/contactus">Contact Us</Link>
            <Link to="/users">Users</Link>
            <Link to="/messages">Messages Management</Link>
        </div>
    );
}