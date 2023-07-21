import React, {useState} from "react";
import { useLocation } from "react-router-dom";


export default function LoginPage() {
    const location = useLocation();
    console.log("HomePage render");
    console.log("HomePage location =", location);
    const [state, setState] = useState({
        inputs: { username: "", password: "", confirmPassword: "" },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("state.inputs =", state.inputs);
        setState({ inputs: { username: "", password: "", confirmPassword: "" } });
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
                <input
                    type="text"
                    value={state.inputs.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    placeholder="confirmPassword"
                ></input>
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}