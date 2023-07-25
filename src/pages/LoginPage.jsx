import React, {useEffect, useState} from "react";
import jwt_decode from 'jwt-decode';
import {useNavigate} from "react-router-dom";


export default function LoginPage() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [state, setState] = useState({
        inputs: { username: "", password: "" },
    });

    useEffect(() => {
        if (token) {
            navigate("/home");
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("state.inputs =", state.inputs);
        setState({ inputs: { username: "", password: "" } });
        const url = 'http://localhost:9000/authentication-service/auth/login'; // Replace with your backend URL
        const data = {
            username: state.inputs.username,
            password: state.inputs.password,
        };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                // Success - You can handle the successful login here
                const data = await response.json();
                console.log(data.message);
                const jwtToken = data.token; // Fetch the JWT token from the response header
                localStorage.setItem("token", jwtToken);
                if (jwtToken) {
                    // Decode the JWT token
                    const decodedToken = jwt_decode(jwtToken);
                    console.log('Decoded Token:', decodedToken);
                    localStorage.setItem("userId", decodedToken.id);
                    localStorage.setItem("email", decodedToken.sub);
                    if (decodedToken.permissions.length !== 0) {
                        localStorage.setItem("authority",decodedToken.permissions[0].authority)
                    } else {
                        localStorage.setItem("authority", "banned")
                    }
                }
                alert("Login Successful");
                navigate("/home", { state: { profileData: 2 } });
            } else {
                // Handle error response here if needed
                const data = await response.json();
                console.log(data.message);
                alert(data.message);
            }
        } catch (error) {
            // Handle any network or other errors here
            console.error('Error:', error);
        }
    };

    // Function that takes in fieldname, returns event handler
    const handleChange =
        (field) =>
    (e) => {
        setState((prevState) => ({
            inputs: { ...prevState.inputs, [field]: e.target.value },
        }));
    };

    const isFormEmpty = !state.inputs.username || !state.inputs.password;

    return (
        <div>
            <h1 style={{ textAlign: "center", color: "#444" }}>Login Page</h1>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ marginBottom: "10px" }}>
                    <input
                        type="text"
                        value={state.inputs.username}
                        onChange={handleChange("username")}
                        placeholder="Username"
                        style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "300px" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <input
                        type="password"
                        value={state.inputs.password}
                        onChange={handleChange("password")}
                        placeholder="Password"
                        style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "300px" }}
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={isFormEmpty}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: isFormEmpty ? "#ccc" : "#007BFF",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: isFormEmpty ? "default" : "pointer",
                        }}
                    >
                        Log In
                    </button>
                </div>
            </form>

        </div>
    );
}