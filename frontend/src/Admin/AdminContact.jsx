// src/Admin/ContactMessages.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all contact messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/admin/contact/contact-messages', {
        // Include authorization headers if necessary
        // headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setMessages(response.data.data);
      } else {
        setError('Failed to fetch messages.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Mark a message as read
  const markAsRead = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:5001/api/admin/contact-messages/${id}/read`, {}, {
        // headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === id ? { ...msg, status: 'read' } : msg
          )
        );
      } else {
        alert('Failed to mark as read.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'An error occurred.');
    }
  };

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Contact Messages</h1>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message._id} className={`p-4 border rounded ${message.status === 'unread' ? 'bg-white' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{message.name}</p>
                  <p className="text-sm text-gray-600">{message.email}</p>
                </div>
                {message.status === 'unread' && (
                  <button
                    onClick={() => markAsRead(message._id)}
                    className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <CheckCircle className="mr-2" size={16} />
                    Mark as Read
                  </button>
                )}
                {message.status === 'read' && (
                  <span className="text-green-500 font-medium">Read</span>
                )}
              </div>
              <p className="mt-2"><strong>Subject:</strong> {message.subject}</p>
              <p className="mt-1"><strong>Message:</strong> {message.message}</p>
              <p className="mt-1 text-sm text-gray-500">Received on: {new Date(message.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
