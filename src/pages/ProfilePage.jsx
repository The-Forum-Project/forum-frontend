import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProfilePage() {
    const params = useParams();
    const navigate = useNavigate();
    console.log("ProfilePage render");
    console.log("params =", params);
    const redirectHome = () => {
        // navigate("/");
        // navigate(-1); // based on history stack
        navigate("/home", { state: { profileData: 2 } });
    };
    return (
        <div>
            <p>ProfilePage</p>
            <button onClick={redirectHome}>Return to Home</button>
        </div>
    );
}