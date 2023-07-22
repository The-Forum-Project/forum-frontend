import React, {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";

export default function MMPage() {
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBlbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6W3siYXV0aG9yaXR5IjoiYWRtaW4ifSx7ImF1dGhvcml0eSI6ImVtYWlsIn0seyJhdXRob3JpdHkiOiJub3JtYWwifV0sImlkIjoxfQ.ZjzOLf1NR-WF2AUj8AtzZejgc3ven8PwzFbg5OwZBOQ';
    // const token = localStorage.getItem('token');
    console.log("HomePage render");
    console.log("HomePage location =", location);

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


    return (
       <div>
           <table>
               <thead>
               <tr>
                   <th>Date</th>
                   <th>Subject</th>
                   <th>Email Address</th>
                   <th>Message</th>
                   <th>Status</th>
                   <th>Actions</th>
               </tr>
               </thead>
               <tbody>
               {messages.map(message => (
                   <tr key={message.messageId}>
                       <td>{new Date(message.dateCreated).toLocaleString()}</td>
                       <td>{message.subject}</td>
                       <td>{message.email}</td>
                       <td>{message.message}</td>
                       <td>{message.status === 0 ? 'Open' : 'Closed'}</td>
                       <td>
                           <button onClick={() => handleStatusChange(message.messageId, message.status)}>
                               {message.status === 0 ? 'Close' : 'Open'}
                           </button>
                       </td>
                   </tr>
               ))}
               </tbody>
           </table>
       </div>
    );
}