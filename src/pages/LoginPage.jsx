import React, {useState} from "react";
import jwt_decode from 'jwt-decode';


export default function LoginPage() {
    // const location = useLocation();
    const [state, setState] = useState({
        inputs: { username: "", password: "" },
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
                    if (decodedToken.permissions.length !== 0) {
                        localStorage.setItem("authority",decodedToken.permissions[0].authority)
                    } else {
                        localStorage.setItem("authority", "banned")
                    }

                }
            } else {
                // Handle error response here if needed
                console.log('Login failed');
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

    return (
        <div>
            <p>LoginPage</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={state.inputs.username}
                    onChange={handleChange("username")}
                    placeholder="username"
                ></input>
                <input
                    type="text"
                    value={state.inputs.password}
                    onChange={handleChange("password")}
                    placeholder="password"
                ></input>
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}