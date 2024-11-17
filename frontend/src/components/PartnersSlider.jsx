// src/components/PartnersSlider.jsx

import React from 'react';

// Sample logos (replace these paths with the actual paths to your logos)
import partner1 from '../assets/etihadLogo.png';
import partner2 from '../assets/arabiBank.png';
import partner3 from '../assets/estthmariBank.png';
import partner4 from '../assets/safwaBank.png';
import partner5 from '../assets/eskanBank.png';
import partner6 from '../assets/qaheraBank.png';

function PartnersSlider() {
  const logos = [partner1, partner2, partner3, partner4, partner5, partner6];

  return (
    <section className="py-12 bg-gray-50">
      {/* Styled "Our Partners" heading */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 mb-3">
          Our Partners
        </h2>
        <div className="w-12 sm:w-16 h-1 bg-blue-500 mx-auto"></div>
      </div>
      
      {/* Slider Container */}
      <div className="overflow-hidden">
        <div className="flex items-center space-x-6 animate-scroll sm:animate-scrollFast lg:animate-scrollSlow">
          {/* Duplicate the logos for infinite scrolling */}
          {logos.concat(logos).map((logo, index) => (
            <div key={index} className="flex-none w-24 sm:w-32 lg:w-48 h-auto px-2 sm:px-4">
              <img
                src={logo}
                alt={`Partner ${index % logos.length + 1}`}
                className="object-contain w-full h-full hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PartnersSlider;
