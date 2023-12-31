import React, { useState, useEffect } from "react";
import FileSelection from "./FileSelection";
import axios from "axios";

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

export default function ModifyPostForm({ postId, postStatus, onClose, isArchived }) {
  // State variables for the form fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedAttachments, setSelectedAttachments] = useState([]);

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
        if (images && images.length > 0) {
            setSelectedImages(images.map((url) => new File([url], url.split("/").pop())));
        } else {
            setSelectedImages([]);
        }
    
        if (attachments && attachments.length > 0) {
            setSelectedAttachments(attachments.map((url) => new File([url], url.split("/").pop())));
        } else {
            setSelectedAttachments([]);
        }
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

  const handleDeleteImage = (index) => {
    setSelectedImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };
  
  const handleDeleteAttachment = (index) => {
    setSelectedAttachments((prevAttachments) => {
      const updatedAttachments = [...prevAttachments];
      updatedAttachments.splice(index, 1);
      return updatedAttachments;
    });
  };

  const handleImageChange = (e) => {
    const newImages = Array.from(e.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
  };
  
  const handleAttachmentChange = (e) => {
    const newAttachments = Array.from(e.target.files);
    setSelectedAttachments((prevAttachments) => [...prevAttachments, ...newAttachments]);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
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

const handleArchiveToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in local storage. Please log in.");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const body = {
        isArchived: !isArchived, // Toggle the value of isArchived
      };

      const response = await axios.patch(
        `http://localhost:9000/post-reply-service/posts/${postId}`,
        body,
        { headers }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error updating post archive status:", error);
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

      <FileSelection label="Images" selectedFiles={selectedImages} onChange={handleImageChange} onDelete={handleDeleteImage} deleteDisable={true}/>
      <FileSelection label="Attachments" selectedFiles={selectedAttachments} onChange={handleAttachmentChange} onDelete={handleDeleteAttachment} deleteDisable={true}/>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>

      {postStatus === "banned" && (<button style = {buttonStyles} type="button" onClick={handleCancel}>Cancel</button>)}
      
      {postStatus === "hidden" && (
        <>
        <button style={buttonStyles} type="button" onClick={() => handleUpdate("published")}>Published</button>
        <button style={buttonStyles} type="submit">Save Changes</button>
        <button style={buttonStyles} type="button" onClick={handleCancel}>Cancel</button>
        </>
      )} 
      
      {postStatus === "unpublished" &&
        <>
        <button style={buttonStyles} type="button" onClick={() => handleUpdate("published")}>Publish</button>
        <button style={buttonStyles} type="submit">Save Changes</button>
        <button style={buttonStyles} type="button" onClick={handleCancel}>Cancel</button>
        </>
      }

      {postStatus === "published" &&
        <>
            <button style={buttonStyles} type="button" onClick={() => handleUpdate("deleted")}>delete</button>
            <button style={buttonStyles} type="button" onClick={() => handleUpdate("hidden")}>hide</button>
            <button style={buttonStyles} type="submit">Save Changes</button>
            <button style={buttonStyles} type="button" onClick={handleArchiveToggle}>
                {isArchived ? "Unarchive" : "Archive"}
            </button>
            <button style={buttonStyles} type="button" onClick={handleCancel}>Cancel</button>
        </>}
      </div>
    </form>
  );
}
