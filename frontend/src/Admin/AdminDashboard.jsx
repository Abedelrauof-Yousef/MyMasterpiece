// src/components/AdminDashboard.js

import React, { useState } from "react";
import {
  Users,
  FileCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import UserManagement from "./UserManagement";
import PostApproval from "./PostApproval";
import ContactMessages from "./AdminContact";
import { useNavigate } from 'react-router-dom';

// Custom Card Component (Retained if used elsewhere; remove if unused)
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
);

// Main AdminDashboard Component
const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("users"); // Set default to 'users'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();


  // Menu Items
  const menuItems = [
    { id: "users", label: "Users", icon: <Users size={20} /> },
    {
      id: "approvePosts",
      label: "Approve Posts",
      icon: <FileCheck size={20} />,
    },
    {
      id: "contactUs",
      label: "Contact Messages",
      icon: <FileCheck size={20} />,
    },
  ];

  // Render Content Based on Active Menu
  const renderContent = () => {
    switch (activeMenu) {
      case "users":
        return <UserManagement />;
      case "approvePosts":
        return <PostApproval />;
      case "contactUs":
        return <ContactMessages />;
      default:
        return <UserManagement />; // Default to UserManagement if none match
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white ${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between">
          {/* Admin Panel Title */}
          <h2 className={`text-xl font-bold ${!sidebarOpen && "hidden"}`}>
            Admin Panel
          </h2>
          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center px-4 py-3 transition-colors duration-200
                ${
                  activeMenu === item.id
                    ? "bg-blue-600"
                    : "hover:bg-gray-800"
                }`}
            >
              <span className="mr-4">{item.icon}</span>
              <span className={`${!sidebarOpen && "hidden"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <button className="w-full flex items-center px-4 py-3 mt-auto text-red-400 hover:bg-gray-800 transition-colors duration-200"
        onClick={()=> {navigate("/login-admin")}}>
          <span className="mr-4">
            <LogOut size={20} />
          </span>
          <span className={`${!sidebarOpen && "hidden"}`}>Logout</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-md p-4">
          <div className="flex items-center justify-between">
            {/* Toggle Sidebar Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu size={20} />
            </button>
            {/* User Profile or Placeholder */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
  