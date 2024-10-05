import React from 'react';

function WhyChooseUs() {
  const reasons = [
    "Personalized Advice: Tailored financial insights based on your goals",
    "Comprehensive Tools: All-in-one platform for budgeting and expense tracking",
    "Expert Support: Access to professional financial advice"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-lg text-gray-700">{reason}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;