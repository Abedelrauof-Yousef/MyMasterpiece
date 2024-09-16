import React from "react";
import { useState } from "react";
import { FaChartLine, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from 'react-router-dom';

const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] =useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  useEffect(() =>{
    
  })

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col justify-center items-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      {/* Form container with margin-top to push it away from navbar */}
      <div className="w-full max-w-4xl mt-16"> {/* Added mt-16 to push form down */}
        <div className="relative z-10 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left side */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-center items-center text-white">
              <div className="mb-6">
                <FaChartLine className="text-5xl text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold mb-3 text-center">Budget Wize Hub</h1>
              <p className="text-lg text-center mb-6">Join us and take control of your financial future today!</p>
            </div>
            
            {/* Right side */}
            <div className="w-full md:w-1/2 p-6 bg-white bg-opacity-20 backdrop-filter backdrop-blur-md">
              <h2 className="text-2xl font-bold text-white mb-4 text-center md:text-left">Create an Account</h2>
              <form className="space-y-3">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-white mb-1">First Name</label>
                  <input type="text" id="firstName" name="firstName" className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-white placeholder-gray-400" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-white mb-1">Last Name</label>
                  <input type="text" id="lastName" name="lastName" className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-white placeholder-gray-400" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email Address</label>
                  <input type="email" id="email" name="email" className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-white placeholder-gray-400" />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-white placeholder-gray-400"
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
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-white placeholder-gray-400"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
                <div>
                  <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300">
                    Sign Up
                  </button>
                </div>
              </form>
              <p className="mt-4 text-center text-sm text-white">
                Already have an account?{' '}
                <Link to="/signin" className="font-medium text-blue-300 hover:text-blue-200">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;