import React from "react";
import { useLocation } from "react-router-dom";

export default function UMPage() {
    const location = useLocation();
    console.log("HomePage render");
    console.log("HomePage location =", location);
    return (
        <div>
            <p>User Management Page</p>
        </div>
    );
}