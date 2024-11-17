import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast

function CreatePost({ currentUser, onPostCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();

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

      // Success notification
      toast.success("Post created successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      // Admin approval notification
      toast.info("Your post has been submitted and is pending admin approval.", {
        position: "top-center",
        autoClose: 5000,
        style: {
          backgroundColor: '#3B82F6',
          color: 'white',
        }
      });

      onPostCreated(res.data);
      setTitle("");
      setDescription("");
      setPicture(null);
      setPreview(null);
      setError(null);
      setIsExpanded(false);
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
      
      // Error notification
      toast.error("Failed to create post. Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8 transition-all duration-300">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full text-left text-gray-600 focus:outline-none"
        >
          <div className="flex items-center">
            {currentUser && currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={`${currentUser.username}'s avatar`}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center text-gray-700">
                {currentUser && currentUser.username
                  ? currentUser.username.charAt(0).toUpperCase()
                  : "U"}
              </div>
            )}
            <span className="text-gray-500">
              What's on your mind, {currentUser ? currentUser.username : "User"}?
            </span>
          </div>
        </button>
      ) : (
        <form onSubmit={handlePost} className="space-y-4">
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder={`What's on your mind, ${
              currentUser ? currentUser.username : "User"
            }?`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="3"
          ></textarea>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-600">Add Photo</span>
              <input type="file" accept="image/*" onChange={handlePictureChange} className="hidden" />
            </label>
            {preview && (
              <img src={preview} alt="Preview" className="h-10 w-10 object-cover rounded" />
            )}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPosting}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isPosting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isPosting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CreatePost;