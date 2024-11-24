// src/components/UserManagement.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, UserCheck, UserX, LogOut } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

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

  // Calculate total pages
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Failed to load users.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
        <Users className="mr-2" /> User Management
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Username</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {currentUsers.map(user => (
              <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <div className="flex items-center">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.username} className="w-10 h-10 rounded-full mr-4 object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 mr-4 flex items-center justify-center text-gray-700 font-semibold">
                        {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    <span>{user.username}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-left">{user.email}</td>
                <td className="py-3 px-6 text-center">
                  {user.isActive ? (
                    <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded-full flex items-center justify-center">
                      <UserCheck className="mr-1" size={16} /> Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-200 text-red-800 text-xs font-semibold rounded-full flex items-center justify-center">
                      <UserX className="mr-1" size={16} /> Inactive
                    </span>
                  )}
                </td>
                <td className="py-3 px-6 text-center">
                  {user.isActive ? (
                    <button
                      onClick={() => deactivateUser(user._id)}
                      className="flex items-center justify-center px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                    >
                      <UserX className="mr-2" size={16} /> Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => activateUser(user._id)}
                      className="flex items-center justify-center px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex -space-x-px">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-2 leading-tight border border-gray-300 ${
                  currentPage === index + 1
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ${
                currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
