import React, { useState } from "react";
import { FaFacebookF, FaChartLine, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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
      navigate("/");
    } catch (err) {
      console.error("Login Error", err);
      setError("Invalid email or password."); // Display error message
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 w-full max-w-4xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center text-white">
            <div className="mb-8">
              <FaChartLine className="text-6xl text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Budget Wize Hub</h1>
            <p className="text-xl text-center mb-8">
              Track, analyze, and optimize your finances with our powerful
              tools.
            </p>
            <div className="w-full max-w-xs space-y-4">
              <button className="w-full bg-white text-gray-800 font-semibold py-3 px-4 rounded-full shadow-md hover:bg-gray-100 transition duration-300 flex items-center justify-center">
                <FcGoogle className="mr-2 text-2xl" />
                Sign in with Google
              </button>
              <button className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-full shadow-md hover:bg-blue-700 transition duration-300 flex items-center justify-center">
                <FaFacebookF className="mr-2 text-2xl" />
                Sign in with Facebook
              </button>
            </div>
          </div>

          {/* Right side */}
          <div className="w-full md:w-1/2 p-8 bg-white bg-opacity-20 backdrop-filter backdrop-blur-md">
            <h2 className="text-3xl font-bold text-white mb-6">Welcome Back</h2>
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
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
              {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
              {/* Show error message */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-white"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-300 hover:text-blue-200"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>
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
      </div>

      {/* Chat Icon */}
      <button className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300">
        <IoChatbubbleEllipsesOutline className="text-2xl" />
      </button>
    </div>
  );
};

export default SignIn;
