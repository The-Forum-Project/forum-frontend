import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    console.log("Navbar render");
    return (
        <div className="nav">
            <Link to="/users/login">Login</Link>
            <Link to="/users/register">Register</Link>
            <Link to="/home">Home</Link>
        </div>
    );
}