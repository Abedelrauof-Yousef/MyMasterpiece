import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion'; // Import Framer Motion
import ContactUs from '../assets/contact-us.png';
import Footer from '../components/Footer';

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.1 }} // Start with opacity 0 and slightly zoomed in
          animate={{ opacity: 1, scale: 1 }} // Animate to full opacity and normal scale
          transition={{ duration: 1.5 }} // Set duration for the animation
        >
          <img
            src={ContactUs}
            alt="Finance background"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
        {/* Text has been removed */}
      </header>

      {/* Contact Form and Info Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form Section */}
            <div className="bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h2 className="text-3xl font-bold mb-8 text-blue-600">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
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

                {success && <p className="text-green-600 font-semibold">{success}</p>}
                {error && <p className="text-red-600 font-semibold">{error}</p>}

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
            <div className="bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h2 className="text-3xl font-bold mb-8 text-blue-600">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Mail size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="text-lg font-semibold text-gray-800">contact@budgetwisehub.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Phone size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="text-lg font-semibold text-gray-800">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <MapPin size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Address</p>
                    <p className="text-lg font-semibold text-gray-800">123 Financial District, Amman, Jordan</p>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <img src="/api/placeholder/600/300" alt="Map" className="w-full h-64 object-cover rounded-xl shadow-md transition-all duration-300 hover:shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Contact;
