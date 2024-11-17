// src/components/Contact.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send, MessageCircle, MessageSquare, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import ContactUs from '../assets/contact-us.png';
import Footer from '../components/Footer';
import MapPic from '../assets/map pic.png';

const Contact = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setContentVisible(true);
      }, 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:5001/api/contact", {
        name,
        email,
        subject,
        message
      }, { withCredentials: true });
      console.log(response.data);
      setSuccess("Message sent successfully!");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("There was an error sending the data:", error);
      setError("Failed to send message, please try again later.");
    }
  };

  const loadingContent = (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center px-4">
      {/* Circle Animation Container */}
      <div className="relative w-32 h-32 mb-8">
        {/* Rotating circle */}
        <div className="absolute inset-0 border-4 border-t-blue-400 border-r-blue-300 border-b-blue-200 border-l-blue-500 rounded-full animate-spin" />
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <MessageCircle className="w-12 h-12 text-blue-400 animate-pulse" />
        </div>
      </div>

      {/* Additional floating icons */}
      <div className="relative w-48 h-12">
        <div className="absolute left-0 animate-bounce">
          <Mail className="w-8 h-8 text-blue-300" />
        </div>
        <div className="absolute right-0 animate-bounce delay-150">
          <MessageSquare className="w-8 h-8 text-blue-300" />
        </div>
      </div>

      {/* Text content */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Welcome to Contact Us
        </h2>
        <p className="text-gray-300 animate-pulse">
          Loading contact information...
        </p>
      </div>
    </div>
  );

  const mainContent = (
    <div className={`bg-gray-100 text-gray-800 min-h-screen transition-opacity duration-500 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section */}
      <header className="relative h-64 sm:h-80 md:h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img
            src={ContactUs}
            alt="Finance background"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
        {/* Optional Overlay for better text visibility */}
        {/* <div className="absolute inset-0 bg-black opacity-50"></div> */}
      </header>

      {/* Contact Form and Info Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form Section */}
            <div className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-700 ${
              contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h2 className="text-3xl font-bold mb-8 text-blue-600">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    placeholder="Your name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    placeholder="Message subject"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    placeholder="Your message here..."
                  ></textarea>
                </div>

                {/* Success and Error Messages */}
                {success && <p className="text-green-600 font-semibold">{success}</p>}
                {error && <p className="text-red-600 font-semibold">{error}</p>}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                >
                  <Send size={18} className="mr-2" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info Section */}
            <div className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-700 delay-200 ${
              contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h2 className="text-3xl font-bold mb-8 text-blue-600">Contact Information</h2>
              <div className="space-y-8">
                {/* Email Info */}
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Mail size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="text-lg font-semibold text-gray-800">budgetwizehub@gmail.com</p>
                  </div>
                </div>

                {/* Phone Info */}
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Phone size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="text-lg font-semibold text-gray-800">+(962)786000975</p>
                  </div>
                </div>

                {/* Address Info */}
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <MapPin size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Address</p>
                    <p className="text-lg font-semibold text-gray-800">Zarqa - Jordan</p>
                  </div>
                </div>
              </div>

              {/* Map Image */}
              <div className="mt-10">
                <img 
                  src={MapPic} 
                  alt="Map location" 
                  className="w-full h-48 sm:h-64 lg:h-72 object-cover rounded-xl shadow-md transition-transform duration-300 hover:shadow-lg hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );

  return isLoading ? loadingContent : mainContent;
};

export default Contact;
