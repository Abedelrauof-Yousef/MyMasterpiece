import React from 'react';
import { UserIcon, CreditCardIcon, PieChartIcon, SettingsIcon, LogOutIcon } from 'lucide-react';

const ProfilePage = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen">
      {/* Header Section */}
      <header className="relative h-64 bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="container mx-auto px-4 h-full flex items-end">
          <div className="relative z-10 pb-8">
            <h1 className="text-4xl font-bold mb-2">Abed</h1>
            <p className="text-xl text-gray-200">Financial Enthusiast</p>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className="md:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <img src="/api/placeholder/128/128" alt="Profile" className="w-24 h-24 rounded-full mr-4" />
                <div>
                  <h2 className="text-2xl font-semibold">John Doe</h2>
                  <p className="text-gray-400">Member since 2022</p>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Contact Info</h3>
                <p className="text-gray-400">Email: john.doe@example.com</p>
                <p className="text-gray-400">Phone: +1 (123) 456-7890</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Quick Stats</h3>
                <p className="text-gray-400">Total Savings: $25,000</p>
                <p className="text-gray-400">Investment Growth: 15%</p>
              </div>
            </div>
          </div>

          {/* Right Column - Financial Overview and Actions */}
          <div className="md:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Financial Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Monthly Budget</h3>
                  <p className="text-3xl font-bold text-blue-400">$5,000</p>
                  <p className="text-gray-400">70% utilized</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Savings Goal</h3>
                  <p className="text-3xl font-bold text-teal-400">$50,000</p>
                  <p className="text-gray-400">50% achieved</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Update Profile', icon: UserIcon },
                  { name: 'Manage Accounts', icon: CreditCardIcon },
                  { name: 'View Reports', icon: PieChartIcon },
                  { name: 'Settings', icon: SettingsIcon },
                  { name: 'Logout', icon: LogOutIcon },
                ].map((action, index) => (
                  <button
                    key={index}
                    className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-lg p-4 transition duration-300 ease-in-out"
                  >
                    <action.icon className="h-6 w-6 mr-2" />
                    <span>{action.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;