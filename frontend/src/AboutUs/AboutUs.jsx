import React from 'react';
import { ArrowRightIcon, BarChartIcon, ShieldIcon, UsersIcon, DollarSignIcon } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen">
      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/api/placeholder/1920/1080" alt="Finance background" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            Redefining Financial Management
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            BudgetWizeHub: Your partner in achieving financial excellence
          </p>
          <a href="#" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out">
            Get Started
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </a>
        </div>
      </header>

      {/* Mission Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center">Our Mission</h2>
          <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto">
            At BudgetWizeHub, we're on a relentless pursuit to democratize financial intelligence. We blend cutting-edge technology with deep financial expertise to empower individuals and businesses to make informed decisions, optimize their resources, and achieve their financial aspirations.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Innovation', icon: BarChartIcon, description: 'Pioneering solutions for financial growth' },
              { name: 'Integrity', icon: ShieldIcon, description: 'Upholding the highest ethical standards' },
              { name: 'Empowerment', icon: UsersIcon, description: 'Enabling financial success for all' },
              { name: 'Excellence', icon: DollarSignIcon, description: 'Delivering superior financial outcomes' },
            ].map((value, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl">
                <value.icon className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{value.name}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Approach</h2>
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <p className="text-xl text-gray-300">
                We believe that financial management should be accessible, intuitive, and tailored to individual needs. Our platform leverages advanced algorithms and machine learning to provide personalized insights and recommendations, ensuring that every user receives a bespoke experience designed to maximize their financial potential.
              </p>
            </div>
            <div className="lg:w-1/2">
              <img src="/api/placeholder/800/600" alt="FinanceWise Dashboard" className="rounded-lg shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Abedel Ra'uof", role: "CEO & Co-founder" },
              { name: "Abedel Ra'uof", role: "CTO & Co-founder" },
              { name: "Abedel Ra'uof", role: "Chief Financial Strategist" },
            ].map((member, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl">
                <img src="/api/placeholder/400/400" alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-blue-400">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Finances?</h2>
          <p className="text-xl mb-8">Join thousands of individuals and businesses who have already taken the first step towards financial mastery.</p>
          <a href="#" className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-blue-600 bg-white hover:bg-gray-100 transition duration-300 ease-in-out">
            Start Your Journey
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;