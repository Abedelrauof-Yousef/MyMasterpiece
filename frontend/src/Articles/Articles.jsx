// Articles.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";
import EditPost from "./EditPost"; // Import EditPost

function Articles() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Handler to add a new post to the posts list
  const addNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  // Handler to delete a post from the posts list
  const deletePost = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  // Handler to update a post in the posts list
  const updatePost = (updatedPost) => {
    setPosts(posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-600">
        {error}
      </div>
    );

  return (
    <div className="container mx-auto px-4 pt-16 py-8">
      <Routes>
        {/* Route for listing and creating posts */}
        <Route
          path="/"
          element={
            <>
              <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Blog Posts</h1>
              
              {/* CreatePost Component */}
              <CreatePost currentUser={currentUser} onPostCreated={addNewPost} />

              {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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
                <p className="text-center text-gray-600 text-lg mt-8">No posts available.</p>
              )}
            </>
          }
        />

        {/* Route for editing a post */}
        <Route
          path="/edit-post/:id"
          element={<EditPost onUpdate={updatePost} />}
        />
      </Routes>
    </div>
  );
}

export default Articles;
