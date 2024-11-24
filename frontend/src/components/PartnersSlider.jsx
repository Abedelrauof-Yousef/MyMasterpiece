// src/components/PartnersSlider.jsx

import React, { useState } from 'react';

// Sample logos (replace these paths with the actual paths to your logos)
import partner1 from '../assets/etihadLogo.png';
import partner2 from '../assets/arabiBank.png';
import partner3 from '../assets/estthmariBank.png';
import partner4 from '../assets/safwaBank.png';
import partner5 from '../assets/eskanBank.png';
import partner6 from '../assets/qaheraBank.png';

function PartnersSlider() {
  // Enhanced partners array with comprehensive details
  const partners = [
    {
      id: 1,
      logo: partner1,
      name: 'Etihad Airways',
      phone: '+1 (234) 567-8901',
      email: 'contact@etihad.com',
      website: 'https://www.etihad.com/',
      address: 'P.O. Box 35566, Abu Dhabi, United Arab Emirates',
      description: 'Etihad Airways is the second-largest airline in the United Arab Emirates, renowned for its exceptional service and extensive global network.',
      services: [
        'International Flights',
        'Cargo Services',
        'Loyalty Program',
        'In-flight Entertainment',
        'Business and First Class',
      ],
      imageGallery: [
        // Add paths to additional images if available
        partner1, // Placeholder for additional images
      ],
    },
    {
      id: 2,
      logo: partner2,
      name: 'Arab Bank',
      phone: '+1 (234) 567-8902',
      email: 'support@arabbank.com',
      website: 'https://www.arabbank.com/',
      address: '1234 Financial Ave, Riyadh, Saudi Arabia',
      description: 'Arab Bank is a leading financial institution offering a range of banking services to individuals and businesses worldwide.',
      services: [
        'Personal Banking',
        'Corporate Banking',
        'Investment Services',
        'Online Banking',
        'Credit and Loans',
      ],
      imageGallery: [
        partner2, // Placeholder for additional images
      ],
    },
    {
      id: 3,
      logo: partner3,
      name: 'Estthmari Bank',
      phone: '+1 (234) 567-8903',
      email: 'info@estthmaribank.com',
      website: 'https://www.estthmaribank.com/',
      address: '5678 Investment St, Dubai, United Arab Emirates',
      description: 'Estthmari Bank specializes in providing investment and financial solutions tailored to meet the diverse needs of its clients.',
      services: [
        'Wealth Management',
        'Investment Banking',
        'Financial Planning',
        'Asset Management',
        'Retirement Solutions',
      ],
      imageGallery: [
        partner3, // Placeholder for additional images
      ],
    },
    {
      id: 4,
      logo: partner4,
      name: 'Safwa Bank',
      phone: '+1 (234) 567-8904',
      email: 'service@safwabank.com',
      website: 'https://www.safwabank.com/',
      address: '9101 Commerce Blvd, Cairo, Egypt',
      description: 'Safwa Bank offers a variety of banking products designed to help customers achieve their financial goals efficiently.',
      services: [
        'Savings Accounts',
        'Checking Accounts',
        'Mortgage Services',
        'Business Loans',
        'Digital Banking',
      ],
      imageGallery: [
        partner4, // Placeholder for additional images
      ],
    },
    {
      id: 5,
      logo: partner5,
      name: 'Eskan Bank',
      phone: '+1 (234) 567-8905',
      email: 'contact@eskannbank.com',
      website: 'https://www.eskannbank.com/',
      address: '1122 Finance Road, Beirut, Lebanon',
      description: 'Eskan Bank is renowned for its commitment to excellence and customer satisfaction, providing top-notch banking services.',
      services: [
        'Personal Loans',
        'Credit Cards',
        'Foreign Exchange',
        'Investment Products',
        'Insurance Services',
      ],
      imageGallery: [
        partner5, // Placeholder for additional images
      ],
    },
    {
      id: 6,
      logo: partner6,
      name: 'Qahera Bank',
      phone: '+1 (234) 567-8906',
      email: 'support@qaherabank.com',
      website: 'https://www.qaherabank.com/',
      address: '3344 Market Street, Alexandria, Egypt',
      description: 'Qahera Bank provides comprehensive banking services to individuals and businesses, ensuring financial stability and growth.',
      services: [
        'Commercial Banking',
        'Retail Banking',
        'Trade Finance',
        'Treasury Services',
        'Mobile Banking',
      ],
      imageGallery: [
        partner6, // Placeholder for additional images
      ],
    },
  ];

  // State to manage modal visibility and selected partner
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  // Function to open modal with selected partner's details
  const openModal = (partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPartner(null);
  };

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
          {/* Duplicate the partners array for infinite scrolling */}
          {partners.concat(partners).map((partner, index) => (
            <div 
              key={`${partner.id}-${index}`} 
              className="flex-none w-24 sm:w-32 lg:w-48 h-auto px-2 sm:px-4 cursor-pointer"
              onClick={() => openModal(partner)}
            >
              <img
                src={partner.logo}
                alt={`Partner ${partner.name}`}
                className="object-contain w-full h-full hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedPartner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 overflow-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-4 md:mx-0 p-8 relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={closeModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" 
                   viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Partner Details */}
            <div className="flex flex-col md:flex-row">
              {/* Partner Logo */}
              <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                <img
                  src={selectedPartner.logo}
                  alt={selectedPartner.name}
                  className="h-32 w-32 object-contain mx-auto"
                />
              </div>

              {/* Partner Information */}
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{selectedPartner.name}</h3>
                <p className="text-gray-700 mb-4">{selectedPartner.description}</p>
                
                {/* Contact Information */}
                <div className="mb-4">
                  <p className="text-gray-800 font-medium">Contact Information:</p>
                  <p className="text-gray-700"><span className="font-semibold">Phone:</span> {selectedPartner.phone}</p>
                  <p className="text-gray-700"><span className="font-semibold">Email:</span> <a href={`mailto:${selectedPartner.email}`} className="text-blue-500 hover:underline">{selectedPartner.email}</a></p>
                  <p className="text-gray-700"><span className="font-semibold">Website:</span> <a href={selectedPartner.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{selectedPartner.website}</a></p>
                  <p className="text-gray-700"><span className="font-semibold">Address:</span> {selectedPartner.address}</p>
                </div>

                {/* Services Offered */}
                <div className="mb-4">
                  <p className="text-gray-800 font-medium">Services Offered:</p>
                  <ul className="list-disc list-inside text-gray-700">
                    {selectedPartner.services.map((service, idx) => (
                      <li key={idx}>{service}</li>
                    ))}
                  </ul>
                </div>

                {/* Additional Images (Optional) */}
                {selectedPartner.imageGallery && selectedPartner.imageGallery.length > 1 && (
                  <div className="mt-4">
                    <p className="text-gray-800 font-medium mb-2">Gallery:</p>
                    <div className="flex space-x-4 overflow-x-auto">
                      {selectedPartner.imageGallery.slice(1).map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt={`${selectedPartner.name} ${idx + 1}`} 
                          className="h-24 w-24 object-contain rounded-lg shadow-sm"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Close Button at Bottom */}
            <div className="mt-6 text-center">
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PartnersSlider;
