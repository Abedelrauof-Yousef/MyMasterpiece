import React from 'react';
import AboutUsPicture from '../assets/AboutPicture.png'

function AboutBudgetWiseHub() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">About BudgetWiseHub</h2>
            <p className="mt-3 max-w-3xl text-lg text-gray-500">
              Welcome to <strong>BudgetWiseHub</strong>, your ultimate companion for mastering personal finance. Our mission is to empower individuals to take control of their financial future through intuitive budgeting, comprehensive expense tracking, and achievable goal setting.
            </p>
          </div>
          <div className="mt-8 lg:mt-0 lg:w-1/2">
            <img className="rounded-lg shadow-lg" src={AboutUsPicture} alt="Two people talking" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutBudgetWiseHub;