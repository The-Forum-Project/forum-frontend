import React, {useState} from "react";
import { useLocation } from "react-router-dom";

export default function ContactAdminPage() {
    const location = useLocation();
    const [subject, setSubject] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    //get the token from session
    const token = localStorage.getItem('token');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('http://localhost:9000/message-service/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                 'Authorization' : 'Bearer ' + token,
                //'Authorization' : 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGVtYWlsLmNvbSIsInBlcm1pc3Npb25zIjpbeyJhdXRob3JpdHkiOiJlbWFpbCJ9LHsiYXV0aG9yaXR5Ijoibm9ybWFsIn1dLCJpZCI6Mn0.Fgfs0NzaXujnN1J1PzTzuBn7IYiav5vZTUycP0-drwY'
            },
            body: JSON.stringify({
                subject,
                email,
                message
            })
        });

        if (response.ok) {
            alert('Message sent successfully!');
            setSubject('');
            setEmail('');
            setMessage('');
        } else {
            console.log(response);
            alert('Failed to send message.');
        }
    };
    const isFormEmpty = !subject || !email || !message;

    console.log("Contact Admin render");
    console.log("ContactAdminPage location =", location);
    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", boxSizing: "border-box", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center", color: "#444" }}>Contact Us</h1>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <label style={{ color: "#888" }}>
                    Subject:
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        style={{ width: "100%", padding: "10px", boxSizing: "border-box", marginTop: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
                    />
                </label>
                <label style={{ color: "#888" }}>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "100%", padding: "10px", boxSizing: "border-box", marginTop: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
                    />
                </label>
                <label style={{ color: "#888" }}>
                    Message:
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{ width: "100%", padding: "10px", boxSizing: "border-box", marginTop: "5px", border: "1px solid #ccc", borderRadius: "5px", minHeight: "100px" }}
                    />
                </label>
                <button type="submit" disabled={isFormEmpty} style={{ padding: "10px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Submit</button>
            </form>
        </div>

    );
}