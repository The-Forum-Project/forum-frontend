import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateUserPage() {
    let token = localStorage.getItem("token");
    const params = useParams();
    const { userId } = params;
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const navigate = useNavigate();

    const handleImageChange = (event) => {
        setProfileImage(event.target.files[0]);
    };

    const updateUser = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profileImage", profileImage);

    try {
        for(let pair of formData.entries()) {
            console.log(pair[0]+ ', '+ pair[1]); 
         }
        const response = await fetch(`http://localhost:9000/user-composite-service/${userId}`, {
            method: "PATCH",
            body: formData,
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            navigate("/users/login");
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
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}/>
            </label>
            <label>
            Last Name:
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}/>
            </label>
            <label>
            Email:
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}/>
            </label>
            <label>
            Password:
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
            </label>
            <label>
            Profile Image:
            <input type="file" onChange={handleImageChange}/>
            </label>
            <button type="submit">Update User</button>
        </form>
    );
}
