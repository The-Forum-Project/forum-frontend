import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateUserPage() {
    const params = useParams();
    const { userId } = params;
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); // Added password state
    const [profileImage, setProfileImage] = useState(null);
    const [initialEmail, setInitialEmail] = useState(""); 
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [fetchCount, setFetchCount] = useState(0);

    useEffect(() => {
        // Fetch user data when the component mounts
        fetchUserData();
    }, [userId]);

    const fetchUserData = async () => {
        const response = await fetch(`http://localhost:9000/user-service/users/${userId}`, {
            headers: {
                'Authorization' : `Bearer ${token}`
            },
        });
        const data = await response.json();
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(localStorage.getItem("email"));
        setInitialEmail(localStorage.getItem("email"));
    };

    const handleImageChange = (event) => {
        setProfileImage(event.target.files[0]);
    };

    const updateUser = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        if (password) { // Only append password if it has a value
            formData.append("password", password);
        }
        formData.append("profileImage", profileImage);

        try {
            const response = await fetch(`http://localhost:9000/user-composite-service/${userId}`, {
            method: "PATCH",
            body: formData,
            headers: {
                'Authorization' : `Bearer ${token}`
            },
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                if (email && initialEmail !== email) {
                    localStorage.clear(); // Clear the localStorage
                    navigate("/users/login"); // Only redirect to login if the email has been changed
                } else {
                    setFetchCount(fetchCount + 1);
                }
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <form onSubmit={updateUser}>
            <label>
            First Name:
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </label>
            <label>
            Last Name:
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
            </label>
            <label>
            Email:
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </label>
            <label>
            Password:
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </label>
            <label>
            Profile Image:
            <input type="file" onChange={handleImageChange} />
            </label>
            <button type="submit">Update User</button>
        </form>
    );
}
