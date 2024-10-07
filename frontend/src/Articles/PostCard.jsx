import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function PostCard({ post = {} }) {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://localhost:5001/api/posts/${post._id}`, {
          withCredentials: true,
        });
        window.location.reload();
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {post.picture && (
        <img
          src={post.picture}
          alt={post.title || "Post image"}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">{post.title || "Untitled"}</h2>
        <p className="text-gray-600 mb-4">{post.description || "No description available"}</p>
        {post._id && (
          <div className="flex justify-between">
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