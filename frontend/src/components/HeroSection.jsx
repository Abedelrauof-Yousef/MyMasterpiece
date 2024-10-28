// src/components/HeroSection.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import heroSectionImage from '../assets/heroSectionImage.jpg';

function HeroSection() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: `url(${heroSectionImage})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Take Control of Your Finances</h1>
        <p className="text-xl md:text-2xl mb-8">Track your expenses, set goals, and get personalized financial advice</p>
        {!isAuthenticated && (
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105">
            Get Started
          </button>
        )}
      </div>
    </div>
  );
}


export default HeroSection;
