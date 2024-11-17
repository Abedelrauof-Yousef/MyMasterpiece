// src/components/Dashboard/views/TransactionsView.jsx

import React from "react";

const TransactionsView = ({ transactions, deleteTransaction }) => {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">View Transactions</h1>
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {t.date
                      ? new Date(t.date).toLocaleDateString()
                      : "No Date"}
                  </td>
                  <td
                    className={`px-4 py-2 whitespace-nowrap text-sm ${
                      t.type === "income"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {t.category}
                  </td>
                  <td className="px-4 py-2 whitespace-normal text-sm text-gray-700 break-words">
                    {t.description}
                  </td>
                  <td
                    className={`px-4 py-2 whitespace-nowrap text-sm text-right ${
                      t.type === "income"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}$
                    {Number(t.amount).toFixed(2)}
                    {t.isRecurring && (
                      <span className="ml-2 text-xs text-blue-500">
                        (Recurring on {t.recurrenceDate})
                      </span>
                    )}
                  </td>
                  {/* Display Payment Method for Expenses */}
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                    {t.paymentMethod || "N/A"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                    <button
                      onClick={() => deleteTransaction(t._id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-4 text-center text-gray-500"
                >
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TransactionsView;
