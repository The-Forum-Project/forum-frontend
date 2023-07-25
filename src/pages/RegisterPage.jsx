import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function RegisterPage() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [state, setState] = useState({
        inputs: { username: "", password: "", firstname: "", lastname: "" },
    });

    useEffect(() => {
        if (token) {
            navigate("/home");
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("state.inputs =", state.inputs);
        setState({ inputs: { username: "", password: "", firstname: "", lastname: "" } });
        const url = 'http://localhost:9000/authentication-service/auth/signup'; // Replace with your backend URL
        const data = {
            firstName: state.inputs.firstname,
            lastName: state.inputs.lastname,
            email: state.inputs.username,
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
                alert("Signup Successful");
                navigate("/users/login", { state: { profileData: 2 } });
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

    const isFormEmpty = !state.inputs.username || !state.inputs.password || !state.inputs.firstname || !state.inputs.lastname;
    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px", boxSizing: "border-box", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center", color: "#444" }}>SignUp Page</h1>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ marginBottom: "10px" }}>
                    <input
                        type="text"
                        value={state.inputs.username}
                        onChange={handleChange("username")}
                        placeholder="Email"
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
                <div style={{ marginBottom: "10px" }}>
                    <input
                        type="text"
                        value={state.inputs.firstname}
                        onChange={handleChange("firstname")}
                        placeholder="First Name"
                        style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "300px" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <input
                        type="text"
                        value={state.inputs.lastname}
                        onChange={handleChange("lastname")}
                        placeholder="Last Name"
                        style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "300px" }}
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={isFormEmpty}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: isFormEmpty ? "#ccc" : "#007BFF", // Set background color based on the form state
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: isFormEmpty ? "default" : "pointer", // Set cursor based on the form state
                        }}
                    >
                        Sign Up
                    </button>
                </div>
            </form>

        </div>
    );
}