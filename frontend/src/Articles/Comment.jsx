// src/components/Comment.jsx
import React, { useState } from "react";
import ReplyForm from "./ReplyForm";
import EditCommentForm from "./EditCommentForm"; // New component
import axios from "axios";

function Comment({ comment, currentUser, addReply, refreshComments }) {
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);

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
    <li className="flex flex-col">
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
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">{comment.user.username || "User"}</p>
          {!editing ? (
            <p className="text-gray-700">{comment.content}</p>
          ) : (
            <EditCommentForm
              initialContent={comment.content}
              onCancel={() => setEditing(false)}
              onSave={handleEdit}
            />
          )}
          <p className="text-xs text-gray-500">
            {comment.createdAt
              ? new Date(comment.createdAt).toLocaleString()
              : "Unknown time"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="ml-14 mt-2 flex space-x-2">
        {currentUser && comment.user._id === currentUser._id && !editing && (
          <>
            <button
              onClick={() => setEditing(true)}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </>
        )}
        {currentUser && !editing && (
          <button
            onClick={() => setReplying(true)}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Reply
          </button>
        )}
      </div>

      {/* Reply Form */}
      <div className="ml-14 mt-2">
        {replying ? (
          <ReplyForm
            onCancel={() => setReplying(false)}
            onReply={handleReply}
          />
        ) : null}
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
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{reply.user.username || "User"}</p>
                <p className="text-gray-700">{reply.content}</p>
                <p className="text-xs text-gray-500">
                  {reply.createdAt
                    ? new Date(reply.createdAt).toLocaleString()
                    : "Unknown time"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default Comment;
