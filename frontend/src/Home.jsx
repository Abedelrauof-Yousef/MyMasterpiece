import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutBudgetWiseHub from './components/AboutBudget';
import WhyChooseUs from './components/WhyChooseUs';
import Footer from './components/Footer';
import PartnersSlider from './components/PartnersSlider';
import GoalTracker from './components/GoalTracker';
import FAQSection from './components/FqaSection';

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <AboutBudgetWiseHub />
        <WhyChooseUs />
        <GoalTracker />
        <PartnersSlider />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;