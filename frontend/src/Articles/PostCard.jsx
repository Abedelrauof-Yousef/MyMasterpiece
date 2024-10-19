// PostCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function PostCard({ post = {}, currentUser, onDelete, onUpdate }) {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://localhost:5001/api/posts/${post._id}`, {
          withCredentials: true,
        });
        onDelete(post._id); // Remove post from state without reloading
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  const isOwner = currentUser && post.user && post.user._id === currentUser._id;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center p-4">
        {/* User Avatar */}
        {post.user && post.user.avatar ? (
          <img
            src={post.user.avatar}
            alt={`${post.user.username}'s avatar`}
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center text-gray-700">
            {post.user && post.user.username
              ? post.user.username.charAt(0).toUpperCase()
              : "U"}
          </div>
        )}
        {/* Username and Timestamp */}
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {post.user && post.user.username ? post.user.username : "User"}
          </p>
          <p className="text-xs text-gray-500">
            {post.createdAt
              ? new Date(post.createdAt).toLocaleString()
              : "Unknown time"}
          </p>
        </div>
      </div>

      {/* Post Image */}
      {post.picture && (
        <img
          src={post.picture}
          alt={post.title || "Post image"}
          className="w-full h-48 object-cover"
        />
      )}

      {/* Post Content */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          {post.title || "Untitled"}
        </h2>
        <p className="text-gray-600 mb-4">
          {post.description || "No description available"}
        </p>
        {isOwner && (
          <div className="flex justify-end space-x-4">
            <Link
              to={`/edit-post/${post._id}`}
              className="text-blue-500 hover:text-blue-700 transition duration-300"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 transition duration-300"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostCard;
