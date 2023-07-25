import React, { useState, useEffect } from "react";
import axios from "axios";
import NewPostForm from "../components/NewPostForm";
import ModifyPostForm from "../components/PostEditingForm";

export default function HomePage() {
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [userDrafts, setUserDrafts] = useState([]);
  const [showModifyForm, setShowModifyForm] = useState(false);
  const [postId, setPostId] = useState("");
  const [postStatus, setPostStatus] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
            const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found in local storage. Please log in.");
            return;
        }

        // Set the token as the Authorization header in the request
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(
          "http://localhost:9000/post-reply-service/posts", {headers}
        );
        setPublishedPosts(response.data.posts);

        const userPosts = await axios.get(
            `http://localhost:9000/post-reply-service/posts/${localStorage.userId}`, {headers}
        ); 
        setUserPosts(userPosts.data.posts);

        const drafts = await axios.get(
            `http://localhost:9000/post-reply-service/posts/${localStorage.userId}/drafts`, {headers}
        );
        setUserDrafts(drafts.data.posts);
      } catch (error) {
        console.error("Error fetching published posts:", error);
      }
    }

    fetchPosts();
  }, []);

  const viewDetail = (postId) => {
    // Navigate to the detail page of the post with the given postId
    window.location.href = `/posts/${postId}`;
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

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", marginTop:"-0px" }}>
      <div style={{ display: "flex", flexDirection: "row"}}>
      <div style={{marginRight : "100px"}}>
        <h2>Published Posts</h2>
        <div style={{ height: "500px", overflow: "auto", border: "1px solid #ccc", background: "#f9f9f9" }}>
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
            {publishedPosts.map((post) => (
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
        </div>
      </div>

      <div>
        <div> 
            <h2>My Posts</h2>
            <div style={{ height: "500px", overflow: "auto", border: "1px solid #ccc", background: "#f9f9f9" }}>
            {userPosts.length === 0 ? (
                <p>You have no posts</p>
            ) : (
            <table>
                <thead>
                <tr>
                    <th>User</th>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {userPosts.map((post) => (
                    <tr key={post.postId}>
                    <td style={{ padding: "8px" }}>{post.userId}</td>
                    <td style={{ padding: "8px" }}>{formatDate(post.dateCreated)}</td>
                    <td style={{ padding: "8px" }}>{post.title}</td>
                    <td style={{ padding: "8px" }}>{post.status}</td> 
                    <td style={{ padding: "8px" }}>
                        <button style={{ padding: "3px" }} onClick={() => modifyPost(post.postId, post.status)}>Modify this post</button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            )}
            </div>
        </div>
      </div>
                    
      {showModifyForm && (
        <ModifyPostForm
          postId={postId}
          postStatus={postStatus}
          onClose={() => setShowModifyForm(false)} // Function to close the form when canceled
        />
      )}

      </div>
      <div style={{marginTop:"50px", marginBottom:"30px"}}>
        <NewPostForm />
      </div>
    </div>
  );
}
