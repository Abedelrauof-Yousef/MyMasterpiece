// src/components/CommentSection.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import ReplyForm from "./ReplyForm";
import Comment from "./Comment";

function CommentSection({ postId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [postingComment, setPostingComment] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const res = await axios.get(`http://localhost:5001/api/posts/${postId}/comments`, {
        withCredentials: true,
      });
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

  const handleAddReply = async (parentId, replyContent) => {
    try {
      const res = await axios.post(
        `http://localhost:5001/api/posts/${postId}/comments`,
        { content: replyContent, parentId },
        { withCredentials: true }
      );
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment._id === parentId) {
            return {
              ...comment,
              replies: comment.replies ? [res.data, ...comment.replies] : [res.data],
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

  const refreshComments = () => {
    fetchComments();
  };

  return (
    <div className="mt-12 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6 mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Discussion</h3>
        <p className="mt-2 text-sm text-gray-600">{comments.length} comments</p>
      </div>

      {/* New Comment Form */}
      {currentUser ? (
        <form onSubmit={handleAddComment} className="mb-10">
          <div className="flex items-start space-x-4">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt="Your avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="flex-grow">
              <div className="relative">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What are your thoughts?"
                  className="w-full min-h-[120px] px-4 py-3 text-gray-700 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition duration-200 ease-in-out resize-none placeholder:text-gray-400"
                  required
                />
                {error && (
                  <p className="absolute -bottom-6 left-0 text-red-500 text-sm font-medium">
                    {error}
                  </p>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={postingComment}
                  className={`inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-lg shadow-sm transition duration-150 ease-in-out
                    ${postingComment
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white"}
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {postingComment ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Posting...
                    </>
                  ) : (
                    "Post Comment"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-600 text-center">
            Please{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold underline decoration-2 decoration-blue-500/30 hover:decoration-blue-500 underline-offset-2 transition-colors"
            >
              sign in
            </a>{" "}
            to join the discussion.
          </p>
        </div>
      )}

      {/* Loading Indicator */}
      {loadingComments ? (
        <div className="flex justify-center items-center py-16">
          <div className="relative w-12 h-12">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full animate-spin" />
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full animate-spin border-t-transparent" />
          </div>
        </div>
      ) : comments.length > 0 ? (
        <ul className="space-y-8">
          {comments.map((comment) => (
            <li key={comment._id} className="border-b border-gray-100 last:border-none pb-8 last:pb-0">
              <Comment
                comment={comment}
                currentUser={currentUser}
                addReply={handleAddReply}
                refreshComments={refreshComments}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-900">No comments yet</p>
          <p className="mt-2 text-gray-500">Be the first to share what you think!</p>
        </div>
      )}
    </div>
  );
}

export default CommentSection;
