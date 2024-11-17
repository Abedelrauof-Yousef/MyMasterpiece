import React from "react";
import { ArrowUpCircle, ArrowDownCircle, Wallet, Target } from "lucide-react";
import CustomProgress from "../../CustomProgress";

// Custom Card Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-xl font-semibold">{children}</h2>
);

const DashboardView = ({
  netIncomesPerCategory,
  totalIncome,
  totalExpenses,
  totalBalance,
  goals,
}) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Income Sources */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="w-5 h-5 text-green-500" />
              Income Sources
            </div>
          </CardTitle>
        </CardHeader>
        <div className="space-y-2">
          {Object.keys(netIncomesPerCategory).map((source) => (
            <div key={source} className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">{source}</span>
              <span className="font-semibold">
                ${Number(netIncomesPerCategory[source]).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <ArrowUpCircle className="w-5 h-5 text-green-500" />
                Total Income
              </div>
            </CardTitle>
          </CardHeader>
          <p className="text-2xl font-bold">${Number(totalIncome).toFixed(2)}</p>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <ArrowDownCircle className="w-5 h-5 text-red-500" />
                Total Expenses
              </div>
            </CardTitle>
          </CardHeader>
          <p className="text-2xl font-bold">${Number(totalExpenses).toFixed(2)}</p>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-500" />
                Total Balance
              </div>
            </CardTitle>
          </CardHeader>
          <p className="text-2xl font-bold">${Number(totalBalance).toFixed(2)}</p>
        </Card>
      </div>

      {/* Goals Overview */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              Your Goals Overview
            </div>
          </CardTitle>
        </CardHeader>
        {goals.length > 0 ? (
          <div className="space-y-6">
            {goals.map((goal) => (
              <div key={goal.name} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{goal.name}</h3>
                  <span className="text-sm text-gray-500">
                    {Math.max(goal.timePeriod - (goal.monthsElapsed || 0), 0)} months remaining
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Target Amount</p>
                    <p className="font-semibold">${Number(goal.targetAmount).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Monthly Payment</p>
                    <p className="font-semibold">${Number(goal.desiredMonthlyPayment).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Time Period</p>
                    <p className="font-semibold">
                      {Number(goal.timePeriod / 12).toFixed(1)} years ({Number(goal.timePeriod)} months)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">You have no goals yet.</p>
        )}
      </Card>
    </div>
  );
};

export default DashboardView;