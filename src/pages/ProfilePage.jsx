import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModifyPostForm from "../components/PostEditingForm";

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: '30px',
    background: '#f9f9f9'
};

const boxStyle = {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '20px',
    margin: '10px',
    width: 'auto',
    background: '#fff',
    boxShadow: '2px 2px 15px -1px rgba(0,0,0,0.15)'
};

const buttonStyle = {
    marginTop: '10px',
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '5px'
};

const buttonStyles = {
    margin: "5px",
    padding: "10px 15px",
    fontWeight: "bold",
    borderRadius: "4px",
    backgroundColor: "#1976d2", // Darker blue background color
    color: "white", // White text color
    border: "none", // No border
    cursor: "pointer", // Show pointer cursor on hover
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Add a subtle box shadow
};

const tableStyle = {
    width: '100%',
    marginTop: '10px'
};

export default function ProfilePage() {
    const params = useParams();
    const navigate = useNavigate();
    let token = localStorage.getItem("token");
    const [userData, setUserData] = useState(null);

    const [userDrafts, setUserDrafts] = useState([]);
    const [showModifyForm, setShowModifyForm] = useState(false);
    const [postId, setPostId] = useState("");
    const [postStatus, setPostStatus] = useState("");
    const [topPosts, setTopPosts] = useState([]);
    const [userViewHistory, setUserViewHistory] = useState([]);

    useEffect(() => {
        // check if the user is trying to access other user's profile
        let userId = localStorage.getItem("userId");
        if (params.userId !== userId) {
            alert("You can't access this profile");
            navigate("/home");
            return;
        }
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

            const drafts = await fetch(`http://localhost:9000/post-reply-service/posts/${id}/drafts`, {
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            });
            if(!drafts.ok) {
                throw new Error(`HTTP error! status: ${drafts.status}`);
            }
            const draftData = await drafts.json();
            setUserDrafts(draftData.posts);

            const userTopPosts = await fetch(`http://localhost:9000/post-reply-service/posts/${id}/top`, {
                headers: {
                    'Authorization' : `Bearer ${token}`
                } 
            });
            const topPostsData = await userTopPosts.json();
            setTopPosts(topPostsData.posts);

            const viewHistory = await fetch(`http://localhost:9000/post-composite-service/histories`, {
                headers: {
                    'Authorization' : `Bearer ${token}`
                } 
            });
            const viewHistoryData = await viewHistory.json();
            setUserViewHistory(viewHistoryData); 
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const redirectHome = () => {
        navigate("/home");
    };

    const updateUser = () => {
        console.log(params.userId);
        navigate(`/users/update/${params.userId}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Change the format as needed
      };
    
    const modifyPost = (postId, status) => {
        setPostId(postId);
        setPostStatus(status);
        setShowModifyForm(true);
    };
      
    const viewDetail = (postId) => {
        // Navigate to the detail page of the post with the given postId
        window.location.href = `/posts/${postId}`;
    };

    return (
        <div style={containerStyle}>
            <div style={boxStyle}>
            {userData ? (
                <div>
                    <h1>{`${userData.firstName} ${userData.lastName}`}</h1>
                    <p>Registration date: {formatDate(userData.registrationDate)}</p>
                    <img src={userData.imageURL} alt="User profile" />
                </div>
            ) : (
                <p>Loading...</p>
            )}
            <button style={buttonStyle} onClick={redirectHome}>Return to Home</button>
            <button style={buttonStyle} onClick={updateUser}>Update User</button>
            </div>

            <div style={{...boxStyle, display:"flex", justifyContent: 'space-around'}}>

                {/* Use this common styles for all tables */}
                <style jsx>{`
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    th {
                        background-color: #f2f2f2;
                        padding: 8px;
                        text-align: center;
                        border-bottom: 1px solid #ddd;
                    }

                    td {
                        padding: 8px;
                        border-bottom: 1px solid #ddd;
                    }

                    tr:hover {background-color: #f5f5f5;}
                `}</style>

                <div style={{flexGrow: 1}}>
                    <div>
                        <h2>Top 3 posts</h2>
                        <div style={{ height: "200px", overflow: "auto", border: "1px solid #ccc", background: "#f9f9f9" }}>
                        
                        {topPosts.length === 0 ? (
                            <p style={{margin: "1em"}}>You have no posts</p>
                        ) : ( 
                        <table style={tableStyle}>
                            <thead>
                            <tr>
                                <th>User</th>
                                <th>Date</th>
                                <th>Title</th>
                                <th>Action</th>
                                {/* Add more table headers as needed */}
                            </tr>
                            </thead>
                            <tbody>
                            {topPosts.map((post) => (
                                <tr key={post.postId}>
                                <td style={{ padding: "8px" }}>{post.userId}</td>
                                <td style={{ padding: "8px" }}>{formatDate(post.dateCreated)}</td>
                                <td style={{ padding: "8px" }}>{post.title}</td>
                                <td style={{ padding: "8px" }}>
                                    <button style={buttonStyles} onClick={() => viewDetail(post.postId)}>View Details</button>
                                </td> 
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        )}

                        </div>
                    </div>

                    <div>
                        <h2>Drafts</h2>
                        <div style={{ height: "300px", overflow: "auto", border: "1px solid #ccc", background: "#f9f9f9" }}>
                        {userDrafts.length === 0 ? (
                            <p style={{margin: "1em"}}>You have no drafts</p>
                        ) : (
                        <table style={tableStyle}>
                            <thead>
                            <tr>
                                <th>User</th>
                                <th>Date</th>
                                <th>Title</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {userDrafts.map((post) => (
                                <tr key={post.postId}>
                                <td style={{ padding: "8px" }}>{post.userId}</td>
                                <td style={{ padding: "8px" }}>{formatDate(post.dateCreated)}</td>
                                <td style={{ padding: "8px" }}>{post.title}</td>
                                <td style={{ padding: "8px" }}>
                                    <button style={buttonStyles} onClick={() => modifyPost(post.postId, post.status)}>Continue edit</button>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        )}
                        </div>
                    </div>
                    {showModifyForm && (
                        <ModifyPostForm
                        postId={postId}
                        postStatus={postStatus}
                        onClose={() => setShowModifyForm(false)}
                        />
                    )}
                </div>

                <div style={{flexGrow: 1}}>
                    <h2>View History</h2>
                        <div style={{ marginLeft: "30px", height: "580px", overflow: "auto", border: "1px solid #ccc", background: "#f9f9f9" }}>
                        {topPosts.length === 0 ? (
                            <p style={{margin: "1em"}}>You have no history</p>
                        ) : ( 
                        <table style={tableStyle}>
                            <thead>
                            <tr>
                                <th>View User</th>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Action</th>
                                {}
                            </tr>
                            </thead>
                            <tbody>
                            {userViewHistory.map((post) => (
                                <tr key={post.postId}>
                                <td style={{ padding: "8px" }}>{post.post.userId}</td>
                                <td style={{ padding: "8px" }}>{post.post.title}</td>
                                <td style={{ padding: "8px" }}>{formatDate(post.history.viewDate)}</td>
                                <td style={{ padding: "8px" }}>
                                    <button style={buttonStyles} onClick={() => viewDetail(post.history.postId)}>View Details</button>
                                </td> 
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        )}
                        </div>
                </div>
            </div>
        </div>
    );
}
