import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Camera, Clock, CreditCard, User } from "lucide-react";

const SettingsView = ({
  settingsData,
  setSettingsData,
  handleSettingsSubmit,
  user,
  subscriptionStatus,
  createOrder,
  onApprove,
  onError,
  error,
  successMessage,
  trialTimeRemaining,
  nextPaymentTimeRemaining,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>
      
      {/* Alert Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600">{successMessage}</p>
        </div>
      )}

      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </h2>
          
          <form onSubmit={handleSettingsSubmit} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex items-start space-x-6">
              {user && user.profilePicture ? (
                <img
                  src={`http://localhost:5001${user.profilePicture}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setSettingsData({
                      ...settingsData,
                      profilePicture: e.target.files[0],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={settingsData.username}
                onChange={(e) =>
                  setSettingsData({
                    ...settingsData,
                    username: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Password Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={settingsData.password}
                  onChange={(e) =>
                    setSettingsData({
                      ...settingsData,
                      password: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={settingsData.confirmPassword}
                  onChange={(e) =>
                    setSettingsData({
                      ...settingsData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Leave blank if not changing password"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription Details
          </h2>

          <div className="space-y-4">
            {/* Subscription Status */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                subscriptionStatus === "active"
                  ? "bg-green-100 text-green-700"
                  : subscriptionStatus === "trial"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {subscriptionStatus === "active"
                  ? "Active"
                  : subscriptionStatus === "trial"
                  ? "Trial"
                  : "Inactive"}
              </span>
            </div>

            {/* Time Remaining Information */}
            {(subscriptionStatus === "trial" && trialTimeRemaining) && (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Trial ends in: {trialTimeRemaining.days}d {trialTimeRemaining.hours}h {trialTimeRemaining.minutes}m</span>
              </div>
            )}

            {(subscriptionStatus === "active" && nextPaymentTimeRemaining) && (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Next payment in: {nextPaymentTimeRemaining.days}d {nextPaymentTimeRemaining.hours}h {nextPaymentTimeRemaining.minutes}m</span>
              </div>
            )}

            {/* Subscription Actions */}
            {(subscriptionStatus === "inactive" || subscriptionStatus === "expired" || subscriptionStatus === "trial") && (
              <div className="mt-6">
                <p className="text-gray-600 mb-6">
                  {subscriptionStatus === "trial"
                    ? "Your trial period allows you to use all features for a limited time. Consider subscribing to continue enjoying uninterrupted access."
                    : "Upgrade your subscription to access all features."}
                </p>
                
                <div className="max-w-md">
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  />
                </div>
              </div>
            )}

            {subscriptionStatus === "active" && (
              <div className="mt-6">
                <p className="text-green-600 font-medium">
                  Your subscription is active. Thank you for your support!
                </p>
                <button className="mt-4 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Manage Subscription
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;