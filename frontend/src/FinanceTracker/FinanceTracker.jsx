import React, { useState } from 'react';
import { DollarSignIcon, CalendarIcon, TargetIcon, PieChartIcon, PlusCircleIcon, MinusCircleIcon } from 'lucide-react';

const FinanceTracker = () => {
  const [salary, setSalary] = useState('');
  const [categories, setCategories] = useState([
    { name: 'Needs', percentage: 50, amount: 0 },
    { name: 'Wants', percentage: 30, amount: 0 },
    { name: 'Savings', percentage: 20, amount: 0 },
  ]);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ name: '', amount: '', date: '' });

  const handleSalaryChange = (e) => {
    const newSalary = parseFloat(e.target.value);
    setSalary(newSalary);
    updateCategoryAmounts(newSalary);
  };

  const updateCategoryAmounts = (newSalary) => {
    const updatedCategories = categories.map(category => ({
      ...category,
      amount: (newSalary * category.percentage) / 100
    }));
    setCategories(updatedCategories);
  };

  const handleCategoryChange = (index, field, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index][field] = parseFloat(value);
    setCategories(updatedCategories);
    updateCategoryAmounts(salary);
  };

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.amount && newGoal.date) {
      setGoals([...goals, newGoal]);
      setNewGoal({ name: '', amount: '', date: '' });
    }
  };

  const totalAllocated = categories.reduce((sum, category) => sum + category.amount, 0);
  const remainingAmount = salary - totalAllocated;

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-blue-600 to-teal-500 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">FinanceWise Dashboard</h1>
          <p className="text-xl text-gray-200">Take control of your financial future</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Salary and Budget Allocation */}
          <section className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Salary and Budget Allocation</h2>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Monthly Salary</label>
              <div className="flex items-center">
                <DollarSignIcon className="h-5 w-5 mr-2 text-gray-400" />
                <input
                  type="number"
                  value={salary}
                  onChange={handleSalaryChange}
                  className="bg-gray-700 text-white rounded-lg px-4 py-2 w-full"
                  placeholder="Enter your monthly salary"
                />
              </div>
            </div>
            <div className="space-y-4">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                    className="bg-gray-700 text-white rounded-lg px-4 py-2 w-1/3"
                  />
                  <input
                    type="number"
                    value={category.percentage}
                    onChange={(e) => handleCategoryChange(index, 'percentage', e.target.value)}
                    className="bg-gray-700 text-white rounded-lg px-4 py-2 w-1/4"
                  />
                  <span className="text-gray-400">%</span>
                  <span className="text-gray-400">=</span>
                  <span className="text-blue-400 font-semibold">${category.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-xl font-semibold">
                Remaining: <span className={`${remainingAmount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${remainingAmount.toFixed(2)}
                </span>
              </p>
            </div>
          </section>

          {/* Financial Goals */}
          <section className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Financial Goals</h2>
            <div className="mb-6">
              <div className="flex space-x-4 mb-4">
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  className="bg-gray-700 text-white rounded-lg px-4 py-2 flex-grow"
                  placeholder="Goal name"
                />
                <input
                  type="number"
                  value={newGoal.amount}
                  onChange={(e) => setNewGoal({...newGoal, amount: e.target.value})}
                  className="bg-gray-700 text-white rounded-lg px-4 py-2 w-1/4"
                  placeholder="Amount"
                />
                <input
                  type="date"
                  value={newGoal.date}
                  onChange={(e) => setNewGoal({...newGoal, date: e.target.value})}
                  className="bg-gray-700 text-white rounded-lg px-4 py-2"
                />
              </div>
              <button
                onClick={handleAddGoal}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 transition duration-300 ease-in-out"
              >
                Add Goal
              </button>
            </div>
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{goal.name}</h3>
                    <p className="text-gray-400">${goal.amount}</p>
                  </div>
                  <div className="text-gray-400">
                    <CalendarIcon className="h-5 w-5 inline mr-1" />
                    {goal.date}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Financial Overview */}
        <section className="mt-12 bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Financial Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Total Budget', value: salary, icon: DollarSignIcon, color: 'text-blue-400' },
              { name: 'Allocated', value: totalAllocated, icon: PieChartIcon, color: 'text-green-400' },
              { name: 'Remaining', value: remainingAmount, icon: DollarSignIcon, color: remainingAmount >= 0 ? 'text-green-400' : 'text-red-400' },
              { name: 'Active Goals', value: goals.length, icon: TargetIcon, color: 'text-yellow-400' },
            ].map((item, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{item.name}</h3>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <p className={`text-2xl font-bold ${item.color}`}>
                  {typeof item.value === 'number' ? `$${item.value.toFixed(2)}` : item.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default FinanceTracker;