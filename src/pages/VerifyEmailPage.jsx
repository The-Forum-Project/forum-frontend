import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyUserPage() {
    let token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [verificationCode, setVerificationCode] = useState("");

    const clearLocalStorage = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("authority");
        localStorage.removeItem("userId");
    };

    const handleInputChange = (event) => {
        setVerificationCode(event.target.value);
    };

    useEffect(() => {
        const postUrl = 'http://localhost:9000/user-service/users/verify/email?routingKey=apple';
        fetch(postUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer '+ token
            }
        }).then((response) => response.json())
            .then(async (data) => {
                console.log(data.message);
                alert(data.message);
            })
            .catch((error) => console.error("Error:", error));
    }, []);

    const verifyUser = async () => {
        try {
            const response = await fetch('http://localhost:9000/user-service/users/verify/code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify({
                    code: verificationCode,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                clearLocalStorage();
                navigate("/users/login");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error verifying user:', error);
        }
    };

    return (
        <div>
            <label>
                Verification Code:
                <input type="text" value={verificationCode} onChange={handleInputChange} />
            </label>
            <button onClick={verifyUser}>Verify</button>
        </div>
    );
}
