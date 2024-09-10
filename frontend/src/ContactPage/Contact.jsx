import React from 'react';
import { Mail, Phone, MapPin, Send, ArrowRightIcon } from 'lucide-react';
import AboutPicture from '../assets/AboutPicture.png';
const Contact = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen">
      {/* Hero Section */}
      <header className="relative py-24 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={AboutPicture} alt="Finance background" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            We're here to help with any questions about our financial services.
          </p>
        </div>
      </header>

      {/* Contact Form and Info Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-900 rounded-lg p-8 shadow-lg">
              <h2 className="text-3xl font-bold mb-6 text-blue-400">Send us a Message</h2>
              <form>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="4"
                    className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center">
                  <Send size={18} className="mr-2" />
                  Send Message
                </button>
              </form>
            </div>
            <div className="bg-gray-900 rounded-lg p-8 shadow-lg">
              <h2 className="text-3xl font-bold mb-6 text-blue-400">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-center">
                  <Mail size={24} className="text-teal-300 mr-4" />
                  <p className="text-gray-300">contact@budgetwisehub.com</p>
                </div>
                <div className="flex items-center">
                  <Phone size={24} className="text-teal-300 mr-4" />
                  <p className="text-gray-300">+1 (555) 123-4567</p>
                </div>
                <div className="flex items-center">
                  <MapPin size={24} className="text-teal-300 mr-4" />
                  <p className="text-gray-300">123 Financial District, Amman, Jordan</p>
                </div>
              </div>
              <div className="mt-8">
                <img src="/api/placeholder/600/300" alt="Map" className="w-full h-64 object-cover rounded-lg shadow-md" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;