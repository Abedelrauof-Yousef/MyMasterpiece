// src/components/EditCommentForm.jsx
import React, { useState } from "react";

function EditCommentForm({ initialContent, onSave, onCancel }) {
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Content cannot be empty.");
      return;
    }
    onSave(content.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows="3"
      ></textarea>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Save
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

export default EditCommentForm;
