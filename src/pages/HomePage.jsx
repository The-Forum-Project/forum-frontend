import React, { useState, useEffect } from "react";
import axios from "axios";
import NewPostForm from "../components/NewPostForm";

export default function HomePage() {
  const [publishedPosts, setPublishedPosts] = useState([]);

  useEffect(() => {
    async function fetchPublishedPosts() {
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
        const posts = response.data.posts;
        setPublishedPosts(posts);
      } catch (error) {
        console.error("Error fetching published posts:", error);
      }
    }

    fetchPublishedPosts();
  }, []);

  return (
    <div>
      <h1>HomePage</h1>

      <h2>Published Posts</h2>
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
              <td>{post.userId}</td>
              <td>{post.dateCreated}</td>
              <td>{post.title}</td>
              {/* Add more table data cells for other post properties */}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Create New Post</h2>
      <NewPostForm />
    </div>
  );
}
