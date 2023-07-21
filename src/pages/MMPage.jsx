import React from "react";
import { useLocation } from "react-router-dom";

export default function MMPage() {
    const location = useLocation();
    console.log("HomePage render");
    console.log("HomePage location =", location);
    return (
        <div>
            <p>Message Management Page</p>
        </div>
    );
}