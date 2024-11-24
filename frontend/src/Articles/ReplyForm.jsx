// src/components/ReplyForm.jsx

import React, { useState } from "react";

function ReplyForm({ onReply, onCancel }) {
  const [replyContent, setReplyContent] = useState("");
  const [error, setError] = useState(null);
  const [posting, setPosting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      setError("Reply cannot be empty.");
      return;
    }

    try {
      setPosting(true);
      await onReply(replyContent);
      setReplyContent("");
      setError(null);
    } catch (err) {
      setError("Failed to post reply.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <textarea
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        placeholder="Write a reply..."
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows="2"
        required
      ></textarea>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={posting}
          className={`px-3 py-1 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            posting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {posting ? "Replying..." : "Reply"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ReplyForm;
