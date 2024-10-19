// CommentSection.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

function CommentSection({ postId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [postingComment, setPostingComment] = useState(false);
  const [error, setError] = useState(null);

  // Fetch comments when component mounts
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        const res = await axios.get(`http://localhost:5001/api/posts/${postId}/comments`);
        setComments(res.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError("Failed to load comments.");
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [postId]);

  // Handle adding a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      setPostingComment(true);
      const res = await axios.post(
        `http://localhost:5001/api/posts/${postId}/comments`,
        { content: newComment },
        { withCredentials: true }
      );
      setComments([res.data, ...comments]);
      setNewComment("");
      setError(null);
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again.");
    } finally {
      setPostingComment(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4">Comments</h3>

      {/* New Comment Form */}
      {currentUser ? (
        <form onSubmit={handleAddComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="3"
            required
          ></textarea>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <button
            type="submit"
            disabled={postingComment}
            className={`mt-2 px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              postingComment
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {postingComment ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="text-gray-600 mb-6">Please log in to add a comment.</p>
      )}

      {/* Comments List */}
      {loadingComments ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment._id} className="flex">
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
              <div>
                <p className="text-sm font-semibold text-gray-800">{comment.user.username || "User"}</p>
                <p className="text-gray-700">{comment.content}</p>
                <p className="text-xs text-gray-500">
                  {comment.createdAt
                    ? new Date(comment.createdAt).toLocaleString()
                    : "Unknown time"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
}

export default CommentSection;
