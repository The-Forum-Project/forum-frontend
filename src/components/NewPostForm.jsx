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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare the data to be sent as a form body
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
        await axios.post("http://localhost:9000/post-composite-service/posts", formData, {
          headers,
        });
        
        alert("Create a new post!");
        resetForm();
    } catch (error) {
      console.error("Error creating new post:", error);
    }
  };
  const resetForm = () => {
    setTitle("");
    setContent("");
    setImages([]);
    setAttachments([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input type="text" value={title} onChange={handleTitleChange} placeholder="Title" />
      </div>
      <div>
        <label>Content:</label>
        <textarea value={content} onChange={handleContentChange} placeholder="Content" />
      </div>
      <div>
        <label>Images:</label>
        <input type="file" onChange={handleImageChange} multiple />
      </div>
      <div>
        <label>Attachments:</label>
        <input type="file" onChange={handleAttachmentChange} multiple />
      </div>
      <button type="submit">Publish</button>
    </form>
  );
}
