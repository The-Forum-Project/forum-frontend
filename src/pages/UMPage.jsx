import React, {useEffect, useState} from "react";

export default function UMPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const authority = localStorage.getItem("authority");
    console.log("User Management Page render");

    useEffect(() => {
        // Replace this with your API endpoint
        fetchAllUsers();
    }, []);

    async function fetchAllUsers() {
        const url = 'http://localhost:9000/user-service/users';

        fetch(url,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer '+ token
            }
        })
            .then(response => response.json())
            .then(data => {
                setUsers(data.users);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const typeName = (num) => {
        if (num === 0) {
            return 'super admin';
        } else if (num === 1) {
            return 'admin';
        } else if (num === 2) {
            return 'normal';
        } else if (num === 3) {
            return 'unverified normal';
        } else {
            return 'banned';
        }
    };

    const handleActiveStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === false;
        const response = await fetch(`http://localhost:9000/user-service/users/${id}/updateActive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer '+ token
            },
            body: JSON.stringify({
                active: newStatus
            })
        });

        if (response.ok) {
            fetchAllUsers();
        } else {
            console.log(response);
            alert('Failed to update user status.');
        }
    };

    const promoteUser = async (id) => {
        const response = await fetch(`http://localhost:9000/user-service/users/${id}/promote`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer '+ token
            }
        });

        if (response.ok) {
            fetchAllUsers();
        } else {
            console.log(response);
            alert('Failed to update user status.');
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    } else {
        if (authority === "admin" || authority === "super") {
            return (
                <div style={{ maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr style={{ backgroundColor: "#f5f5f5", textAlign: "center" }}>
                            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>User Id</th>
                            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Full Name</th>
                            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Email</th>
                            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Date Joined</th>
                            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Type</th>
                            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Activation</th>
                            {authority === "super" && (
                                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Promotion</th>
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => (
                            <tr key={user.userId} style={{ borderBottom: "1px solid #ddd" }}>
                                <td style={{ padding: "10px" }}>{user.userId}</td>
                                <td style={{ padding: "10px" }}>{user.firstName} {user.lastName}</td>
                                <td style={{ padding: "10px" }}>{user.email}</td>
                                <td style={{ padding: "10px" }}>{new Date(user.registrationDate).toLocaleString()}</td>
                                <td style={{ padding: "10px" }}>{typeName(user.type)}</td>
                                <td style={{ padding: "10px" }}>
                                    {user.type !== 0 && user.type !== 1 && (
                                        <button
                                            onClick={() => handleActiveStatusChange(user.userId, user.active)}
                                            style={{
                                                padding: "5px 10px",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                                border: "none",
                                                backgroundColor: user.active ? "#ff0000" : "#007BFF",
                                                color: "white"
                                            }}
                                        >
                                            {user.active ? 'BAN' : 'ACTIVATE'}
                                        </button>
                                    )}
                                </td>
                                <td style={{ padding: "10px" }}>
                                    {user.type === 2 && authority === 'super' && (
                                        <button
                                            onClick={() => promoteUser(user.userId)}
                                            style={{
                                                padding: "5px 10px",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                                border: "none",
                                                backgroundColor:"#007BFF",
                                                color: "white"
                                            }}
                                        >
                                            PROMOTE
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

            );
        } else {
            return (<div>You do not have authority.</div>);
        }
    }
}