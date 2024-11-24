// src/components/SignUp.jsx

import React, { useState, useContext } from "react";
import axios from 'axios';
import { FaChartLine, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/authContext"; // Import AuthContext if needed

const SignUp = () => {
  const { setIsAuthenticated } = useContext(AuthContext); // Use the context to set authenticated state if applicable
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");  
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/users/register", {
        username, 
        email, 
        password
      });
      
      console.log("User Registered Successfully", response.data);
      setIsAuthenticated(true); // Set authenticated state to true on successful registration if applicable
      navigate('/signin'); // Redirect to sign-in page after registration
    } catch (error) {
      console.error("Registration Error", error);
      setError(error.response?.data.msg || "Registration Failed. Please Try Again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Left Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-opacity-10 backdrop-filter backdrop-blur-lg">
        <div className="mb-6">
          <FaChartLine className="text-5xl text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold mb-3 text-center text-white">Budget Wize Hub</h1>
        <p className="text-lg text-center mb-6 text-gray-200">
          Join us and take control of your financial future today!
        </p>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-md">
        <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-filter backdrop-blur-md rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Create an Account</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white mb-1">
                Username
              </label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-white placeholder-gray-400"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                Email Address
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-white placeholder-gray-400"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-white placeholder-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-white" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-white placeholder-gray-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-white" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit Button */}
            <div>
              <button 
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
              >
                Sign Up
              </button>
            </div>
          </form>

          {/* Link to Sign In */}
          <p className="mt-4 text-center text-sm text-white">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-blue-300 hover:text-blue-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
