import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModifyPostForm from "../components/PostEditingForm";

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

            const viewHistory = await fetch(`http://localhost:9000/history-service/histories`, {
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
        navigate("/home", { state: { profileData: 2 } });
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
        <div style={{display:"flex"}}>
            <div>
            {userData ? (
                <div>
                    <h1>{`${userData.firstName} ${userData.lastName}`}</h1>
                    <p>Registration date: {formatDate(userData.registrationDate)}</p>
                    <img src={userData.imageURL} alt="User profile" />
                </div>
            ) : (
                <p>Loading...</p>
            )}
            <button onClick={redirectHome}>Return to Home</button>
            <button onClick={updateUser}>Update User</button>
            </div>

            <div style={{display:"flex", marginLeft: "70px"}}>
                <div style={{ marginRight: "50px" }}>
                    <div>
                        <h2>Top 3 posts</h2>
                        <div style={{ height: "200px", overflow: "auto", border: "1px solid #ccc", background: "#f9f9f9" }}>
                        
                        {topPosts.length === 0 ? (
                            <p>You have no posts</p>
                        ) : ( 
                        <table>
                            <thead>
                            <tr>
                                <th>User</th>
                                <th>Date</th>
                                <th>Title</th>
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
                                    <button style={{ padding: "3px" }} onClick={() => viewDetail(post.postId)}>View Details</button>
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
                            <p>You have no drafts</p>
                        ) : (
                        <table>
                            <thead>
                            <tr>
                                <th>User</th>
                                <th>Date</th>
                                <th>Title</th>
                            </tr>
                            </thead>
                            <tbody>
                            {userDrafts.map((post) => (
                                <tr key={post.postId}>
                                <td style={{ padding: "8px" }}>{post.userId}</td>
                                <td style={{ padding: "8px" }}>{formatDate(post.dateCreated)}</td>
                                <td style={{ padding: "8px" }}>{post.title}</td>
                                <td style={{ padding: "8px" }}>
                                    <button style={{ padding: "3px" }} onClick={() => modifyPost(post.postId, post.status)}>Continue edit</button>
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

                <div>
                    <h2>View History</h2>
                        <div style={{ height: "580px", overflow: "auto", border: "1px solid #ccc", background: "#f9f9f9" }}>
                        {topPosts.length === 0 ? (
                            <p>You have no history</p>
                        ) : ( 
                        <table>
                            <thead>
                            <tr>
                                <th>User</th>
                                <th>Date</th>
                                <th>Title</th>
                                {/* Add more table headers as needed */}
                            </tr>
                            </thead>
                            <tbody>
                            {userViewHistory.map((post) => (
                                <tr key={post.postId}>
                                <td style={{ padding: "8px" }}>{post.userId}</td>
                                <td style={{ padding: "8px" }}>{formatDate(post.viewDate)}</td>
                                <td style={{ padding: "8px" }}>{post.postId}</td>
                                <td style={{ padding: "8px" }}>
                                    <button style={{ padding: "3px" }} onClick={() => viewDetail(post.postId)}>View Details</button>
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
