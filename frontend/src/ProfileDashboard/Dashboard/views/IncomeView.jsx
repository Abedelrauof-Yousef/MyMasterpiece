// src/components/Dashboard/views/IncomeView.jsx

import React from "react";

const IncomeView = ({
  newIncome,
  setNewIncome,
  addTransaction,
  incomeTransactions,
  deleteTransaction,
  error,
  successMessage,
}) => {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Add Income</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <input
          type="number"
          placeholder="Amount"
          value={newIncome.amount}
          onChange={(e) =>
            setNewIncome({ ...newIncome, amount: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded"
          min="0"
        />
        <input
          type="date"
          value={newIncome.date}
          onChange={(e) =>
            setNewIncome({ ...newIncome, date: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded"
        />
        <select
          value={newIncome.category}
          onChange={(e) =>
            setNewIncome({ ...newIncome, category: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="Salary">Salary</option>
          <option value="Freelance">Freelance</option>
          <option value="Other">Other</option>
        </select>
        {newIncome.category === "Other" && (
          <input
            type="text"
            placeholder="Enter custom category"
            value={newIncome.customCategory}
            onChange={(e) =>
              setNewIncome({
                ...newIncome,
                customCategory: e.target.value,
              })
            }
            className="w-full p-2 mb-4 border rounded"
          />
        )}
        <input
          type="text"
          placeholder="Description"
          value={newIncome.description}
          onChange={(e) =>
            setNewIncome({ ...newIncome, description: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={newIncome.isRecurring}
            onChange={(e) =>
              setNewIncome({
                ...newIncome,
                isRecurring: e.target.checked,
              })
            }
            className="mr-2"
          />
          <label>Is this a recurring income?</label>
        </div>
        {newIncome.isRecurring && (
          <div className="mb-4">
            <label className="block mb-2">
              Date of the month it repeats (1-31)
            </label>
            <input
              type="number"
              placeholder="Recurrence Date"
              value={newIncome.recurrenceDate}
              onChange={(e) =>
                setNewIncome({
                  ...newIncome,
                  recurrenceDate: e.target.value,
                })
              }
              className="w-full p-2 mb-4 border rounded"
              min="1"
              max="31"
            />
          </div>
        )}
        <button
          onClick={() => addTransaction("income")}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Add Income
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Your Incomes</h2>
        <div className="space-y-2">
          {incomeTransactions.length > 0 ? (
            incomeTransactions.map((t) => (
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
                </div>
                <div className="flex items-center">
                  <p className="text-green-500 mr-4">
                    +${Number(t.amount).toFixed(2)}
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
            <p className="text-gray-500">You have no income transactions.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default IncomeView;
