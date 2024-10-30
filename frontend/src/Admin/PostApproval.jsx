// src/components/PostApproval.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Check, X, Trash2 } from "lucide-react";

const PostApproval = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [managedPosts, setManagedPosts] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingManaged, setLoadingManaged] = useState(true);
  const [errorPending, setErrorPending] = useState(false);
  const [errorManaged, setErrorManaged] = useState(false);

  // Base URL for API
  const API_BASE_URL = "http://localhost:5001/api/admin/posts";

  // Fetch pending posts
  const fetchPendingPosts = async () => {
    try {
      setLoadingPending(true);
      const response = await axios.get(`${API_BASE_URL}/pending`);
      setPendingPosts(response.data.data);
      setLoadingPending(false);
    } catch (err) {
      console.error("Error fetching pending posts:", err);
      setErrorPending(true);
      setLoadingPending(false);
    }
  };

  // Fetch managed posts (approved and denied)
  const fetchManagedPosts = async () => {
    try {
      setLoadingManaged(true);
      const response = await axios.get(
        "http://localhost:5001/api/admin/posts/get-managed-posts"
      );
      setManagedPosts(response.data.data);
      setLoadingManaged(false);
    } catch (err) {
      console.error("Error fetching managed posts:", err);
      setErrorManaged(true);
      setLoadingManaged(false);
    }
  };

  useEffect(() => {
    fetchPendingPosts();
    fetchManagedPosts();
  }, []);

  // Approve a post
  const approvePost = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:5001/api/admin/posts/update-approve`,
        {
          id,
        }
      );
      setPendingPosts(pendingPosts.filter((post) => post._id !== id));
      fetchManagedPosts();
    } catch (err) {
      console.error("Error approving post:", err);
      alert("Failed to approve post.");
    }
  };

  // Deny a post
  const denyPost = async (id) => {
    try {
      const response = axios.post(
        `http://localhost:5001/api/admin/posts/deny-posts`,
        {
          id,
        }
      );
      setPendingPosts(pendingPosts.filter((post) => post._id !== id));
      fetchManagedPosts();
    } catch (err) {
      console.error("Error denying post:", err);
      alert("Failed to deny post.");
    }
  };

  // Delete a post
  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setManagedPosts(managedPosts.filter((post) => post._id !== id));
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Approve User's Posts</h1>

      {/* Pending Posts Section */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-2">Pending Posts</h2>
        {loadingPending ? (
          <div className="text-center">Loading pending posts...</div>
        ) : errorPending ? (
          <div className="text-center text-red-500">
            Failed to load pending posts.
          </div>
        ) : pendingPosts.length === 0 ? (
          <div className="text-center text-gray-600">No pending posts.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">User</th>
                  <th className="py-3 px-6 text-left">Title</th>
                  <th className="py-3 px-6 text-left">Description</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {pendingPosts.map((post) => (
                  <tr
                    key={post._id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center">
                        {post.user.profilePicture ? (
                          <img
                            src={post.user.profilePicture}
                            alt={post.user.username}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
                        )}
                        <span>{post.user.username}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">{post.title}</td>
                    <td className="py-3 px-6 text-left">{post.description}</td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => approvePost(post._id)}
                        className="flex items-center justify-center px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 mr-2"
                      >
                        <Check className="mr-1" size={16} /> Approve
                      </button>
                      <button
                        onClick={() => denyPost(post._id)}
                        className="flex items-center justify-center px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        <X className="mr-1" size={16} /> Deny
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Managed Posts Section */}
      <div>
        <h2 className="text-xl font-medium mb-2">Approved & Denied Posts</h2>
        {loadingManaged ? (
          <div className="text-center">Loading posts...</div>
        ) : errorManaged ? (
          <div className="text-center text-red-500">Failed to load posts.</div>
        ) : managedPosts.length === 0 ? (
          <div className="text-center text-gray-600">No posts to manage.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">User</th>
                  <th className="py-3 px-6 text-left">Title</th>
                  <th className="py-3 px-6 text-left">Description</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {managedPosts.map((post) => (
                  <tr
                    key={post._id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center">
                        {post.user.profilePicture ? (
                          <img
                            src={post.user.profilePicture}
                            alt={post.user.username}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
                        )}
                        <span>{post.user.username}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">{post.title}</td>
                    <td className="py-3 px-6 text-left">{post.description}</td>
                    <td className="py-3 px-6 text-left">
                      {post.isAprroved === true ? (
                        <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded-full">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-200 text-red-800 text-xs font-semibold rounded-full">
                          Denied
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => deletePost(post._id)}
                        className="flex items-center justify-center px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                      >
                        <Trash2 className="mr-1" size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostApproval;
