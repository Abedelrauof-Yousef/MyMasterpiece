// src/components/Dashboard/views/GoalsView.jsx

import React from "react";
import CustomProgress from "../../CustomProgress";

const GoalsView = ({
  newGoal,
  setNewGoal,
  addGoal,
  goals,
  deleteGoal,
  totalFixedSalary,
  totalFixedExpenses,
  existingGoalsMonthlyPayments,
  error,
  successMessage,
}) => {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Add Goal</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        {goals.length > 0 && (
          <div className="mb-4 p-4 border rounded bg-yellow-100">
            <p className="text-yellow-700">
              You have {goals.length} existing goal(s). The new goal will be
              added based on your available income after accounting for
              existing goals.
            </p>
          </div>
        )}
        <input
          type="text"
          placeholder="Goal Name"
          value={newGoal.name}
          onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="number"
          placeholder="Target Amount"
          value={newGoal.targetAmount}
          onChange={(e) =>
            setNewGoal({ ...newGoal, targetAmount: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded"
          min="0"
        />
        <input
          type="number"
          placeholder="Desired Monthly Payment"
          value={newGoal.desiredMonthlyPayment}
          onChange={(e) =>
            setNewGoal({
              ...newGoal,
              desiredMonthlyPayment: e.target.value,
            })
          }
          className="w-full p-2 mb-4 border rounded"
          min="0"
        />
        <p className="text-lg mb-4">
          Fixed Salary: ${Number(totalFixedSalary).toFixed(2)}
        </p>
        <p className="text-lg mb-4">
          Fixed Expenses: ${Number(totalFixedExpenses).toFixed(2)}
        </p>
        <p className="text-lg mb-4">
          Existing Goals Monthly Payments: $
          {Number(existingGoalsMonthlyPayments).toFixed(2)}
        </p>
        <button
          onClick={addGoal}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Goal
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Your Goals</h2>
        {goals.length > 0 ? (
          goals.map((goal) => (
            <div key={goal._id} className="mb-4 p-4 border rounded">
              <h3 className="font-semibold">{goal.name}</h3>
              <p>Target Amount: ${Number(goal.targetAmount).toFixed(2)}</p>
              <p>
                Desired Monthly Payment: $
                {Number(goal.desiredMonthlyPayment).toFixed(2)}
              </p>
              <p>
                Time Period: {Number(goal.timePeriod / 12).toFixed(1)} years (
                {Number(goal.timePeriod)} months)
              </p>
              <CustomProgress
                percent={Math.min(
                  Math.round(
                    ((goal.progress || 0) / (goal.targetAmount || 1)) * 100
                  ),
                  100
                )}
              />
              <p>
                Time Remaining:{" "}
                {Math.max(goal.timePeriod - (goal.monthsElapsed || 0), 0)}{" "}
                months
              </p>
              <button
                onClick={() => deleteGoal(goal._id)}
                className="text-red-500 hover:text-red-700 mt-2"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">You have no goals yet.</p>
        )}
      </div>
    </>
  );
};

export default GoalsView;
