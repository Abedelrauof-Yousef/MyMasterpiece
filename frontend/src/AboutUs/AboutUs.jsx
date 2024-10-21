import React from 'react';
import { ArrowRightIcon, BarChartIcon, ShieldIcon, UsersIcon, DollarSignIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import Footer from '../components/Footer'; // Ensure this path is correct

const AboutUs = () => {
  const coreValues = [
    { name: 'Innovation', icon: BarChartIcon, description: 'Pioneering solutions for financial growth.' },
    { name: 'Integrity', icon: ShieldIcon, description: 'Upholding the highest ethical standards.' },
    { name: 'Empowerment', icon: UsersIcon, description: 'Enabling financial success for all.' },
    { name: 'Excellence', icon: DollarSignIcon, description: 'Delivering superior financial outcomes.' },
  ];

  const leadershipTeam = [
    { name: "Abedel Ra'uof", role: "CEO & Co-founder", image: "/api/placeholder/400/400" },
    { name: "Jane Smith", role: "CTO & Co-founder", image: "/api/placeholder/400/400" },
    { name: "John Doe", role: "Chief Financial Strategist", image: "/api/placeholder/400/400" },
  ];

  const testimonials = [
    {
      name: "Emily Johnson",
      feedback: "BudgetWizeHub transformed the way I manage my finances. Highly recommend!",
      avatar: "/api/placeholder/100/100",
    },
    {
      name: "Michael Brown",
      feedback: "The tools and support provided are exceptional. My financial health has never been better.",
      avatar: "/api/placeholder/100/100",
    },
  ];

  return (
    <div className="bg-gray-200 text-gray-800">
      
      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.1 }} // Start with opacity 0 and slightly zoomed in
          animate={{ opacity: 1, scale: 1 }} // Animate to full opacity and normal scale
          transition={{ duration: 1.5 }} // Set duration for the animation
        >
          <img
            src="/api/placeholder/1920/1080"
            alt="Finance background"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
        <div className="relative z-10 text-center px-4">
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Redefining Financial Management
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            BudgetWizeHub: Your partner in achieving financial excellence
          </motion.p>
          <motion.a
            href="#"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            Get Started
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </motion.a>
        </div>
      </header>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold mb-8 text-center text-gray-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Our Mission
          </motion.h2>
          <motion.p
            className="text-xl text-center text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            At BudgetWizeHub, we're on a relentless pursuit to democratize financial intelligence. We blend cutting-edge technology with deep financial expertise to empower individuals and businesses to make informed decisions, optimize their resources, and achieve their financial aspirations.
          </motion.p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-200">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold mb-12 text-center text-gray-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Core Values
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
              hidden: {},
            }}
          >
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <value.icon className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{value.name}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold mb-12 text-center text-gray-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Our Approach
          </motion.h2>
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="lg:w-1/2">
              <p className="text-xl text-gray-600 mb-6">
                We believe that financial management should be accessible, intuitive, and tailored to individual needs. Our platform leverages advanced algorithms and machine learning to provide personalized insights and recommendations, ensuring that every user receives a bespoke experience designed to maximize their financial potential.
              </p>
              <p className="text-xl text-gray-600">
                By continuously evolving and integrating user feedback, we strive to offer tools that not only simplify budgeting but also inspire proactive financial planning and smart investment strategies.
              </p>
            </div>
            <div className="lg:w-1/2">
              <motion.img
                src="/api/placeholder/800/600"
                alt="FinanceWise Dashboard"
                className="rounded-lg shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-200">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold mb-12 text-center text-gray-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Leadership Team
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
              hidden: {},
            }}
          >
            {leadershipTeam.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1 text-gray-800">{member.name}</h3>
                  <p className="text-blue-400">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold mb-12 text-center text-gray-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            What Our Clients Say
          </motion.h2>
          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
              hidden: {},
            }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-md text-center transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <FaQuoteLeft className="text-blue-400 text-3xl mb-4" />
                <p className="text-gray-600 mb-4">"{testimonial.feedback}"</p>
                <div className="flex items-center justify-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{testimonial.name}</h4>
                  </div>
                </div>
                <FaQuoteRight className="text-blue-400 text-3xl mt-4" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Add Footer here */}
      <Footer />
    </div>
  );
};

export default AboutUs;
