import React from 'react';

const AdminView = ({ bannedPosts, deletedPosts, updatePostStatus }) => {

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Change the format as needed
  };

  return (
    (localStorage.authority && ["admin", "super"].includes(localStorage.authority)) && (
      <>
        <div>
          <h2>Banned Posts</h2>
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
                    <button onClick={() => updatePostStatus(post.postId, "published")}>
                      Unban
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h2>Deleted Posts</h2>
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
                    <button onClick={() => updatePostStatus(post.postId, "published")}>
                      Recover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )
  );
};

export default AdminView;
