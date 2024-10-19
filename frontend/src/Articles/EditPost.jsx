// EditPost.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

function EditPost({ onUpdate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState(null); // Store File
  const [currentPicture, setCurrentPicture] = useState(''); // Existing picture URL
  const [preview, setPreview] = useState(null); // For new image preview
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/posts/${id}`, { withCredentials: true });
        setTitle(res.data.title);
        setDescription(res.data.description);
        setCurrentPicture(res.data.picture);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError("Failed to fetch post data.");
      }
    };
    fetchPost();
  }, [id]);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optional: Validate inputs before submitting
    if (!title.trim() && !description.trim()) {
      setError("Title or description must be provided.");
      return;
    }

    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (picture) {
        formData.append("picture", picture);
      }

      const res = await axios.put(
        `http://localhost:5001/api/posts/${id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (typeof onUpdate === 'function') {
        onUpdate(res.data); // Update the post in the parent state with populated user
      } else {
        console.error("onUpdate prop is not a function");
      }
      setError(null);
      navigate('/articles'); // Redirect to the articles page
    } catch (error) {
      console.error('Error updating post:', error);
      setError("Failed to update post. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (error && !title && !description && !currentPicture) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-600">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pt-16 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
        </div>

        {/* Current Picture */}
        {currentPicture && !preview && (
          <div className="mb-4">
            <p className="text-sm text-gray-700">Current Picture:</p>
            <img
              src={currentPicture}
              alt="Current post"
              className="w-full h-auto rounded-md object-cover"
            />
          </div>
        )}

        {/* New Picture Input */}
        <div className="flex items-center mb-4">
          <label htmlFor="picture" className="block text-sm font-medium text-gray-700">
            Change Picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePictureChange}
            className="ml-4 flex-1 border border-gray-300 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* New Image Preview */}
        {preview && (
          <div className="mb-4">
            <p className="text-sm text-gray-700">New Picture Preview:</p>
            <img
              src={preview}
              alt="New post preview"
              className="w-full h-auto rounded-md object-cover"
            />
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Update Button */}
        <button
          type="submit"
          disabled={isUpdating}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isUpdating
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {isUpdating ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
}

EditPost.propTypes = {
  onUpdate: PropTypes.func.isRequired,
};

export default EditPost;
