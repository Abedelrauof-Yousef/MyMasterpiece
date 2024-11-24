// src/Admin/ContactMessages.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle } from "lucide-react";

const ContactMessages = () => {
  // State for messages, loading status, and errors
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for modal visibility and selected message
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Function to fetch all contact messages from the API
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5001/api/admin/contact/contact-messages",
        {

        }
      );
      if (response.data.success) {
        setMessages(response.data.data);
      } else {
        setError("Failed to fetch messages.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  // Function to open the modal with the selected message
  const openModal = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedMessage(null);
    setIsModalOpen(false);
  };

  // Render loading, error, or the list of messages
  if (loading) return <p>Loading messages...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="relative">
      <h1 className="text-2xl font-semibold mb-4">Contact Messages</h1>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`p-4 border rounded ${
                message.status === "unread" ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{message.name}</p>
                  <p className="text-sm text-gray-600">{message.email}</p>
                </div>
                {message.status === "unread" ? (
                  <button
                    onClick={() => openModal(message)}
                    className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <CheckCircle className="mr-2" size={16} />
                    Read
                  </button>
                ) : (
                  <span className="text-green-500 font-medium">Read</span>
                )}
              </div>
              <p className="mt-2">
                <strong>Subject:</strong> {message.subject}
              </p>
              <p className="mt-1">
                <strong>Message:</strong> {message.message}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Received on: {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2">
            {/* Modal Header with Close Button */}
            <div className="flex justify-end p-4">
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {/* Modal Content */}
            <div className="p-4">
              <h2 id="modal-title" className="text-xl font-semibold mb-2">
                Message Details
              </h2>
              <p>
                <strong>Name:</strong> {selectedMessage.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedMessage.email}
              </p>
              <p>
                <strong>Subject:</strong> {selectedMessage.subject}
              </p>
              <p className="mt-2">
                <strong>Message:</strong>
              </p>
              <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              <p className="mt-2 text-sm text-gray-500">
                Received on: {new Date(selectedMessage.createdAt).toLocaleString()}
              </p>
              {/* Modal Actions */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
