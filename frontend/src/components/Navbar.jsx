import React from 'react';

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white fixed w-full z-50"> {/* Ensure z-index is higher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold">BudgetWiseHub</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Home</a>
              <a href="about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">About Us</a>
              <a href="Contact" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Contact us</a>
              <a href="signin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Sign in</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
