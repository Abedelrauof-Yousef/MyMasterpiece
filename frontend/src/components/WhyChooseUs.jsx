import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

function WhyChooseUs() {
  const [openIndex, setOpenIndex] = useState(null);

  const reasons = [
    {
      title: "Personalized Advice",
      description: "Tailored financial insights based on your unique goals and situation",
      details: "Our platform analyzes your spending habits and financial goals to provide customized advice, helping you reach your milestones faster.",
      icon: (
        <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    {
      title: "Comprehensive Tools",
      description: "All-in-one platform for budgeting, expense tracking, and financial planning",
      details: "From daily budgeting to long-term financial planning, our suite of tools covers every aspect of your financial journey.",
      icon: (
        <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    {
      title: "Expert Support",
      description: "Access to professional financial advice whenever you need it",
      details: "Get insights from industry experts, stay informed with up-to-date financial news, and receive guidance tailored to your financial needs.",
      icon: (
        <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
  ];

  const toggleDetails = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-light text-white sm:text-5xl mb-4">
            Why Choose <span className="font-semibold text-blue-400">Us</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full"></div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`relative bg-white rounded-xl transition-all duration-300 overflow-hidden
                ${openIndex === index ? 'shadow-2xl ring-2 ring-blue-400 transform -translate-y-1' : 
                'shadow-lg hover:shadow-xl hover:-translate-y-1'}`}
            >
              <div 
                onClick={() => toggleDetails(index)}
                className="p-8 cursor-pointer group"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
                    {reason.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 ml-4">{reason.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{reason.description}</p>
                
                <motion.div
                  animate={{ 
                    rotate: openIndex === index ? 180 : 0,
                    backgroundColor: openIndex === index ? '#EFF6FF' : '#F8FAFC'
                  }}
                  className="absolute top-6 right-6 rounded-full p-2 transition-colors duration-200"
                >
                  <ChevronDown className="w-5 h-5 text-blue-500" />
                </motion.div>
              </div>

              <motion.div 
                initial={false}
                animate={{ 
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-8 pt-2 bg-gradient-to-b from-blue-50 to-white">
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mb-4"></div>
                  <p className="text-gray-700 leading-relaxed">{reason.details}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;