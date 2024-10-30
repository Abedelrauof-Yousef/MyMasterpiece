// Articles.jsx
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

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <Routes>
        {/* Main posts listing */}
        <Route
          path=""
          element={
            <>
              <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Blog Posts</h1>
              
              <div className="max-w-2xl mx-auto mb-12">
                <CreatePost currentUser={currentUser} onPostCreated={addNewPost} />
              </div>

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
                <div className="text-center text-gray-600 text-lg mt-12 bg-gray-100 p-8 rounded-lg shadow-inner">
                  <p>No posts available.</p>
                  <p className="mt-2">Be the first to share your thoughts!</p>
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
  );
}

export default Articles;
