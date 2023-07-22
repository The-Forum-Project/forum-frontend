import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProfilePage() {
    const params = useParams();
    const navigate = useNavigate();
    let token = localStorage.getItem("token");
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Fetch user data when the component mounts
        fetchUser(params.userId);
    }, [params.userId, token]);

    const fetchUser = async (id) => {
        try {
            const response = await fetch(`http://localhost:9000/user-service/users/${id}`, {
                headers: {
                    'Authorization' : `Bearer ${token}`
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const redirectHome = () => {
        navigate("/home", { state: { profileData: 2 } });
    };

    return (
        <div>
            {userData ? (
                <div>
                    <h1>{`${userData.firstName} ${userData.lastName}`}</h1>
                    <p>Registration date: {userData.registrationDate}</p>
                    <img src={userData.imageURL} alt="User profile" />
                </div>
            ) : (
                <p>Loading...</p>
            )}
            <button onClick={redirectHome}>Return to Home</button>
        </div>
    );
}
