import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutBudgetWiseHub from './components/AboutBudget';
import WhyChooseUs from './components/WhyChooseUs';
import ArticlesCarousel from './ArticleCards/ArticlesCarousel';
import Footer from './components/Footer';

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <AboutBudgetWiseHub />
        <WhyChooseUs />
        <ArticlesCarousel />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;