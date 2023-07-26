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

    // Styles
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px',
        marginTop: '100px'
    };
    
    const inputStyle = {
        marginTop: '20px',
        textAlign: 'center',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '12px 20px',
        fontSize: '16px'
    };
    
    const buttonStyle = {
        marginTop: '5%',
        backgroundColor: '#4CAF50',
        border: 'none',
        color: 'white',
        padding: '15px 32px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        margin: '4px 2px',
        cursor: 'pointer',
        borderRadius: '4px'
    };

    return (
        <div style={containerStyle}>
            <label htmlFor="verificationCode">Verification Code</label>
            <input 
                type="text" 
                id="verificationCode" 
                name="verificationCode" 
                value={verificationCode} 
                onChange={handleInputChange} 
                style={inputStyle}
                minLength="6" 
                maxLength="6"
            />
            <button onClick={verifyUser} style={buttonStyle}>Verify</button>
        </div>
    );
}
