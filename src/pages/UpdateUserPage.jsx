import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin: 2rem;
`;

const Label = styled.label`
    display: flex;
    flex-direction: column;
    font-size: 1.2rem;
    color: #333;
    text-align: left;
`;

const Button = styled.button`
    background-color: #007BFF;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.2rem;

    &:hover {
        background-color: #0056b3;
    }
`;

const inputStyle = {
    fontSize: '1rem',
    padding: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ddd',
    marginTop: '0.5rem'
}

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

        fetchUserData();
    }, [userId, token, fetchCount]);


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
        <Form onSubmit={updateUser}>
            <Label>
            First Name:
            <input style={inputStyle} type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </Label>
            <Label>
            Last Name:
            <input style={inputStyle} type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
            </Label>
            <Label>
            Email:
            <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </Label>
            <Label>
            Password:
            <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </Label>
            <Label>
            Profile Image:
            <input style={inputStyle} type="file" onChange={handleImageChange} />
            </Label>
            <Button type="submit">Update User</Button>
        </Form>
    );
}
