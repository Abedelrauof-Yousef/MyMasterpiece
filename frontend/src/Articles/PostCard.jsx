// src/components/ViewPost.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

function PostCard({ post = {}, currentUser, onDelete }) {
  const [showDateTime, setShowDateTime] = useState(false);

  const handleDelete = async () => {
    toast.warn(
      <div>
        <p className="mb-4">Are you sure you want to delete this post?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              deletePost();
              toast.dismiss();
            }}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      }
    );
  };

  const deletePost = async () => {
    const loadingToast = toast.loading("Deleting post...");
    
    try {
      await axios.delete(`http://localhost:5001/api/posts/${post._id}`, {
        withCredentials: true,
      });
      onDelete(post._id);
      
      toast.update(loadingToast, {
        render: "Post deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      
      toast.update(loadingToast, {
        render: "Failed to delete post. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const isOwner = currentUser && post.user && post.user._id === currentUser._id;

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
      {post.picture && (
        <div className="relative h-52 overflow-hidden">
          <img
            src={post.picture}
            alt={post.title || "Post image"}
            className="w-full h-52 object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-5">
          <div
            className="relative"
            onMouseEnter={() => setShowDateTime(true)}
            onMouseLeave={() => setShowDateTime(false)}
          >
            {post.user && post.user.avatar ? (
              <img
                src={post.user.avatar}
                alt={`${post.user.username}'s avatar`}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-white text-lg font-semibold ring-2 ring-gray-100">
                {post.user && post.user.username
                  ? post.user.username.charAt(0).toUpperCase()
                  : "U"}
              </div>
            )}
            {showDateTime && (
              <div className="absolute left-0 top-14 mt-1 bg-gray-900 text-white text-xs py-1 px-2 rounded shadow-lg z-10 whitespace-nowrap">
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleString()
                  : "Unknown time"}
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {post.user && post.user.username ? post.user.username : "User"}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
          {post.title || "Untitled"}
        </h2>

        <p className="text-gray-600 mb-5 line-clamp-3 text-sm leading-relaxed">
          {post.description || "No description available"}
        </p>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <Link
            to={`/articles/view-post/${post._id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group"
          >
            <span>Read More</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>

          {isOwner && (
            <div className="flex space-x-3">
              <Link
                to={`/articles/edit-post/${post._id}`}
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md shadow transition duration-300"
                aria-label="Edit post"
              >
                <PencilSquareIcon className="h-5 w-5 mr-1" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow transition duration-300"
                aria-label="Delete post"
              >
                <TrashIcon className="h-5 w-5 mr-1" />
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