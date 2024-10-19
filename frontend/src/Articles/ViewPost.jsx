// ViewPost.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import CommentSection from "./commentection";

function ViewPost({ currentUser }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5001/api/posts/${id}`);
        setPost(res.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to fetch post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // Update post state after editing
  const handleUpdate = (updatedPost) => {
    setPost(updatedPost);
  };

  // Handle delete
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://localhost:5001/api/posts/${id}`, {
          withCredentials: true,
        });
        navigate("/articles");
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-600">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );

  if (!post)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        <p>Post not found.</p>
      </div>
    );

  const isOwner = currentUser && post.user && post.user._id === currentUser._id;

  return (
    <div className="max-w-3xl mx-auto pt-16 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        {post.user && post.user.avatar ? (
          <img
            src={post.user.avatar}
            alt={`${post.user.username}'s avatar`}
            className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex items-center justify-center text-gray-700 font-semibold border-2 border-gray-200">
            {post.user && post.user.username
              ? post.user.username.charAt(0).toUpperCase()
              : "U"}
          </div>
        )}
        <div>
          <p className="text-lg font-semibold text-gray-800">
            {post.user && post.user.username ? post.user.username : "User"}
          </p>
          <p className="text-sm text-gray-500">
            {post.createdAt
              ? new Date(post.createdAt).toLocaleString()
              : "Unknown time"}
          </p>
        </div>
      </div>

      {post.picture && (
        <img
          src={post.picture}
          alt={post.title || "Post image"}
          className="w-full h-64 object-cover rounded-md mb-6"
        />
      )}

      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        {post.title || "Untitled"}
      </h2>
      <p className="text-gray-700 mb-6">{post.description || "No description available."}</p>

      {isOwner && (
        <div className="flex justify-end space-x-4 mb-6">
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

      {/* Comment Section */}
      <CommentSection postId={post._id} currentUser={currentUser} />
    </div>
  );
}

export default ViewPost;
