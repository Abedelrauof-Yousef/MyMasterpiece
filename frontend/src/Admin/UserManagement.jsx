// src/components/UserManagement.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, UserCheck, UserX, LogOut } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/admin/users');
      setUsers(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Activate a user
  const activateUser = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/admin/users/${id}/activate`);
      setUsers(users.map(user => user._id === id ? { ...user, isActive: true } : user));
    } catch (err) {
      console.error("Error activating user:", err);
      alert("Failed to activate user.");
    }
  };

  // Deactivate a user
  const deactivateUser = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/admin/users/${id}/deactivate`);
      setUsers(users.map(user => user._id === id ? { ...user, isActive: false } : user));
    } catch (err) {
      console.error("Error deactivating user:", err);
      alert("Failed to deactivate user.");
    }
  };

  if (loading) {
    return <div className="text-center">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Failed to load users.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Username</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {console.log("pic", users)}
            {users.map(user => (
              <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <div className="flex items-center">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.username} className="w-10 h-10 rounded-full mr-4" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 mr-4"></div>
                    )}
                    <span>{user.username}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-left">{user.email}</td>
                <td className="py-3 px-6 text-center">
                  {user.isActive ? (
                    <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-200 text-red-800 text-xs font-semibold rounded-full">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="py-3 px-6 text-center">
                  {user.isActive ? (
                    <button
                      onClick={() => deactivateUser(user._id)}
                      className="flex items-center justify-center px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      <UserX className="mr-2" size={16} /> Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => activateUser(user._id)}
                      className="flex items-center justify-center px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                    >
                      <UserCheck className="mr-2" size={16} /> Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
