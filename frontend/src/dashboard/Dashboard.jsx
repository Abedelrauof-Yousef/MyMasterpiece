import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({ expenses: [], goals: [] });

  useEffect(() => {
    axios.get('http://localhost:5001/api/dashboard', { withCredentials: true })
      .then(response => setDashboardData(response.data))
      .catch(error => console.error('Error fetching dashboard data:', error));
  }, []);

  const totalExpenses = dashboardData.expenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <section className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Monthly Budget Summary</h2>
            <p className="text-3xl font-bold text-blue-600">Total Expenses: ${totalExpenses.toFixed(2)}</p>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recent Expenses</h2>
            <ul className="space-y-2">
              {dashboardData.expenses.slice(0, 5).map(expense => (
                <li key={expense._id} className="flex justify-between items-center">
                  <span className="text-gray-700">{expense.category}</span>
                  <span className="text-gray-900 font-semibold">${expense.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Financial Goals</h2>
            <ul className="space-y-4">
              {dashboardData.goals.map(goal => (
                <li key={goal._id} className="bg-gray-50 rounded p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{goal.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Progress:</span>
                    <span className="text-gray-900 font-semibold">${goal.savedAmount} / ${goal.targetAmount}</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(goal.savedAmount / goal.targetAmount) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;