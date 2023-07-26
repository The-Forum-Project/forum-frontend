import React, { useState } from "react";
import FileSelection from "./FileSelection";

export default function NewPostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedAttachments, setSelectedAttachments] = useState([]);
  
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };
  
  const handleDeleteAttachment = (index) => {
    const updatedAttachments = [...selectedAttachments];
    updatedAttachments.splice(index, 1);
    setSelectedAttachments(updatedAttachments);
  };

  const handleImageChange = (e) => {
    const newImages = Array.from(e.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
  };
  
  const handleAttachmentChange = (e) => {
    const newAttachments = Array.from(e.target.files);
    setSelectedAttachments((prevAttachments) => [...prevAttachments, ...newAttachments]);
  };
  
  const handleSubmit = async (e, status) => {
    e.preventDefault();
    // Prepare the data to be sent as a form body
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("status", status);
    selectedImages.forEach((image) => formData.append("images", image));
    selectedAttachments.forEach((attachment) => formData.append("attachments", attachment));

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
        const response = await fetch("http://localhost:9000/post-composite-service/posts", {
            method: "POST",
            headers: headers,
            body: formData,
          });
        console.log("response: ", response);

        if(response.status === 400) {
            alert("You cannot create a post! Check your input.");
            console.log("Error: ", response.data.message);
            return;
        }else if(response.status === 403) {
            alert("You cannot create a post! Check your user status.");
            console.log("Unauthorized operation");
            return;
        }else if(response.ok) {
            alert("Create a new post!");
            window.location.reload();
        }
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
      <FileSelection label="Images" selectedFiles={selectedImages} onChange={handleImageChange} onDelete={handleDeleteImage} deleteDisable={false} />
      <FileSelection label="Attachments" selectedFiles={selectedAttachments} onChange={handleAttachmentChange} onDelete={handleDeleteAttachment} deleteDisable={false} />
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button onClick={(e) => handleSubmit(e, "published")} >Publish</button>
        <button onClick={(e) => handleSubmit(e, "unpublished")} style={{ marginLeft:"45px" }}>Save as a draft</button>
      </div>
    </form>
  );
}
