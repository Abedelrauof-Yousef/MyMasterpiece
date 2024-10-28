// src/AdminDashboard.js

import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  FileCheck,
  BarChart2,
  LogOut
} from 'lucide-react';
import UserManagement from '../Admin/UserManagement';
import PostApproval from '../Admin/PostApproval';
import ContactMessages from '../Admin/AdminContact'; // Import the ContactMessages component

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <BarChart2 size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'approvePosts', label: "Approve User's Posts", icon: <FileCheck size={20} /> },
    { id: 'contactUs', label: 'Contact Us', icon: <MessageSquare size={20} /> }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          <h2 className={`text-xl font-bold ${!sidebarOpen && 'hidden'}`}>Admin Panel</h2>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        <nav className="mt-6 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center px-4 py-3 transition-colors duration-200
                ${activeMenu === item.id ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            >
              <span className="mr-4">{item.icon}</span>
              <span className={`${!sidebarOpen && 'hidden'}`}>{item.label}</span>
            </button>
          ))}
          
          <button className="w-full flex items-center px-4 py-3 mt-auto text-red-400 hover:bg-gray-800 transition-colors duration-200">
            <span className="mr-4"><LogOut size={20} /></span>
            <span className={`${!sidebarOpen && 'hidden'}`}>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-md p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MessageSquare size={20} />
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Based on Active Menu */}
        <main className="p-6">
          {activeMenu === 'overview' && (
            <div>
              <h1 className="text-2xl font-semibold mb-4">Overview</h1>
              {/* Your existing dashboard content goes here */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* ... Dashboard Cards ... */}
              </div>
              {/* Additional overview content */}
            </div>
          )}

          {activeMenu === 'users' && (
            <UserManagement />
          )}

          {activeMenu === 'approvePosts' && (
            <PostApproval />
          )}

          {activeMenu === 'contactUs' && (
            <ContactMessages /> // Render the ContactMessages component
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
