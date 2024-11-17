import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CommentSection from "./commentection";
import { PencilSquareIcon, TrashIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

function ViewPost({ currentUser }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDateTime, setShowDateTime] = useState(false);
  const navigate = useNavigate();

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
      await axios.delete(`http://localhost:5001/api/posts/${id}`, {
        withCredentials: true,
      });
      
      toast.update(loadingToast, {
        render: "Post deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      // Navigate after a short delay to allow the success message to be seen
      setTimeout(() => {
        navigate("/articles");
      }, 2000);
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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
        <div className="bg-white border-l-4 border-red-500 p-6 rounded-lg shadow-lg max-w-lg w-full">
          <div className="flex items-center space-x-3">
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Error Loading Post</h3>
              <p className="text-gray-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-gray-600 text-lg font-medium">Post not found.</div>
      </div>
    );
  }

  const isOwner = currentUser && post.user && post.user._id === currentUser._id;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/articles"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 group"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to Articles</span>
        </Link>

        <article className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Post Image */}
          {post.picture && (
            <div className="relative h-96 w-full">
              <img
                src={post.picture}
                alt={post.title || "Post image"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          )}

          <div className="p-8">
            {/* User Info Section */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="relative">
                {post.user && post.user.avatar ? (
                  <img
                    src={post.user.avatar}
                    alt={`${post.user.username}'s avatar`}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-white text-xl font-semibold ring-2 ring-gray-100">
                    {post.user && post.user.username
                      ? post.user.username.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                )}
              </div>
              <div
                className="relative cursor-pointer"
                onMouseEnter={() => setShowDateTime(true)}
                onMouseLeave={() => setShowDateTime(false)}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {post.user && post.user.username ? post.user.username : "User"}
                </h3>
                {showDateTime && post.createdAt && (
                  <div className="absolute left-0 top-full mt-2 bg-gray-900 text-white text-sm py-1.5 px-3 rounded-md shadow-lg z-10 whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {/* Post Content */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {post.title || "Untitled"}
            </h1>

            <div className="prose prose-lg max-w-none text-gray-600 mb-8">
              {post.description || "No description available."}
            </div>

            {/* Action Buttons */}
            {isOwner && (
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                <Link
                  to={`/articles/edit-post/${post._id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <PencilSquareIcon className="h-4 w-4 mr-2" />
                  Edit Post
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete Post
                </button>
              </div>
            )}
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-8">
          <CommentSection postId={post._id} currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}

export default ViewPost;