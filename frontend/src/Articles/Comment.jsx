// src/components/Comment.jsx

import React, { useState, useRef, useEffect } from "react";
import ReplyForm from "./ReplyForm";
import EditCommentForm from "./EditCommentForm"; // Ensure this component is created
import axios from "axios";
import { MoreVertical } from "lucide-react"; // Import MoreVertical icon

function Comment({ comment, currentUser, addReply, refreshComments }) {
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleReply = async (replyContent) => {
    await addReply(comment._id, replyContent);
    setReplying(false);
  };

  const handleEdit = async (updatedContent) => {
    try {
      await axios.put(
        `http://localhost:5001/api/posts/${comment.post}/comments/${comment._id}`,
        { content: updatedContent },
        { withCredentials: true }
      );
      setEditing(false);
      refreshComments(); // Refresh comments to reflect the edit
    } catch (error) {
      console.error("Error editing comment:", error);
      alert("Failed to edit comment. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axios.delete(
          `http://localhost:5001/api/posts/${comment.post}/comments/${comment._id}`,
          { withCredentials: true }
        );
        refreshComments(); // Refresh comments to reflect the deletion
      } catch (error) {
        console.error("Error deleting comment:", error);
        alert("Failed to delete comment. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex">
        {comment.user.avatar ? (
          <img
            src={comment.user.avatar}
            alt={`${comment.user.username}'s avatar`}
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center text-gray-700 font-semibold">
            {comment.user.username
              ? comment.user.username.charAt(0).toUpperCase()
              : "U"}
          </div>
        )}
        <div className="flex-1 relative">
          {/* Username and Date/Time */}
          <p className="text-sm font-semibold text-gray-800 group">
            {comment.user.username || "User"}
            <span className="ml-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {comment.createdAt
                ? new Date(comment.createdAt).toLocaleString()
                : "Unknown time"}
            </span>
          </p>
          {/* Comment Content or Edit Form */}
          {!editing ? (
            <p className="text-gray-700 mt-1">{comment.content}</p>
          ) : (
            <EditCommentForm
              initialContent={comment.content}
              onCancel={() => setEditing(false)}
              onSave={handleEdit}
            />
          )}
        </div>

        {/* Three-Dots Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {currentUser && comment.user._id === currentUser._id && (
                <>
                  <button
                    onClick={() => {
                      setEditing(true);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </>
              )}
              {currentUser && (
                <button
                  onClick={() => {
                    setReplying(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                >
                  Reply
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reply Form */}
      <div className="ml-14 mt-2">
        {replying && (
          <ReplyForm
            onCancel={() => setReplying(false)}
            onReply={handleReply}
          />
        )}
      </div>

      {/* Replies */}
      {Array.isArray(comment.replies) && comment.replies.length > 0 && (
        <ul className="ml-14 mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <li key={reply._id} className="flex">
              {reply.user.avatar ? (
                <img
                  src={reply.user.avatar}
                  alt={`${reply.user.username}'s avatar`}
                  className="w-8 h-8 rounded-full mr-2 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 flex items-center justify-center text-gray-700 font-semibold">
                  {reply.user.username
                    ? reply.user.username.charAt(0).toUpperCase()
                    : "U"}
                </div>
              )}
              <div className="flex-1 relative">
                {/* Username and Date/Time */}
                <p className="text-sm font-semibold text-gray-800 group">
                  {reply.user.username || "User"}
                  <span className="ml-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {reply.createdAt
                      ? new Date(reply.createdAt).toLocaleString()
                      : "Unknown time"}
                  </span>
                </p>
                {/* Reply Content */}
                <p className="text-gray-700 mt-1">{reply.content}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Comment;
