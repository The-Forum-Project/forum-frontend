import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [state, setState] = useState({
        inputs: { username: "", password: "", firstname: "", lastname: "" },
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
        <div>
            <p>SignUp Page</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        value={state.inputs.username}
                        onChange={handleChange("username")}
                        placeholder="email"
                    ></input>
                </div>
                <div>
                    <input
                        type="text"
                        value={state.inputs.password}
                        onChange={handleChange("password")}
                        placeholder="password"
                    ></input>
                </div>
                <div>
                    <input
                        type="text"
                        value={state.inputs.firstname}
                        onChange={handleChange("firstname")}
                        placeholder="firstname"
                    ></input>
                </div>
                <div>
                    <input
                        type="text"
                        value={state.inputs.lastname}
                        onChange={handleChange("lastname")}
                        placeholder="lastname"
                    ></input>
                </div>
                <div><button type="submit" disabled={isFormEmpty}>Sign Up</button></div>
            </form>
        </div>
    );
}