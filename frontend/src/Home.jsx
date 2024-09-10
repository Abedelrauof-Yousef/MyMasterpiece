import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutBudgetWizeHub from "./components/AboutBudget";
import WhyChooseUs from "./components/WhyChooseUs";
import Footer from "./components/Footer";
import ArticlesCarousel from "./ArticleCards/ArticlesCarousel";


function HomePage() {
  return (
    <>
    <Navbar/>
    <HeroSection/>
    <AboutBudgetWizeHub />
    <WhyChooseUs />
    <ArticlesCarousel/>
    <Footer />
    </>
  );
}

export default HomePage;
