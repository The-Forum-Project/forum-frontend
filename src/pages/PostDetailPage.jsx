import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
export default function PostDetailPage() {
    //const params = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState();
    const [users, setUsers] = useState({});
    const { postId } = useParams();
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBlbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6W3siYXV0aG9yaXR5IjoiYWRtaW4ifSx7ImF1dGhvcml0eSI6ImVtYWlsIn0seyJhdXRob3JpdHkiOiJub3JtYWwifV0sImlkIjoxfQ.ZjzOLf1NR-WF2AUj8AtzZejgc3ven8PwzFbg5OwZBOQ';
    // const token = localStorage.getItem('token');
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
            <div>
                {post ? (
                    <div>
                        <h1>{post.title}</h1>
                        <p>{post.content}</p>
                        <div style={{ display: "flex", alignItems: "center" }}>
                                <img src={users[post.userId].imageURL} alt={users[post.userId].firstName} style={{ width: '100px', height: '100px' }}/>
                                <h3>{users[post.userId].firstName} {users[post.userId].lastName}</h3>
                        </div>
                        <p>{new Date(post.dateCreated).toDateString()}</p>
                        {post.updateDate && <p>{new Date(post.dateModified).toDateString()}</p>}
                        {post.attachments?.map((attachment, index) => (
                            <div><a href={attachment} target="_blank" rel="noopener noreferrer">Download Attachment</a></div>
                            // <div key={index}>{attachment}</div>
                        ))}
                        {post.images?.map((image, index) => (
                            <img src={image} alt="attchement's image" style={{ width: '500px', height: '200px' }} />
                        ))}
                        <div>
                            {post.postReplies ? (post.postReplies.map((reply) => (
                                <div key={reply.id}  style={{ display: "flex", alignItems: "center" }}>
                                    {/*related with user service. uncomment after user service updated. get user detail need all the data*/}
                                    <img src={users[reply.userId].imageURL} alt={users[reply.userId].firstName} style={{ width: '100px', height: '100px' }}/>
                                    <h4>{users[reply.userId].firstName} {users[reply.userId].lastName}</h4>
                                    <p> {reply.comment}</p>
                                    {reply.subReplies.map((subReply) => (
                                        <div key={subReply.id} style={{ display: "flex", alignItems: "center" }}>
                                            {/*related with user service. uncomment after user service updated. get user detail need all the data*/}
                                            <img src={users[subReply.userId].imageURL} alt={users[subReply.userId].firstName} style={{ width: '100px', height: '100px' }}/>
                                            <h5>{users[subReply.userId].firstName} {users[subReply.userId].lastName}</h5>
                                            <p> {subReply.comment}</p>
                                        </div>
                                    ))}
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