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
        onDelete(post._id);
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  const isOwner = currentUser && post.user && post.user._id === currentUser._id;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      {post.picture && (
        <img
          src={post.picture}
          alt={post.title || "Post image"}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-center mb-4">
          {post.user && post.user.avatar ? (
            <img
              src={post.user.avatar}
              alt={`${post.user.username}'s avatar`}
              className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center text-gray-700 font-semibold border-2 border-gray-200">
              {post.user && post.user.username
                ? post.user.username.charAt(0).toUpperCase()
                : "U"}
            </div>
          )}
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
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          {post.title || "Untitled"}
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.description || "No description available"}
        </p>
        <div className="flex justify-between items-center">
          <Link
            to={`/articles/view-post/${post._id}`}
            className="text-blue-500 hover:text-blue-700 transition duration-300 font-semibold"
          >
            View More
          </Link>
          {isOwner && (
            <div className="flex space-x-4">
              <Link
                to={`/articles/edit-post/${post._id}`}
                className="text-blue-500 hover:text-blue-700 transition duration-300 font-semibold"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700 transition duration-300 font-semibold"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostCard;
