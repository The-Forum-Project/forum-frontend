import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
export default function PostDetailPage() {
    //const params = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState();
    const [users, setUsers] = useState({});
    const { postId } = useParams();
    //const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBlbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6W3siYXV0aG9yaXR5IjoiYWRtaW4ifSx7ImF1dGhvcml0eSI6ImVtYWlsIn0seyJhdXRob3JpdHkiOiJub3JtYWwifV0sImlkIjoxfQ.ZjzOLf1NR-WF2AUj8AtzZejgc3ven8PwzFbg5OwZBOQ';
     const token = localStorage.getItem('token');
    // console.log({postId});
    const fetchUsers = async (userIds, token) => {
        const userPromises = Array.from(userIds).map(userId =>
            fetch(`http://localhost:9000/user-service/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : 'Bearer '+ token
                }
            }).then(response => response.json())
        );
        const userObjects = await Promise.all(userPromises);
        const userMap = {};
        userObjects.forEach(user => {
            userMap[user.userId] = user;
        });
        //console.log(userMap);
        return userMap;
    };

    useEffect(() => {
        const postUrl = `http://localhost:9000/post-reply-service/post/${postId}`;
        fetch(postUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer '+ token
            }
        }).then((response) => response.json())
            .then(async (data) => {
                setPost(data.post);
                const userIds = new Set([data.post.userId, ...data.post.postReplies.flatMap(reply => [reply.userId, ...reply.subReplies.map(subreply => subreply.userId)])]);
                // console.log(userIds);
                //uncoment after user service is fixed
                const userMap = await fetchUsers(userIds, token);
                setUsers(userMap);
                //console.log(userMap);
                setLoading(false);
            })
            .catch((error) => console.error("Error:", error));
    }, [postId]);

    const redirectHome = () => {
        // navigate("/");
        // navigate(-1); // based on history stack
        navigate("/home", { state: { profileData: 2 } });
    };
    if (loading) {
        return <div>Loading...</div>;  // render a loading message while fetching
    } else {
        return (
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                {post ? (
                    <div>
                        <h1 style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>{post.title}</h1>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                            <img src={users[post.userId].imageURL} alt={users[post.userId].firstName} style={{ borderRadius: "50%", marginRight: "10px", width: '50px', height: '50px' }}/>
                            <h3>{users[post.userId].firstName} {users[post.userId].lastName}</h3>
                        </div>
                        <p>{post.content}</p>
                        <p style={{ fontSize: "14px", color: "#aaa" }}>Created date: {new Date(post.dateCreated).toDateString()}</p>
                        {post.dateModified && <p style={{ fontSize: "14px", color: "#aaa" }}>Modified date: {new Date(post.dateModified).toDateString()}</p>}
                        {post.attachments?.map((attachment, index) => (
                            <div style={{ fontSize: "14px", marginBottom: "5px" }}>Attachment {index + 1}: <a href={attachment} target="_blank" rel="noopener noreferrer">Download Attachment</a></div>
                        ))}
                        {post.images?.map((image, index) => (
                            <div style={{ marginTop: "10px", marginBottom: "10px" }}>Image {index + 1}:
                                <img src={image} alt="attachment's image" style={{ width: '100%', maxHeight: '500px' }} />
                            </div>
                        ))}
                        <div style={{ marginTop: "20px" }}>Replies:
                            {post.postReplies ? (post.postReplies.map((reply) => (
                                <div key={reply.id} style={{ display: "flex", alignItems: "flex-start", marginTop: "15px", marginLeft: "10px" }}>
                                    <img src={users[reply.userId].imageURL} alt={users[reply.userId].firstName} style={{ borderRadius: "50%", marginRight: "10px", width: '30px', height: '30px' }}/>
                                    <div>
                                        <h4>{users[reply.userId].firstName} {users[reply.userId].lastName}</h4>
                                        <p>{reply.comment}</p>
                                        {reply.subReplies.map((subReply) => (
                                            <div key={subReply.id} style={{ display: "flex", alignItems: "flex-start", marginLeft: "20px", marginTop: "10px" }}>
                                                <img src={users[subReply.userId].imageURL} alt={users[subReply.userId].firstName} style={{ borderRadius: "50%", marginRight: "10px", width: '30px', height: '30px' }}/>
                                                <div>
                                                    <h5>{users[subReply.userId].firstName} {users[subReply.userId].lastName}</h5>
                                                    <p>{subReply.comment}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))) : (<div></div>)}
                        </div>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>

        );
    }
}