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
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition duration-300">
              BudgetWiseHub
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/about">About Us</NavLink>
              <NavLink to="/contact">Contact Us</NavLink>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 transition duration-300"
                >
                  Logout
                </button>
              ) : (
                <>
                  <NavLink to="/signin">Sign In</NavLink>
                  <NavLink to="/signup" className="bg-indigo-600 hover:bg-indigo-700">Sign Up</NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

const NavLink = ({ to, children, className = '' }) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-300 ${className}`}
  >
    {children}
  </Link>
);

export default Navbar;