// src/components/Dashboard/Sidebar.jsx

import React from "react";
import {
  User,
  LayoutDashboard,
  FileText,
  DollarSign,
  PieChart,
  LogOut,
  Target,
  Settings,
  X, // Import X icon
} from "lucide-react";

const Sidebar = ({
  activeView,
  setActiveView,
  isSubscriptionActive,
  user,
  handleLogout,
  isSidebarOpen, // Accept isSidebarOpen prop
  setIsSidebarOpen, // Accept setIsSidebarOpen prop
}) => {
  return (
    <>
      {/* Sidebar for medium and larger screens */}
      <div className="hidden md:block w-64 bg-white shadow-md relative">
        {/* User Info */}
        <div className="p-4 flex items-center space-x-4 mt-16">
          {user && user.profilePicture ? (
            <img
              src={`http://localhost:5001${user.profilePicture}`}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="text-blue-500" />
            </div>
          )}
          <div>
            {user ? (
              <h2 className="font-semibold">{user.username}</h2>
            ) : (
              <h2 className="font-semibold">User</h2>
            )}
          </div>
        </div>
        <nav className="mt-8">
          {/* Dashboard Navigation Button */}
          <button
            onClick={() => setActiveView("dashboard")}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "dashboard"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200 ${
              !isSubscriptionActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isSubscriptionActive}
          >
            <LayoutDashboard className="mr-4" />
            Dashboard
          </button>
          {/* Add Income Navigation Button */}
          <button
            onClick={() => setActiveView("income")}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "income"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200 ${
              !isSubscriptionActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isSubscriptionActive}
          >
            <DollarSign className="mr-4" />
            Add Income
          </button>
          {/* Add Expenses Navigation Button */}
          <button
            onClick={() => setActiveView("expenses")}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "expenses"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200 ${
              !isSubscriptionActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isSubscriptionActive}
          >
            <PieChart className="mr-4" />
            Add Expenses
          </button>
          {/* Add Goal Navigation Button */}
          <button
            onClick={() => setActiveView("goals")}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "goals"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200 ${
              !isSubscriptionActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isSubscriptionActive}
          >
            <Target className="mr-4" />
            Add Goal
          </button>
          {/* View Transactions Navigation Button */}
          <button
            onClick={() => setActiveView("transactions")}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "transactions"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200 ${
              !isSubscriptionActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isSubscriptionActive}
          >
            <FileText className="mr-4" />
            View Transactions
          </button>
          {/* Settings Navigation Button (Always Enabled) */}
          <button
            onClick={() => setActiveView("settings")}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "settings"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200`}
          >
            <Settings className="mr-4" />
            Settings
          </button>
        </nav>
        {/* Logout Button */}
        <div className="absolute bottom-4 left-4">
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-700 hover:text-red-500"
          >
            <LogOut className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Sidebar for small screens */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        {/* Close button */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            {user && user.profilePicture ? (
              <img
                src={`http://localhost:5001${user.profilePicture}`}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="text-blue-500" />
              </div>
            )}
            <div>
              {user ? (
                <h2 className="font-semibold text-lg">{user.username}</h2>
              ) : (
                <h2 className="font-semibold text-lg">User</h2>
              )}
            </div>
          </div>
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <nav className="mt-4">
          {/* Dashboard Navigation Button */}
          <button
            onClick={() => {
              setActiveView("dashboard");
              setIsSidebarOpen(false);
            }}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "dashboard"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200 ${
              !isSubscriptionActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isSubscriptionActive}
          >
            <LayoutDashboard className="mr-4" />
            Dashboard
          </button>
          {/* Add Income Navigation Button */}
          <button
            onClick={() => {
              setActiveView("income");
              setIsSidebarOpen(false);
            }}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "income"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200 ${
              !isSubscriptionActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isSubscriptionActive}
          >
            <DollarSign className="mr-4" />
            Add Income
          </button>
          {/* Add Expenses Navigation Button */}
          <button
            onClick={() => {
              setActiveView("expenses");
              setIsSidebarOpen(false);
            }}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "expenses"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200 ${
              !isSubscriptionActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isSubscriptionActive}
          >
            <PieChart className="mr-4" />
            Add Expenses
          </button>
          {/* Add Goal Navigation Button */}
          <button
            onClick={() => {
              setActiveView("goals");
              setIsSidebarOpen(false);
            }}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "goals"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200 ${
              !isSubscriptionActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isSubscriptionActive}
          >
            <Target className="mr-4" />
            Add Goal
          </button>
          {/* View Transactions Navigation Button */}
          <button
            onClick={() => {
              setActiveView("transactions");
              setIsSidebarOpen(false);
            }}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "transactions"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200 ${
              !isSubscriptionActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isSubscriptionActive}
          >
            <FileText className="mr-4" />
            View Transactions
          </button>
          {/* Settings Navigation Button (Always Enabled) */}
          <button
            onClick={() => {
              setActiveView("settings");
              setIsSidebarOpen(false);
            }}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "settings"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200`}
          >
            <Settings className="mr-4" />
            Settings
          </button>
        </nav>
        {/* Logout Button */}
        <div className="absolute bottom-4 left-4">
          <button
            onClick={() => {
              handleLogout();
              setIsSidebarOpen(false);
            }}
            className="flex items-center text-gray-700 hover:text-red-500"
          >
            <LogOut className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
