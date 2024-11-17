import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from 'recharts';
import { 
  Circle,
  DollarSign, 
  Calendar, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';

const GoalTracker = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);

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
        setSelectedGoal(data[0]?._id);
      } catch (err) {
        console.error("Error fetching goals:", err.message);
        setError("Failed to load goals.");
      }
    };

    fetchGoals();
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  // Colors matching the "Why Choose Us" section
  const COLORS = ['#1E88E5', '#42A5F5', '#90CAF9', '#BBDEFB'];

  const pieData = goals.map((goal) => ({
    name: goal.name,
    value: goal.targetAmount,
    progress: (goal.progress / goal.targetAmount) * 100,
  }));

  const selectedGoalData = goals.find((g) => g._id === selectedGoal);
  const monthlyData = selectedGoalData
    ? [
        { month: "Current", amount: selectedGoalData.progress },
        { month: "Target", amount: selectedGoalData.targetAmount },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 flex items-center bg-red-50 px-4 py-3 rounded-lg">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {goals.length > 0 ? (
          <div className="space-y-6">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-600 mb-4">Total Portfolio Value</h3>
                <p className="text-3xl font-semibold text-blue-800">
                  ${goals.reduce((sum, goal) => sum + (goal.targetAmount ?? 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-600 mb-4">Average Completion</h3>
                <p className="text-3xl font-semibold text-blue-800">
                  {Math.round(
                    goals.reduce(
                      (sum, goal) =>
                        sum + ((goal.progress ?? 0) / (goal.targetAmount ?? 1)) * 100,
                      0
                    ) / goals.length
                  )}
                  %
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-600 mb-4">Monthly Investment</h3>
                <p className="text-3xl font-semibold text-blue-800">
                  ${goals.reduce((sum, goal) => sum + (goal.desiredMonthlyPayment ?? 0), 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribution Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-medium text-blue-800 mb-6">Goals Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ payload }) => {
                          if (payload && payload.length) {
                            return (
                              <div className="bg-white p-3 shadow-lg rounded-lg">
                                <p className="font-medium text-blue-800">{payload[0].name}</p>
                                <p className="text-gray-600">${payload[0].value.toLocaleString()}</p>
                                <p className="text-gray-500">Progress: {payload[0].payload.progress.toFixed(1)}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Progress Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-medium text-blue-800 mb-6">Selected Goal Progress</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#42A5F5"
                        strokeWidth={2}
                        dot={{ fill: "#42A5F5", strokeWidth: 2 }}
                      />
                      <Tooltip
                        content={({ payload }) => {
                          if (payload && payload.length) {
                            return (
                              <div className="bg-white p-3 shadow-lg rounded-lg">
                                <p className="font-medium text-blue-800">{payload[0].payload.month}</p>
                                <p className="text-gray-600">${payload[0].value.toLocaleString()}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Goals List */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="grid divide-y divide-gray-200">
                {goals.map((goal, index) => (
                  <div
                    key={goal._id}
                    className={`p-6 cursor-pointer transition-colors ${
                      selectedGoal === goal._id ? "bg-gray-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedGoal(goal._id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Circle
                          className="fill-current"
                          size={12}
                          color={COLORS[index % COLORS.length]}
                        />
                        <h4 className="text-lg font-medium text-blue-800">{goal.name}</h4>
                      </div>
                      <ChevronRight
                        size={20}
                        className={`text-gray-400 transition-transform ${
                          selectedGoal === goal._id ? "rotate-90" : ""
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="text-gray-400" size={18} />
                        <div>
                          <p className="text-sm text-gray-500">Target Amount</p>
                          <p className="font-medium text-blue-800">
                            ${(goal.targetAmount ?? 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="text-gray-400" size={18} />
                        <div>
                          <p className="text-sm text-gray-500">Timeline</p>
                          <p className="font-medium text-blue-800">
                            {((goal.timePeriod ?? 0) / 12).toFixed(1)} years
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <DollarSign className="text-gray-400" size={18} />
                        <div>
                          <p className="text-sm text-gray-500">Monthly Payment</p>
                          <p className="font-medium text-blue-800">
                            ${(goal.desiredMonthlyPayment ?? 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full bg-blue-100 text-blue-600">
                            Progress
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-blue-600">
                            {Math.min(
                              Math.round(((goal.progress ?? 0) / (goal.targetAmount ?? 1)) * 100),
                              100
                            )}
                            %
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                        <div
                          style={{
                            width: `${Math.min(
                              Math.round(((goal.progress ?? 0) / (goal.targetAmount ?? 1)) * 100),
                              100
                            )}%`,
                          }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <p className="text-blue-800 mb-4">No financial goals have been set yet.</p>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Create Your First Goal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalTracker;
