import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ModifyPostForm({ postId, postStatus, onClose }) {
  // State variables for the form fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    // Fetch the current post data using postId and populate the form fields
    async function fetchPostData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in local storage. Please log in.");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(
          `http://localhost:9000/post-reply-service/post/${postId}`,
          { headers }
        );

        const { title, content, images, attachments } = response.data.post;
        setTitle(title);
        setContent(content);
        setImages(images || []);
        setAttachments(attachments || []);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    }

    fetchPostData();
  }, [postId]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleAttachmentChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    images.forEach((image) => formData.append("images", image));
    attachments.forEach((attachment) => formData.append("attachments", attachment));

    try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in local storage. Please log in.");
          return;
        }
        console.log("data: ", formData)
        // Set the token as the Authorization header in the request
        const headers = { Authorization: `Bearer ${token}` };
  
        // Send the data to the endpoint with the headers
        await axios.patch(`http://localhost:9000/post-composite-service/${postId}`, formData, {
          headers,
        });
        
        alert("Modify this post!");
        onClose();
        window.location.reload();
    } catch (error) {
      console.error("Error creating new post:", error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

const handleUpdate = async (status) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found in local storage. Please log in.");
            return;
        }

        const statusData = { status: status };

        const headers = { Authorization: `Bearer ${token}` };
        await axios.patch(`http://localhost:9000/post-reply-service/posts/${postId}`, statusData, {headers});
        alert(`${status} this post!`);
        onClose();
        window.location.reload();
    } catch (error) {
        console.error("Error publishing post:", error);
    }
};

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="title">Title:</label>
        <input style={{ width: "100%", boxSizing: "border-box" }} type="text" id="title" value={title} onChange={handleTitleChange} placeholder="Title" />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          placeholder="Content"
          rows="5"
          style={{ width: "100%", boxSizing: "border-box" }} // Set width to 100% and box-sizing to border-box
        />
      </div>
      <div style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
        <label htmlFor="images">Images:</label>
        <input style={{marginLeft: "10px"}} type="file" id="images" onChange={handleImageChange} multiple />
      </div>
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center"  }}>
        <label htmlFor="attachments">Attachments:</label>
        <input style={{marginLeft: "10px"}} type="file" id="attachments" onChange={handleAttachmentChange} multiple />
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      {postStatus === "banned" && (<button type="button" onClick={handleUpdate("delete")}>Delete</button>)}
      
      {postStatus === "hidden" && (
        <>
        <button type="button" onClick={() => handleUpdate("published")}>Published</button>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={handleCancel}>Cancel</button> 
        </>
      )} 
      
      {postStatus === "unpublished" &&
        <>
        <button type="button" onClick={() => handleUpdate("published")}>Publish</button>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
        </>
      }

      {postStatus === "published" &&
        <>
            <button type="button" onClick={() => handleUpdate("deleted")}>delete</button>
            <button type="button" onClick={() => handleUpdate("hidden")}>hide</button> 
            <button type="submit">Save Changes</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
        </>}
      </div>
    </form>
  );
}
