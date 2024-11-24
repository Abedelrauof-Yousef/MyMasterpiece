// src/components/SignIn.jsx

import React, { useState, useContext } from "react";
import { AuthContext } from "../context/authContext"; // Import the AuthContext
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

const SignIn = () => {
  const { setIsAuthenticated } = useContext(AuthContext); // Use the context to set authenticated state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Handle the form submit for signing in
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error messages

    try {
      const response = await axios.post(
        "http://localhost:5001/api/users/login",
        { email, password },
        { withCredentials: true }
      );
      console.log(response.data); // For debugging purposes
      setIsAuthenticated(true); // Set authenticated state to true on successful login
      navigate("/"); // Redirect to homepage after login
    } catch (err) {
      console.error("Login Error", err);
      setError("Invalid email or password."); // Display error message
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Left Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-opacity-10 backdrop-filter backdrop-blur-lg">
        <div className="mb-8">
          <FaEye className="text-6xl text-blue-400" /> {/* Placeholder Icon */}
        </div>
        <h1 className="text-4xl font-bold mb-4 text-white">Budget Wize Hub</h1>
        <p className="text-xl text-center mb-8 text-gray-200">
          Track, analyze, and optimize your finances with our powerful tools.
        </p>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-md">
        <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-filter backdrop-blur-md rounded-3xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-white placeholder-gray-400"
                value={email} // Bind to state
                onChange={(e) => setEmail(e.target.value)} // Update state
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-white placeholder-gray-400"
                  value={password} // Bind to state
                  onChange={(e) => setPassword(e.target.value)} // Update state
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
            {error && <p className="text-red-500 text-sm">{error}</p>} {/* Show error message */}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
              >
                Sign In
              </button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-white">
            Not a member?{" "}
            <Link
              to="/signup"
              className="font-medium text-blue-300 hover:text-blue-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Removed Chat Icon */}
    </div>
  );
};

export default SignIn;
