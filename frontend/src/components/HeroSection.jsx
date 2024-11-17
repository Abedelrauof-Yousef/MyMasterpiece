// src/components/HeroSection.jsx

import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { Link } from 'react-router-dom';
import heroSectionImage from '../assets/heroSectionImage.jpg';

function HeroSection() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroSectionImage})` }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-white text-center px-4 sm:px-6 lg:px-8 min-h-[60vh] md:min-h-screen">
        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          Take Control of Your Finances
        </h1>
        
        {/* Subheading */}
        <p className="text-base sm:text-lg md:text-xl mb-6 max-w-xl">
          Track your expenses, set goals, and get personalized financial advice
        </p>
        
        {/* Call-to-Action Button */}
        {!isAuthenticated && (
          <Link
            to="/signup"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-full transition duration-300 transform hover:scale-105"
          >
            Get Started
          </Link>
        )}
      </div>
    </section>
  );
}

export default HeroSection;
