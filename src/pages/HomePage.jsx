import React, { useState, useEffect } from "react";
import axios from "axios";
import NewPostForm from "../components/NewPostForm";
import ModifyPostForm from "../components/PostEditingForm";
import Modal from "../components/Modal";

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

export default function HomePage() {
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [bannedPosts, setBannedPosts] = useState([]);
  const [deletedPosts, setDeletedPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [showModifyForm, setShowModifyForm] = useState(false);
  const [postId, setPostId] = useState("");
  const [postStatus, setPostStatus] = useState("");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

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

      // Fetch banned and deleted posts if the user is an admin or super
      if (["admin", "super"].includes(localStorage.authority)) {
        const bannedResponse = await axios.get(
          `http://localhost:9000/post-reply-service/posts/banned`, { headers }
        );
        setBannedPosts(bannedResponse.data.posts);

        const deletedResponse = await axios.get(
          `http://localhost:9000/post-reply-service/posts/deleted`, { headers }
        );
        setDeletedPosts(deletedResponse.data.posts);
      }

    } catch (error) {
      console.error("Error fetching published posts:", error);
    }
  }

  useEffect(() => {
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

  const modifyPost = (postId, status, isArchived) => {
    setPostId(postId);
    setPostStatus(status);
    setIsArchived(isArchived);
    setShowModifyForm(true);
  };

  const updatePostStatus = async (postId, status) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found in local storage. Please log in.");
            return;
        }

        // Set the token as the Authorization header in the request
        const headers = { Authorization: `Bearer ${token}` };

        await axios.patch(
            `http://localhost:9000/post-reply-service/posts/${postId}`,
            { status },
            { headers }
        );

        // Refresh the posts after updating status
        fetchPosts();
    } catch (error) {
        console.error(`Error updating status for post ${postId}:`, error);
    }
  };

  const startNewPost = () => {
    setShowNewPostForm(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", marginTop:"-0px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", gap: "30px", flexWrap: "wrap" }}> {/* gap for spacing between sections, and flexWrap to ensure proper layout on smaller screens */}

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

        <section style={{ marginBottom: "30px", flex: "1 1 calc(50% - 15px)", boxSizing: "border-box" }}> {/* flex and box-sizing for proper grid layout */}
          <h2>{["admin", "super"].includes(localStorage.authority) ? "All Posts" : "Published Posts"}</h2>
          <div style={{ height: "500px", overflow: "auto", border: "1px solid #ccc", background: "#f9f9f9" }}>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              {publishedPosts.map((post) => (
                <tr key={post.postId}>
                  <td style={{ padding: "8px" }}>{post.userId}</td>
                  <td style={{ padding: "8px" }}>{formatDate(post.dateCreated)}</td>
                  <td style={{ padding: "8px" }}>{post.title}</td>
                  <td style={{ padding: "8px" }}>
                    <button style={buttonStyles} onClick={() => viewDetail(post.postId)}>View Details</button>
                    {["admin", "super"].includes(localStorage.authority) && ( // Check if user is admin or super
                      <button style={buttonStyles} onClick={() => updatePostStatus(post.postId, post.status === "banned" ? "published" : "banned")}>
                        {post.status === "banned" ? "Unban" : "Ban"}
                      </button>
                    )}
                  </td> 
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: "30px", flex: "1 1 calc(50% - 15px)", boxSizing: "border-box" }}>
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
                      <th>Actions</th>
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
                          <button style={buttonStyles} onClick={() => modifyPost(post.postId, post.status, post.isArchived)}>Modify this post</button>
                      </td>
                      </tr>
                  ))}
                  </tbody>
              </table>
            )}
          </div>
        </section>

        {["admin", "super"].includes(localStorage.authority) && (
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", gap: "30px", flexWrap: "wrap" }}> {/* gap for spacing between sections, and flexWrap to ensure proper layout on smaller screens */}
            <section style={{ marginBottom: "30px", flex: "1 1 calc(50% - 15px)", boxSizing: "border-box" }}> {/* flex and box-sizing for proper grid layout */}
              <h2>Banned Posts</h2>
              {bannedPosts.length === 0 ? (
                <p>There are no banned posts</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Date</th>
                      <th>Title</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bannedPosts.map((post) => (
                      <tr key={post.postId}>
                        <td>{post.userId}</td>
                        <td>{formatDate(post.dateCreated)}</td>
                        <td>{post.title}</td>
                        <td>
                          <button style={buttonStyles} onClick={() => updatePostStatus(post.postId, "published")}>
                            Unban
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            )}
            </section>

            <section style={{ marginBottom: "30px", flex: "1 1 calc(50% - 15px)", boxSizing: "border-box" }}>
              <h2>Deleted Posts</h2>
              {deletedPosts.length === 0 ? (
                <p>There are no deleted posts</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Date</th>
                      <th>Title</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deletedPosts.map((post) => (
                      <tr key={post.postId}>
                        <td>{post.userId}</td>
                        <td>{formatDate(post.dateCreated)}</td>
                        <td>{post.title}</td>
                        <td>
                          <button style={buttonStyles} onClick={() => updatePostStatus(post.postId, "published")}>
                            Recover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            )}
            </section>
          </div>
        )}
      </div>

      {showModifyForm && (
        <Modal onClose={() => setShowModifyForm(false)}>
          <ModifyPostForm
            postId={postId}
            postStatus={postStatus}
            onClose={() => setShowModifyForm(false)}
            isArchived={isArchived} // Function to close the form when canceled
          />
        </Modal>
      )}

      {showNewPostForm && (
        <Modal onClose={() => setShowNewPostForm(false)}>
          <NewPostForm />
        </Modal>
      )}
      
      <button 
        onClick={startNewPost}
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '20px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#4caf50', /* Green */
          color: 'white',
        }}
      >
        +
      </button>

    </div>
  );
}
