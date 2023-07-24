import React, { useState } from "react";
import axios from "axios";

export default function NewPostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [attachments, setAttachments] = useState([]);

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

  const handleSubmit = async (e, status) => {
    e.preventDefault();
    // Prepare the data to be sent as a form body
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("status", status);
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
        await axios.post("http://localhost:9000/post-composite-service/posts", formData, {
          headers,
        });
        
        alert("Create a new post!");
        window.location.reload();
    } catch (error) {
      console.error("Error creating new post:", error);
    }
  }; 

  return (
    <form style={{ maxWidth: "600px", margin: "0 auto" }}>
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
        <button onClick={(e) => handleSubmit(e, "published")} >Publish</button>
        <button onClick={(e) => handleSubmit(e, "unpublished")} style={{ marginLeft:"45px" }}>Save as a draft</button>
      </div>
    </form>
  );
}
