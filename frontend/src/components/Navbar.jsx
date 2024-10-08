// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { Link } from 'react-router-dom';

function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5001/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsAuthenticated(false); // Update the state to unauthenticated
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold">BudgetWiseHub</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Home</Link>
              <Link to="about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">About Us</Link>
              <Link to="contact" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Contact Us</Link>

              {/* Conditionally render based on authentication */}
              {isAuthenticated ? (
                <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Logout
                </button>
              ) : (
                <>
                  <Link to="signin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Sign In</Link>
                  <Link to="signup" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
