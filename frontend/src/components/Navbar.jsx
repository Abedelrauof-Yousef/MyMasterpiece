import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { DollarSign, PiggyBank, LineChart } from 'lucide-react';

function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('http://localhost:5001/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsAuthenticated(false);

      setTimeout(() => {
        setIsLoggingOut(false);
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {isLoggingOut && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          {/* Circle Animation Container */}
          <div className="relative w-32 h-32 mb-8">
            {/* Rotating circle */}
            <div className="absolute inset-0 border-4 border-t-indigo-600 border-r-indigo-400 border-b-indigo-300 border-l-indigo-500 rounded-full animate-spin" />
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <DollarSign className="w-12 h-12 text-indigo-600 animate-pulse" />
            </div>
          </div>

          {/* Additional floating icons */}
          <div className="relative w-48 h-12">
            <div className="absolute left-0 animate-bounce">
              <PiggyBank className="w-8 h-8 text-pink-500" />
            </div>
            <div className="absolute right-0 animate-bounce delay-150">
              <LineChart className="w-8 h-8 text-green-500" />
            </div>
          </div>

          {/* Text content */}
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Saving your progress...
            </h2>
            <p className="text-gray-600 animate-pulse">
              See you next time!
            </p>
          </div>
        </div>
      )}

      <nav className="bg-gray-800 text-white fixed top-0 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition duration-300"
              >
                BudgetWiseHub
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <NavLink to="/">Home</NavLink>

                {isAuthenticated && (
                  <>
                    <NavLink to="/dashboard">Financial Dashboard</NavLink>
                    <NavLink to="/articles">Articles</NavLink>
                  </>
                )}

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
                    <NavLink to="/signup" className="bg-indigo-600 hover:bg-indigo-700">
                      Sign Up
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
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