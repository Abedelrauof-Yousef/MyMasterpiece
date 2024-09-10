import React from "react";
import HeroSectionImage from '../assets/HeroSectionImage.jpg';

function HeroSection(){
    return (
        <div className="hero-section" style={{ backgroundImage: `url(${HeroSectionImage})`, marginBottom: '4rem' }}>
          <div className="overlay"></div>
          <div className="content">
            <h2>Take Control of Your Finances, Track your expenses, set goals, and get personalized financial advice</h2>
            <button>Get Started</button>
          </div>
        </div>
      );
}

export default HeroSection;