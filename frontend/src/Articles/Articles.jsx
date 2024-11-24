// src/components/Articles.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";
import EditPost from "./EditPost";
import ViewPost from "./ViewPost"; // Import the new ViewPost component

function Articles() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch posts and current user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsRes, userRes] = await Promise.all([
          axios.get("http://localhost:5001/api/posts"),
          axios.get("http://localhost:5001/api/users/me", { withCredentials: true }),
        ]);
        setPosts(postsRes.data);
        setCurrentUser(userRes.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Add a new post to the state
  const addNewPost = (newPost) => {
    // setPosts([newPost, ...posts]);
  };

  // Delete a post from the state
  const deletePost = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  // Update a post in the state
  const updatePost = (updatedPost) => {
    setPosts(posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 py-16">
      <div className="container mx-auto px-4">
        <Routes>
          {/* Main posts listing */}
          <Route
            path=""
            element={
              <>
                {/* Header */}
                <h1 className="text-5xl font-extrabold mb-6 text-center text-gray-800">
                  Latest Articles
                </h1>
                <hr className="w-24 mx-auto border-t-4 border-blue-500 mb-12" />

                {/* Create Post Form */}
                <div className="max-w-2xl mx-auto mb-12">
                  <CreatePost currentUser={currentUser} onPostCreated={addNewPost} />
                </div>

                {/* Posts Grid */}
                {posts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                      <PostCard
                        key={post._id}
                        post={post}
                        currentUser={currentUser}
                        onDelete={deletePost}
                        onUpdate={updatePost}
                      />
                    ))}
                  </div>
                ) : (
                  /* No Posts Available Message */
                  <div className="text-center text-gray-600 text-lg mt-12 bg-white p-8 rounded-lg shadow-inner">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p>No articles available.</p>
                    <p className="mt-2">Be the first to share your insights!</p>
                  </div>
                )}
              </>
            }
          />

          {/* Create Post Route */}
          <Route
            path="create-post"
            element={<CreatePost currentUser={currentUser} onPostCreated={addNewPost} />}
          />

          {/* Edit Post Route */}
          <Route
            path="edit-post/:id"
            element={<EditPost onUpdate={updatePost} />}
          />

          {/* View Post Route */}
          <Route
            path="view-post/:id"
            element={<ViewPost currentUser={currentUser} />}
          />

          {/* Redirect any unknown routes within Articles to the main posts listing */}
          <Route path="*" element={<Navigate to="/articles" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default Articles;
