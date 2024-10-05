import React, { useState } from 'react';
import axios from 'axios';

function AddGoal() {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const goalData = { name, targetAmount, savedAmount, deadline };
    axios.post('http://localhost:5001/api/dashboard/add-goal', goalData, { withCredentials: true })
      .then(response => {
        alert('Goal added successfully');
        // Reset form
        setName('');
        setTargetAmount('');
        setSavedAmount('');
        setDeadline('');
      })
      .catch(error => console.error('Error adding goal:', error));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New Goal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Goal Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">Target Amount:</label>
          <input
            id="targetAmount"
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="savedAmount" className="block text-sm font-medium text-gray-700">Saved Amount:</label>
          <input
            id="savedAmount"
            type="number"
            value={savedAmount}
            onChange={(e) => setSavedAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline:</label>
          <input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
        >
          Add Goal
        </button>
      </form>
    </div>
  );
}

export default AddGoal;