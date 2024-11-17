import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DollarSign, PiggyBank, LineChart, Menu, X } from 'lucide-react';

function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // New state for mobile menu
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const isAdminPath = location.pathname.startsWith("/admin"); // Check if the current path starts with "/admin"

  if (isAdminPath) return null;

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
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition duration-300"
              >
                BudgetWiseHub
              </Link>
            </div>
            {/* Desktop Menu */}
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
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-400 hover:text-white focus:outline-none focus:text-white"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLinkMobile to="/">Home</NavLinkMobile>

              {isAuthenticated && (
                <>
                  <NavLinkMobile to="/dashboard">Financial Dashboard</NavLinkMobile>
                  <NavLinkMobile to="/articles">Articles</NavLinkMobile>
                </>
              )}

              <NavLinkMobile to="/about">About Us</NavLinkMobile>
              <NavLinkMobile to="/contact">Contact Us</NavLinkMobile>

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700 transition duration-300"
                >
                  Logout
                </button>
              ) : (
                <>
                  <NavLinkMobile to="/signin">Sign In</NavLinkMobile>
                  <NavLinkMobile to="/signup" className="bg-indigo-600 hover:bg-indigo-700">
                    Sign Up
                  </NavLinkMobile>
                </>
              )}
            </div>
          </div>
        )}
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

const NavLinkMobile = ({ to, children, className = '' }) => (
  <Link
    to={to}
    className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 transition duration-300 ${className}`}
  >
    {children}
  </Link>
);

export default Navbar;
