// src/components/CommentSection.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ReplyForm from "./ReplyForm";
import Comment from "./Comment"; // Updated Comment component

function CommentSection({ postId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [postingComment, setPostingComment] = useState(false);
  const [error, setError] = useState(null);

  // Fetch comments when component mounts or postId changes
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

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Handle adding a new top-level comment
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
        { content: newComment }, // No parentId for top-level comment
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

  // Handle adding a reply to a specific comment
  const handleAddReply = async (parentId, replyContent) => {
    try {
      const res = await axios.post(
        `http://localhost:5001/api/posts/${postId}/comments`,
        { content: replyContent, parentId },
        { withCredentials: true }
      );
      // Update the comments state by finding the parent comment and adding the reply
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment._id === parentId) {
            return {
              ...comment,
              replies: comment.replies ? [...comment.replies, res.data] : [res.data],
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error("Error adding reply:", error);
      alert("Failed to add reply. Please try again.");
    }
  };

  // Refresh comments after editing or deleting
  const refreshComments = () => {
    fetchComments();
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
            <Comment
              key={comment._id}
              comment={comment}
              currentUser={currentUser}
              addReply={handleAddReply}
              refreshComments={refreshComments} // Pass refreshComments to handle edits/deletions
            />
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
}

export default CommentSection;
