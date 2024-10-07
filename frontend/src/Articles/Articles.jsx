import React, { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "./PostCard";

function Articles() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5001/api/posts");
        console.log(res.data);
        setPosts(res.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-xl text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Blog Posts</h1>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post?._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">No posts available.</p>
      )}
    </div>
  );
}

export default Articles;