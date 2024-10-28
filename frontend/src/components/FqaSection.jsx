import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is BudgetWiseHub?",
      answer: "BudgetWiseHub is a comprehensive financial management platform that helps you track expenses, create budgets, and achieve your financial goals through personalized insights and smart tools."
    },
    {
      question: "How do I create a budget?",
      answer: "Start by connecting your accounts or entering income sources, then categorize your expenses. Our smart system helps track spending patterns and sends alerts when you approach limits. Set custom categories and financial goals to stay on track."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use bank-level encryption and multi-factor authentication to protect your data. Our platform is SOC 2 Type II certified and undergoes regular security audits to ensure your information remains safe."
    },
    {
      question: "What features are included in the premium plan?",
      answer: "Premium includes advanced investment tracking, custom reports, priority support, AI-powered forecasting, and exclusive access to financial expert webinars. You'll also get early access to new features as they're released."
    },
    {
      question: "Can I connect multiple bank accounts?",
      answer: "Yes, you can connect accounts from thousands of financial institutions. Link your checking, savings, credit cards, and investment accounts to get a complete view of your finances in one place."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-light text-white sm:text-3xl mb-3">
            Frequently Asked <span className="font-semibold text-blue-400">Questions</span>
          </h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
        </motion.div>
        
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-base font-semibold text-gray-800">
                  {faq.question}
                </span>
                <motion.span 
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-blue-500 ml-4"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.span>
              </button>
              <motion.div 
                initial={false}
                animate={{ 
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;