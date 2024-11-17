// src/components/AboutBudgetWiseHub.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AboutUsPicture from '../assets/AboutPicture.png';
import { FaChartLine, FaUsers, FaShieldAlt } from 'react-icons/fa';

function AboutBudgetWiseHub() {
  const featureData = [
    {
      icon: <FaChartLine className="text-blue-600 w-8 h-8 mb-4" />,
      title: "Comprehensive Budgeting",
      description: "Track your income and expenses effortlessly with our intuitive budgeting tools.",
    },
    {
      icon: <FaUsers className="text-blue-600 w-8 h-8 mb-4" />,
      title: "Community Support",
      description: "Join a community of like-minded individuals striving for financial wellness.",
    },
    {
      icon: <FaShieldAlt className="text-blue-600 w-8 h-8 mb-4" />,
      title: "Secure & Private",
      description: "Your data is protected with top-notch security measures and privacy protocols.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-4">
            About <span className="text-blue-600">BudgetWiseHub</span>
          </h2>
          <div className="w-16 h-1 bg-blue-500 mx-auto"></div>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Textual Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:w-1/2 lg:pr-12"
          >
            <p className="text-lg sm:text-xl text-gray-700 mb-6">
              Welcome to <span className="font-semibold text-blue-600">BudgetWiseHub</span>, your ultimate companion for mastering personal finance. Our mission is to empower individuals to take control of their financial future through intuitive budgeting, comprehensive expense tracking, and achievable goal setting.
            </p>
            <p className="text-lg sm:text-xl text-gray-700 mb-6">
              Whether you're saving for a dream vacation, planning for retirement, or simply aiming to manage your daily expenses more effectively, BudgetWiseHub provides the tools and support you need to succeed.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center px-5 py-3 border border-blue-600 text-blue-600 bg-transparent rounded-full text-lg font-medium hover:bg-blue-600 hover:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Read More
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </motion.div>

          {/* Image Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-10 lg:mt-0 lg:w-1/2"
          >
            <div className="relative rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img
                className="w-full h-auto object-cover object-center"
                src={AboutUsPicture}
                alt="People discussing finances"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-600 opacity-30"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-semibold">Join Us Today!</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
            hidden: {},
          }}
        >
          {featureData.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="flex flex-col items-center">
                {feature.icon}
                <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default AboutBudgetWiseHub;
