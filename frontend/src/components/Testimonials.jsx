import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function FinancialCharts() {
  const data = [
    { month: 'Jan', savings: 400 },
    { month: 'Feb', savings: 450 },
    { month: 'Mar', savings: 500 },
    { month: 'Apr', savings: 550 },
    { month: 'May', savings: 600 },
    // Add more data points as needed
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-3xl font-semibold text-center mb-8">Your Savings Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default FinancialCharts;
