import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";

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

export default function PostDetailPage() {
    //const params = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState();
    const [users, setUsers] = useState({});
    const { postId } = useParams();
    const [replyContent, setReplyContent] = useState("");
    const [subReplies, setSubReplies] = useState([]);
    //const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBlbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6W3siYXV0aG9yaXR5IjoiYWRtaW4ifSx7ImF1dGhvcml0eSI6ImVtYWlsIn0seyJhdXRob3JpdHkiOiJub3JtYWwifV0sImlkIjoxfQ.ZjzOLf1NR-WF2AUj8AtzZejgc3ven8PwzFbg5OwZBOQ';
     const token = localStorage.getItem('token');
    // console.log({postId});
    // const userIds = localStorage.getItem('userId');
    const fetchUsers = async (userIds, token) => {
        console.log("userId", userIds);
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

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        try {
          const replyData = { comment: replyContent };
          const response = await fetch(
            `http://localhost:9000/post-reply-service/${postId}/replies`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(replyData),
            }
          );
    
          if (response.ok) {
            window.location.reload();
          }else if (response.status === 403) {
            alert("Unanthorized operation! Check your user status first.");
            console.error("Error creating new reply: Forbidden");
          } 
        } catch (error) {
          alert("Error happend, please try again later");
          console.error("Error creating new reply:", error);
        }
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

        const history = {
            postId: postId
        }
        /*set view history */
        fetch("http://localhost:9000/history-service/histories", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer '+ token
            },
            body: JSON.stringify(history) 
        })
        .then((response) => {
            console.log(response.json());
        })
        .catch((error) => console.error("Error:", error));
    }, [postId]);

    const handleSubReplySubmit = async (e, replyIndex) => {
        e.preventDefault();
        try {
          const subReplyData = { comment: subReplies[replyIndex] };
          const response = await fetch(
            `http://localhost:9000/post-reply-service/${postId}/replies/${replyIndex}/subreplies`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(subReplyData),
            }
          );
    
          if (response.ok) {
            window.location.reload();
          }else if (response.status === 403) {
            alert("Unanthorized operation! Check your user status first.");
            console.error("Error creating new reply: Forbidden");
          } 
        } catch (error) {
          alert("Error happend, please try again later");
          console.error("Error creating new reply:", error);
        }
      };
    

    const handleSubReplyChange = (index, value) => {
        const newSubReplies = [...subReplies];
        newSubReplies[index] = value;
        setSubReplies(newSubReplies);
    };
      
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

                        {/* Add reply form here */}
                        <form onSubmit={handleReplySubmit}>
                            <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write your reply..."
                            rows="4"
                            style={{ width: "100%", resize: "none", marginBottom: "10px" }}
                            ></textarea>
                            <button style={buttonStyles} type="submit">Submit Reply</button>
                        </form>
                        
                        {/* show replies here */}
                        <div style={{ marginTop: "20px" }}>Replies:
                            {post.postReplies ? (post.postReplies.map((reply, index) => (
                                <div key={reply.id} style={{ display: "flex", alignItems: "flex-start", marginTop: "15px", marginLeft: "10px" }}>
                                    <img src={users[reply.userId].imageURL} alt={users[reply.userId].firstName} style={{ borderRadius: "50%", marginRight: "10px", width: '30px', height: '30px' }}/>
                                    <div>
                                        <h4>{users[reply.userId].firstName} {users[reply.userId].lastName}</h4>
                                        <p>{reply.comment}</p>

                                        <form onSubmit={(e) => handleSubReplySubmit(e, index)}>
                                        <textarea
                                            value={subReplies[index] || ""}
                                            onChange={(e) => handleSubReplyChange(index, e.target.value)}
                                            placeholder="Write your subreply..."
                                            rows="3"
                                            style={{ width: "100%", resize: "none", marginBottom: "10px" }}
                                        ></textarea>
                                        <button style={buttonStyles} type="submit">Submit Subreply</button>
                                        </form>

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