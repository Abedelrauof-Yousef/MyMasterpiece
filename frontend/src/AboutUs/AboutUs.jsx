import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChartIcon, ShieldIcon, UsersIcon, DollarSignIcon, DollarSign, LineChart, PiggyBank, Milestone, Trophy } from 'lucide-react';
import ReactStars from 'react-rating-stars-component';
import Slider from 'react-slick';
import Footer from '../components/Footer';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const AboutUs = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [errorFeedbacks, setErrorFeedbacks] = useState(null);

  const coreValues = [
    { 
      name: 'Innovation', 
      icon: BarChartIcon, 
      description: 'We constantly explore new ideas to simplify personal finance.' 
    },
    { 
      name: 'Transparency', 
      icon: ShieldIcon, 
      description: 'We ensure clarity in every financial decision.' 
    },
    { 
      name: 'Empowerment', 
      icon: UsersIcon, 
      description: 'We provide tools to help you take control of your finances.' 
    },
    { 
      name: 'Excellence', 
      icon: DollarSignIcon, 
      description: 'We deliver exceptional solutions tailored to your needs.' 
    },
  ];

  const companyMilestones = [
    {
      year: 'August',
      title: 'The Vision',
      description: 'The idea of BudgetWizeHub was born, aiming to revolutionize personal finance management through innovative technology.',
      icon: Milestone,
    },
    {
      year: 'September',
      title: 'Development Begins',
      description: 'Our dedicated team started working on transforming the vision into reality, laying the foundation for our platform.',
      icon: Trophy,
    },
    {
      year: 'October',
      title: 'Platform Ready',
      description: 'After months of development and testing, our comprehensive financial management platform was completed.',
      icon: UsersIcon,
    },
    {
      year: 'November',
      title: 'Official Launch',
      description: 'BudgetWizeHub officially launched, bringing smart financial management tools to users worldwide.',
      icon: BarChartIcon,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setContentVisible(true);
        setTimeout(() => {
          setImageLoaded(true);
        }, 500);
      }, 200);
    }, 800);

    // Fetch feedbacks with 4 stars and above
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/feedback');
        const filteredFeedbacks = res.data.filter(fb => fb.rating >= 4);
        setFeedbacks(filteredFeedbacks);
        setErrorFeedbacks(null);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setErrorFeedbacks('Failed to load feedback. Please try again later.');
      } finally {
        setLoadingFeedbacks(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const loadingContent = (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 border-4 border-t-blue-400 border-r-blue-300 border-b-blue-200 border-l-blue-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <DollarSign className="w-12 h-12 text-blue-400 animate-pulse" />
        </div>
      </div>
      <div className="relative w-48 h-12">
        <div className="absolute left-0 animate-bounce">
          <PiggyBank className="w-8 h-8 text-blue-300" />
        </div>
        <div className="absolute right-0 animate-bounce delay-150">
          <LineChart className="w-8 h-8 text-blue-300" />
        </div>
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Welcome to BudgetWizeHub
        </h2>
        <p className="text-gray-300 animate-pulse">
          Loading our story...
        </p>
      </div>
    </div>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Adjust as needed
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  const mainContent = (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className={`w-full h-full transition-transform duration-1000 ${imageLoaded ? 'scale-100 opacity-30' : 'scale-110 opacity-0'}`}>
            <img 
              src="/api/placeholder/1920/1080" 
              alt="Financial Dashboard" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-800/80"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-4xl md:text-5xl font-light mb-6 text-white">
            About <span className="font-semibold text-blue-400">BudgetWizeHub</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We blend cutting-edge technology with deep financial expertise to empower individuals and businesses to make informed decisions and achieve their financial aspirations.
          </p>
        </div>
      </div>

      {/* Core Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 text-center mb-4">
            Our Core <span className="font-semibold text-blue-600">Values</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full mb-12"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-lg">
                <value.icon className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{value.name}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Stories Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-4 text-white">
            Hear from Our <span className="font-semibold text-blue-400">Customers</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full mb-12"></div>
          {loadingFeedbacks ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            </div>
          ) : errorFeedbacks ? (
            <div className="bg-red-900/50 border-l-4 border-red-500 text-red-200 p-4 rounded">
              {errorFeedbacks}
            </div>
          ) : feedbacks.length > 0 ? (
            <Slider {...sliderSettings}>
              {feedbacks.map((fb) => (
                <div key={fb._id} className="px-2">
                  <div className="bg-gray-800/50 rounded-xl p-6 shadow-lg flex flex-col items-center">
                    <h3 className="text-xl font-semibold text-white mb-2 text-center">{fb.user?.username || 'Anonymous'}</h3>
                    <div className="flex justify-center mt-2 mb-4">
                      <ReactStars
                        count={5}
                        value={fb.rating}
                        edit={false}
                        size={20}
                        activeColor="#ffd700"
                      />
                    </div>
                    <p className="text-gray-400 italic text-center">"{fb.comment}"</p>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No customer feedback yet. Check back later!</p>
            </div>
          )}
        </div>
      </section>

      {/* Company Journey Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-4 text-gray-900">
            Our <span className="font-semibold text-blue-600">Journey</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full mb-12"></div>
          
          {/* Timeline container */}
          <div className="relative">
            {/* Timeline line - hidden on mobile, visible on md and up */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-blue-200"></div>
            
            {/* Timeline content */}
            <div className="space-y-8 md:space-y-24">
              {companyMilestones.map((milestone, index) => (
                <div key={index} className="relative">
                  {/* Mobile layout (stacked) */}
                  <div className="md:hidden flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg mb-4">
                      <milestone.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-blue-600 font-medium mb-4">{milestone.year}</span>
                    <div className="w-full bg-gray-50 p-6 rounded-xl shadow-lg">
                      <h3 className="text-xl font-semibold text-blue-600 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:grid md:grid-cols-5 items-center">
                    {/* Left content */}
                    <div className={`col-span-2 ${index % 2 === 0 ? 'pr-12' : 'opacity-0'}`}>
                      <div className={`bg-gray-50 p-6 rounded-xl shadow-lg ${index % 2 === 0 ? '' : 'invisible'}`}>
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Center icon and date */}
                    <div className="col-span-1 flex flex-col items-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg mb-2">
                        <milestone.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-blue-600 font-medium">{milestone.year}</span>
                    </div>

                    {/* Right content */}
                    <div className={`col-span-2 ${index % 2 === 1 ? 'pl-12' : 'opacity-0'}`}>
                      <div className={`bg-gray-50 p-6 rounded-xl shadow-lg ${index % 2 === 1 ? '' : 'invisible'}`}>
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );

  return isLoading ? loadingContent : mainContent;
};

export default AboutUs;
