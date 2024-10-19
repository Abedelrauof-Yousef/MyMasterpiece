// CreatePost.jsx
import React, { useState } from "react";
import axios from "axios";

function CreatePost({ currentUser, onPostCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState(null); // Change to null to store File
  const [preview, setPreview] = useState(null); // For image preview
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState(null);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicture(file);
      setPreview(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();

    // Validation: Ensure title and/or description or picture are provided
    if (!title.trim() && !description.trim() && !picture) {
      setError("Please add a title, description, or a picture.");
      return;
    }

    try {
      setIsPosting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (picture) {
        formData.append("picture", picture);
      }

      const res = await axios.post("http://localhost:5001/api/posts", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onPostCreated(res.data); // Add the new post to the list with populated user
      setTitle("");
      setDescription("");
      setPicture(null);
      setPreview(null);
      setError(null);
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <form onSubmit={handlePost} className="flex flex-col">
        <div className="flex items-start mb-4">
          {/* User Avatar */}
          {currentUser && currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={`${currentUser.username}'s avatar`}
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex items-center justify-center text-gray-700 text-xl">
              {currentUser && currentUser.username
                ? currentUser.username.charAt(0).toUpperCase()
                : "U"}
            </div>
          )}
          {/* Description Input */}
          <textarea
            className="flex-1 border border-gray-300 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows="2"
            placeholder={`What's on your mind, ${
              currentUser ? currentUser.username : "User"
            }?`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Title Input */}
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Post Title (required)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="flex-1 border border-gray-300 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Picture Input */}
        <div className="flex items-center mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handlePictureChange}
            className="flex-1 border border-gray-300 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Image Preview */}
        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="Post preview"
              className="w-full h-auto rounded-md object-cover"
            />
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Post Button */}
        <button
          type="submit"
          disabled={isPosting}
          className={`self-end px-6 py-2 rounded-full text-white ${
            isPosting
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          {isPosting ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
