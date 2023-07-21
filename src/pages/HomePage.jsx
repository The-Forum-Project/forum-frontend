import React from "react";
import { useLocation } from "react-router-dom";

export default function HomePage() {
    const location = useLocation();
    console.log("HomePage render");
    console.log("HomePage location =", location);
    return <div>HomePage</div>;
}