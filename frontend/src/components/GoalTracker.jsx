import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, DollarSign, Calendar, TrendingUp, Target, Award } from 'lucide-react';

const GoalTracker = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchGoals = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/goals", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch goals: ${res.status}`);
        }

        const data = await res.json();
        setGoals(data);
      } catch (err) {
        console.error("Error fetching goals:", err.message);
        setError("Failed to load goals.");
      }
    };

    fetchGoals();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  const chartData = goals.map(goal => ({
    name: goal.name,
    progress: (goal.progress ?? 0) / (goal.targetAmount ?? 1) * 100,
    remaining: 100 - ((goal.progress ?? 0) / (goal.targetAmount ?? 1) * 100)
  }));

  return (
    <div className="w-full max-w-7xl mx-auto mt-12 mb-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-5xl font-extrabold mb-12 text-indigo-900 flex items-center justify-center">
        <Target className="mr-4 text-indigo-600" size={48} /> Your Financial Goals
      </h2>
      {error && (
        <div className="mb-8 border border-red-300 bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      {goals.length > 0 ? (
        <>
          <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-indigo-800 mb-4">Goal Progress Overview</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 40, left: 30, bottom: 10 }}>
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip 
                    content={({ payload, label }) => {
                      if (payload && payload.length) {
                        return (
                          <div className="bg-white p-3 rounded shadow-lg">
                            <p className="font-bold text-indigo-900">{label}</p>
                            <p className="text-indigo-600">{`Progress: ${payload[0].value.toFixed(2)}%`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="progress" fill="#4f46e5" stackId="a" radius={[0, 8, 8, 0]} />
                  <Bar dataKey="remaining" fill="#e0e7ff" stackId="a" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <div key={goal._id} className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-2xl font-bold text-indigo-900 flex items-center mb-4">
                  <Award className="mr-2 text-indigo-600" />
                  {goal.name}
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <DollarSign className="mr-2 text-green-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Target</p>
                      <p className="font-semibold text-gray-900">${(goal.targetAmount ?? 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 text-blue-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Monthly</p>
                      <p className="font-semibold text-gray-900">${(goal.desiredMonthlyPayment ?? 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 text-purple-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Timeline</p>
                      <p className="font-semibold text-gray-900">{((goal.timePeriod ?? 0) / 12).toFixed(1)} years</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="mr-2 text-yellow-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Progress</p>
                      <p className="font-semibold text-gray-900">{Math.min(Math.round(((goal.progress ?? 0) / (goal.targetAmount ?? 1)) * 100), 100)}%</p>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-indigo-100 rounded-full h-3">
                  <div 
                    className="bg-indigo-600 h-3 rounded-full" 
                    style={{ width: `${Math.min(Math.round(((goal.progress ?? 0) / (goal.targetAmount ?? 1)) * 100), 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white p-12 rounded-lg shadow-md flex flex-col items-center justify-center">
          <Sparkles className="text-indigo-500 mb-4" size={48} />
          <p className="text-xl text-gray-700 text-center">You have no goals yet. Start setting some financial targets!</p>
        </div>
      )}
    </div>
  );
};

export default GoalTracker;