import React, {useState} from "react";
import { useLocation } from "react-router-dom";

export default function ContactAdminPage() {
    const location = useLocation();
    const [subject, setSubject] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    //get the token from session
    const token = sessionStorage.getItem('token');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('http://localhost:9000/message-service/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization' : 'Bearer ' + token,
                'Authorization' : 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGVtYWlsLmNvbSIsInBlcm1pc3Npb25zIjpbeyJhdXRob3JpdHkiOiJlbWFpbCJ9LHsiYXV0aG9yaXR5Ijoibm9ybWFsIn1dLCJpZCI6Mn0.Fgfs0NzaXujnN1J1PzTzuBn7IYiav5vZTUycP0-drwY'
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
        <div>
            <h1>Contact Us</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Subject:
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <label>
                    Message:
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </label>
                <button type="submit" disabled={isFormEmpty}>Submit</button>
            </form>
        </div>
    );
}