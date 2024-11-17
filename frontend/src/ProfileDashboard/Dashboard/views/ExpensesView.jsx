// src/components/Dashboard/views/ExpensesView.jsx

import React from "react";

const ExpensesView = ({
  newExpense,
  setNewExpense,
  addTransaction,
  expenseTransactions,
  deleteTransaction,
  availableIncome,
  availablePerCategory,
  incomeCategories,
  error,
  successMessage,
}) => {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Add Expense</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}
      {availableIncome > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <p className="text-lg mb-4">
            Available Income for Expenses:{" "}
            <span className="font-semibold">
              ${Number(availableIncome).toFixed(2)}
            </span>
          </p>
          <input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) =>
              setNewExpense({ ...newExpense, amount: e.target.value })
            }
            className="w-full p-2 mb-4 border rounded"
            min="0"
          />
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) =>
              setNewExpense({ ...newExpense, date: e.target.value })
            }
            className="w-full p-2 mb-4 border rounded"
          />
          <select
            value={newExpense.category}
            onChange={(e) =>
              setNewExpense({ ...newExpense, category: e.target.value })
            }
            className="w-full p-2 mb-4 border rounded"
          >
            <option value="Needs">Needs</option>
            <option value="Wants">Wants</option>
            <option value="Other">Other</option>
          </select>
          {newExpense.category === "Other" && (
            <input
              type="text"
              placeholder="Enter custom category"
              value={newExpense.customCategory}
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  customCategory: e.target.value,
                })
              }
              className="w-full p-2 mb-4 border rounded"
            />
          )}
          {/* Payment Method Dropdown */}
          <select
            value={newExpense.paymentMethod}
            onChange={(e) =>
              setNewExpense({
                ...newExpense,
                paymentMethod: e.target.value,
              })
            }
            className="w-full p-2 mb-4 border rounded"
          >
            <option value="">Select Payment Method</option>
            {/* Standard Income Categories */}
            <option
              value="Salary"
              disabled={availablePerCategory["Salary"] <= 0}
            >
              Salary{" "}
              {availablePerCategory["Salary"] > 0
                ? `(Available: $${Number(
                    availablePerCategory["Salary"]
                  ).toFixed(2)})`
                : "(No funds available)"}
            </option>
            <option
              value="Freelance"
              disabled={availablePerCategory["Freelance"] <= 0}
            >
              Freelance{" "}
              {availablePerCategory["Freelance"] > 0
                ? `(Available: $${Number(
                    availablePerCategory["Freelance"]
                  ).toFixed(2)})`
                : "(No funds available)"}
            </option>
            {/* Dynamically add other income categories */}
            {incomeCategories
              .filter(
                (category) => category !== "Salary" && category !== "Freelance"
              )
              .map((category) => (
                <option
                  key={category}
                  value={category}
                  disabled={(availablePerCategory[category] ?? 0) <= 0}
                >
                  {category}{" "}
                  {(availablePerCategory[category] ?? 0) > 0
                    ? `(Available: $${Number(
                        availablePerCategory[category]
                      ).toFixed(2)})`
                    : "(No funds available)"}
                </option>
              ))}
          </select>
          <input
            type="text"
            placeholder="Description"
            value={newExpense.description}
            onChange={(e) =>
              setNewExpense({
                ...newExpense,
                description: e.target.value,
              })
            }
            className="w-full p-2 mb-4 border rounded"
          />
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={newExpense.isRecurring}
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  isRecurring: e.target.checked,
                })
              }
              className="mr-2"
            />
            <label>Is this a recurring expense?</label>
          </div>
          {newExpense.isRecurring && (
            <div className="mb-4">
              <label className="block mb-2">
                Date of the month it repeats (1-31)
              </label>
              <input
                type="number"
                placeholder="Recurrence Date"
                value={newExpense.recurrenceDate}
                onChange={(e) =>
                  setNewExpense({
                    ...newExpense,
                    recurrenceDate: e.target.value,
                  })
                }
                className="w-full p-2 mb-4 border rounded"
                min="1"
                max="31"
              />
            </div>
          )}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={newExpense.isFixed}
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  isFixed: e.target.checked,
                })
              }
              className="mr-2"
            />
            <label>
              Is this a fixed monthly expense (e.g., food, bills)?
            </label>
          </div>
          <button
            onClick={() => addTransaction("expense")}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Add Expense
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <p className="text-red-500 mb-4">
            You have reached your income limit. Please add more income or
            reduce your existing expenses to add new expenses.
          </p>
          <button
            onClick={() => setActiveView("income")}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 mr-4"
          >
            Add More Income
          </button>
          <button
            onClick={() => setActiveView("expenses")}
            className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
          >
            Manage Existing Expenses
          </button>
        </div>
      )}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Your Expenses</h2>
        <div className="space-y-2">
          {expenseTransactions.length > 0 ? (
            expenseTransactions.map((t) => (
              <div
                key={t._id}
                className="flex justify-between items-center p-2 border rounded"
              >
                <div>
                  <p className="font-semibold">{t.description}</p>
                  <p className="text-sm text-gray-500">
                    {t.date
                      ? new Date(t.date).toLocaleDateString()
                      : "No Date"}
                  </p>
                  {t.isRecurring && (
                    <p className="text-sm text-blue-500">
                      Recurs on day {t.recurrenceDate} each month
                    </p>
                  )}
                  {t.isFixed && (
                    <p className="text-sm text-green-500">Fixed Expense</p>
                  )}
                  {t.paymentMethod && (
                    <p className="text-sm text-purple-500">
                      Paid from: {t.paymentMethod}
                    </p>
                  )}
                </div>
                <div className="flex items-center">
                  <p className="text-red-500 mr-4">
                    -${Number(t.amount).toFixed(2)}
                  </p>
                  <button
                    onClick={() => deleteTransaction(t._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">You have no expense transactions.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ExpensesView;
