import React, {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";

export default function MMPage() {
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const authority = localStorage.getItem("authority");
    console.log("Messgae Management Page render");
    console.log("Message Management Page location =", location);

    useEffect(() => {
        // Replace this with your API endpoint
        const url = 'http://localhost:9000/message-service/messages';

        fetch(url,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer '+ token
            }
        })
            .then(response => response.json())
            .then(data => {
                setMessages(data.messages);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    const handleStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === 0 ? 1 : 0;
        const response = await fetch(`http://localhost:9000/message-service/messages/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer '+ token
                // 'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            },
            // body: JSON.stringify({
            //     status: newStatus
            // })
        });

        if (response.ok) {
            setMessages(prevMessages => {
                return prevMessages.map((message) => {
                    if (message.messageId === id) {
                        return { ...message, status: newStatus };
                    }
                    return message;
                });
            });

            alert('Message status updated successfully!');
        } else {
            console.log(response);
            alert('Failed to update message status.');
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
                        <tr style={{ backgroundColor: "#f5f5f5", textAlign: "left" }}>
                            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Date</th>
                            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Subject</th>
                            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Email Address</th>
                            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Message</th>
                            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Status</th>
                            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {messages.map(message => (
                            <tr key={message.messageId} style={{ borderBottom: "1px solid #ddd" }}>
                                <td style={{ padding: "10px" }}>{new Date(message.dateCreated).toLocaleString()}</td>
                                <td style={{ padding: "10px" }}>{message.subject}</td>
                                <td style={{ padding: "10px" }}>{message.email}</td>
                                <td style={{ padding: "10px" }}>{message.message}</td>
                                <td style={{ padding: "10px" }}>{message.status === 0 ? 'Open' : 'Closed'}</td>
                                <td style={{ padding: "10px" }}>
                                    <button onClick={() => handleStatusChange(message.messageId, message.status)} style={{ padding: "5px 10px", borderRadius: "5px", cursor: "pointer", border: "none", backgroundColor: message.status === 0 ? "#ff0000" : "#007BFF", color: "white" }}>
                                        {message.status === 0 ? 'Close' : 'Open'}
                                    </button>
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