// src/components/Dashboard.jsx

import React, { useState, useEffect, useMemo } from "react";
import {
  User,
  LayoutDashboard,
  FileText,
  DollarSign,
  PieChart,
  LogOut,
  Target,
} from "lucide-react";
import CustomProgress from "../components/CustomProgress"; // Adjust the import path as needed

const Dashboard = () => {
  // State Management
  const [activeView, setActiveView] = useState("dashboard");
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // States for adding income
  const [newIncome, setNewIncome] = useState({
    amount: "",
    description: "",
    category: "Salary",
    customCategory: "",
    isRecurring: false,
    recurrenceDate: "",
    date: "",
  });

  // States for adding expense
  const [newExpense, setNewExpense] = useState({
    amount: "",
    description: "",
    category: "Needs",
    customCategory: "",
    isRecurring: false,
    isFixed: false,
    recurrenceDate: "",
    date: "",
    paymentMethod: "",
  });

  // States for adding goal
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    desiredMonthlyPayment: "",
  });

  // Fetch Transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/transactions", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch transactions: ${res.status}`);
        }

        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error("Error fetching transactions:", err.message);
        setError("Failed to load transactions.");
      }
    };

    fetchTransactions();
  }, []);

  // Fetch Goals
  useEffect(() => {
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
  }, []);

  // Calculate existing goals' total monthly payments
  const existingGoalsMonthlyPayments = useMemo(() => {
    return goals.reduce(
      (sum, goal) => sum + (goal.desiredMonthlyPayment || 0),
      0
    );
  }, [goals]);

  // Calculate total fixed salaries and fixed expenses
  const totalFixedSalary = useMemo(() => {
    return transactions
      .filter((t) => t.type === "income" && t.isRecurring)
      .reduce((sum, t) => sum + (t.amount ?? 0), 0);
  }, [transactions]);

  const totalFixedExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense" && t.isFixed)
      .reduce((sum, t) => sum + (t.amount ?? 0), 0);
  }, [transactions]);

  // Calculate total income and expenses
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + (t.amount ?? 0), 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + (t.amount ?? 0), 0);
  }, [transactions]);

  // Calculate available income
  const availableIncome = useMemo(() => {
    return totalIncome - totalExpenses - existingGoalsMonthlyPayments;
  }, [totalIncome, totalExpenses, existingGoalsMonthlyPayments]);

  // Helper function to get unique income categories
  const getIncomeCategories = () => {
    const categories = transactions
      .filter((t) => t.type === "income")
      .map((t) => t.category || "Other");
    return [...new Set(categories)];
  };

  const incomeCategories = useMemo(getIncomeCategories, [transactions]);

  // Helper function to calculate available balance per income category
  const calculateAvailablePerCategory = () => {
    const incomePerCategory = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => {
        const category = t.category || "Other";
        acc[category] = (acc[category] || 0) + (t.amount ?? 0);
        return acc;
      }, {});

    const expensePerCategory = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        const paymentMethod = t.paymentMethod || "Other";
        acc[paymentMethod] = (acc[paymentMethod] || 0) + (t.amount ?? 0);
        return acc;
      }, {});

    const availablePerCategory = {};

    for (let category in incomePerCategory) {
      let totalDeductions = expensePerCategory[category] || 0;
      // For 'Salary', subtract goals as well
      if (category === "Salary") {
        totalDeductions += existingGoalsMonthlyPayments;
      }
      availablePerCategory[category] =
        incomePerCategory[category] - totalDeductions;
    }

    return availablePerCategory;
  };

  const availablePerCategory = useMemo(
    () => calculateAvailablePerCategory(),
    [transactions, existingGoalsMonthlyPayments]
  );

  // Debugging: Log availablePerCategory
  useEffect(() => {
    console.log("Available Per Category:", availablePerCategory);
  }, [availablePerCategory]);

  // Add Transaction (Income or Expense)
  const addTransaction = async (type) => {
    const transaction = type === "income" ? newIncome : newExpense;

    // Validation
    if (transaction.amount === "" || transaction.description === "") {
      setError("Please provide both amount and description.");
      setSuccessMessage(null);
      return;
    }

    const amount = parseFloat(transaction.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid positive number for amount.");
      setSuccessMessage(null);
      return;
    }

    if (type === "expense") {
      // Check overall available income
      if (amount > availableIncome) {
        setError(
          `Cannot add expense of $${amount.toFixed(
            2
          )}. Available income after fixed salaries and existing goals is $${availableIncome.toFixed(
            2
          )}. Please add more income or reduce other expenses.`
        );
        setSuccessMessage(null);
        return;
      }

      // Check selected payment method's available balance
      const selectedMethod = transaction.paymentMethod;
      if (!selectedMethod) {
        setError("Please select a payment method.");
        setSuccessMessage(null);
        return;
      }

      const availableForMethod = availablePerCategory[selectedMethod] ?? 0;
      if (availableForMethod <= 0) {
        setError(
          `Cannot add expense from "${selectedMethod}". No funds available in this payment method.`
        );
        setSuccessMessage(null);
        return;
      }

      if (amount > availableForMethod) {
        setError(
          `Cannot add expense of $${amount.toFixed(
            2
          )} from "${selectedMethod}". Available balance for this method is $${availableForMethod.toFixed(
            2
          )}. Please choose a different payment method or reduce the expense amount.`
        );
        setSuccessMessage(null);
        return;
      }
    }

    if (transaction.isRecurring) {
      const day = parseInt(transaction.recurrenceDate, 10);
      if (isNaN(day) || day < 1 || day > 31) {
        setError("Recurrence Date must be a number between 1 and 31.");
        setSuccessMessage(null);
        return;
      }
    }

    try {
      const res = await fetch("http://localhost:5001/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          type,
          amount: parseFloat(transaction.amount),
          description: transaction.description,
          category:
            transaction.category === "Other"
              ? transaction.customCategory
              : transaction.category,
          isRecurring: transaction.isRecurring,
          isFixed: type === "expense" ? transaction.isFixed : undefined,
          date: transaction.date ? new Date(transaction.date) : undefined,
          recurrenceDate: transaction.isRecurring
            ? parseInt(transaction.recurrenceDate, 10)
            : undefined,
          paymentMethod:
            type === "expense" ? transaction.paymentMethod : undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.msg || `Failed to add transaction: ${res.status}`
        );
      }

      const newTransaction = await res.json();
      setTransactions([...transactions, newTransaction]);

      // Reset Form
      if (type === "income") {
        setNewIncome({
          amount: "",
          description: "",
          category: "Salary",
          customCategory: "",
          isRecurring: false,
          recurrenceDate: "",
          date: "",
        });
      } else {
        setNewExpense({
          amount: "",
          description: "",
          category: "Needs",
          customCategory: "",
          isRecurring: false,
          isFixed: false,
          recurrenceDate: "",
          date: "",
          paymentMethod: "",
        });
      }

      setSuccessMessage("Transaction added successfully!");
      setError(null);
    } catch (err) {
      console.error("Error adding transaction:", err.message);
      setError(err.message);
      setSuccessMessage(null);
    }
  };

  // Delete Transaction
  const deleteTransaction = async (id) => {
    if (!id) {
      console.error("Transaction ID is undefined");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/transactions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete transaction: ${res.status}`);
      }

      setTransactions(transactions.filter((t) => t._id !== id));
      setSuccessMessage("Transaction deleted successfully!");
      setError(null);
    } catch (err) {
      console.error("Error deleting transaction:", err.message);
      setError(err.message);
      setSuccessMessage(null);
    }
  };

  // Add Goal
  const addGoal = async () => {
    // Validation
    if (
      !newGoal.name ||
      !newGoal.targetAmount ||
      !newGoal.desiredMonthlyPayment
    ) {
      setError("All fields are required.");
      setSuccessMessage(null);
      return;
    }

    const targetAmount = parseFloat(newGoal.targetAmount);
    const desiredMonthlyPayment = parseFloat(newGoal.desiredMonthlyPayment);

    if (isNaN(targetAmount) || targetAmount <= 0) {
      setError("Target Amount must be a positive number.");
      setSuccessMessage(null);
      return;
    }

    if (isNaN(desiredMonthlyPayment) || desiredMonthlyPayment <= 0) {
      setError("Desired Monthly Payment must be a positive number.");
      setSuccessMessage(null);
      return;
    }

    // Calculate timePeriodMonths
    const timePeriodMonths = Math.ceil(targetAmount / desiredMonthlyPayment);

    // Available salary income for new goals
    const salaryIncome = transactions
      .filter((t) => t.type === "income" && t.category === "Salary")
      .reduce((sum, t) => sum + (t.amount ?? 0), 0);

    const salaryExpenses = transactions
      .filter((t) => t.type === "expense" && t.paymentMethod === "Salary")
      .reduce((sum, t) => sum + (t.amount ?? 0), 0);

    const availableSalaryIncome =
      salaryIncome - salaryExpenses - existingGoalsMonthlyPayments;

    if (desiredMonthlyPayment > availableSalaryIncome) {
      setError(
        `Desired monthly payment of $${desiredMonthlyPayment.toFixed(
          2
        )} exceeds available salary income of $${availableSalaryIncome.toFixed(
          2
        )}. Please increase your salary income, decrease the monthly payment, or reduce your expenses.`
      );
      setSuccessMessage(null);
      return;
    }

    // Check if desired monthly payment over the time period meets the target amount
    const totalSavings = desiredMonthlyPayment * timePeriodMonths;

    if (totalSavings < targetAmount) {
      setError(
        `With a monthly payment of $${desiredMonthlyPayment.toFixed(
          2
        )} over ${timePeriodMonths} months, you will save $${totalSavings.toFixed(
          2
        )}, which is less than the target amount of $${targetAmount.toFixed(
          2
        )}. Please increase your monthly payment or adjust your target amount.`
      );
      setSuccessMessage(null);
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: newGoal.name,
          targetAmount: targetAmount,
          desiredMonthlyPayment: desiredMonthlyPayment,
          timePeriod: timePeriodMonths,
        }),
      });

      if (!res.ok) {
        let errorMessage = `Error adding goal: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.msg || errorMessage;
        } catch (jsonError) {
          // If response is not JSON
        }
        throw new Error(errorMessage);
      }

      const addedGoal = await res.json();
      setGoals([...goals, addedGoal]);
      setNewGoal({
        name: "",
        targetAmount: "",
        desiredMonthlyPayment: "",
      });
      setSuccessMessage(
        `Goal "${addedGoal.name}" added successfully! You will achieve it in ${(
          addedGoal.timePeriod / 12
        ).toFixed(1)} years (${addedGoal.timePeriod} months) with a monthly payment of $${addedGoal.desiredMonthlyPayment.toFixed(
          2
        )}.`
      );
      setError(null);
    } catch (err) {
      console.error("Error adding goal:", err.message);
      setError(err.message);
      setSuccessMessage(null);
    }
  };

  // Delete Goal
  const deleteGoal = async (id) => {
    if (!id) {
      console.error("Goal ID is undefined");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/goals/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete goal: ${res.status}`);
      }

      setGoals(goals.filter((goal) => goal._id !== id));
      setSuccessMessage("Goal deleted successfully!");
      setError(null);
    } catch (err) {
      console.error("Error deleting goal:", err.message);
      setError(err.message);
      setSuccessMessage(null);
    }
  };

  // Group transactions by income sources and calculate net incomes after deductions
  const netIncomesPerCategory = useMemo(() => {
    const incomePerCategory = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => {
        const category = t.category || "Other";
        acc[category] = (acc[category] || 0) + (t.amount ?? 0);
        return acc;
      }, {});

    const expensePerCategory = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        const paymentMethod = t.paymentMethod || "Other";
        acc[paymentMethod] = (acc[paymentMethod] || 0) + (t.amount ?? 0);
        return acc;
      }, {});

    const netIncomesPerCategory = {};

    for (let category in incomePerCategory) {
      let totalDeductions = expensePerCategory[category] || 0;
      if (category === "Salary") {
        totalDeductions += existingGoalsMonthlyPayments;
      }
      netIncomesPerCategory[category] =
        incomePerCategory[category] - totalDeductions;
    }

    return netIncomesPerCategory;
  }, [transactions, existingGoalsMonthlyPayments]);

  const totalBalance = useMemo(() => {
    const income = isNaN(totalIncome) ? 0 : totalIncome;
    const expenses = isNaN(totalExpenses) ? 0 : totalExpenses;
    return income - expenses;
  }, [totalIncome, totalExpenses]);

  // Render Views
  const renderView = () => {
    const incomeTransactions = transactions.filter((t) => t.type === "income");
    const expenseTransactions = transactions.filter((t) => t.type === "expense");

    switch (activeView) {
      case "dashboard":
        return (
          <>
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold">Income Sources</h2>
              {Object.keys(netIncomesPerCategory).map((source) => (
                <div key={source}>
                  <p className="text-lg">
                    {source}: ${(netIncomesPerCategory[source] ?? 0).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-2">Total Income</h2>
                <p className="text-3xl font-bold text-green-500">
                  ${(totalIncome ?? 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-2">Total Expenses</h2>
                <p className="text-3xl font-bold text-red-500">
                  ${(totalExpenses ?? 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-2">Total Balance</h2>
                <p className="text-3xl font-bold text-blue-500">
                  ${(totalBalance ?? 0).toFixed(2)}
                </p>
              </div>
            </div>
            {/* Goals Overview */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">Your Goals Overview</h2>
              {goals.length > 0 ? (
                goals.map((goal) => (
                  <div key={goal._id} className="mb-4">
                    <h3 className="font-semibold">{goal.name}</h3>
                    <p>Target Amount: ${(goal.targetAmount ?? 0).toFixed(2)}</p>
                    <p>
                      Desired Monthly Payment: $
                      {(goal.desiredMonthlyPayment ?? 0).toFixed(2)}
                    </p>
                    <p>
                      Time Period: {((goal.timePeriod ?? 0) / 12).toFixed(1)} years (
                      {(goal.timePeriod ?? 0)} months)
                    </p>
                    <CustomProgress
                      percent={Math.min(
                        Math.round(((goal.progress ?? 0) / (goal.targetAmount ?? 1)) * 100),
                        100
                      )}
                    />
                    <p>
                      Time to Achieve: {Math.max(goal.timePeriod - (goal.monthsElapsed || 0), 0)}{" "}
                      months
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">You have no goals yet.</p>
              )}
            </div>
          </>
        );

      case "income":
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
                          +${(t.amount ?? 0).toFixed(2)}
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
                  <p className="text-gray-500">
                    You have no income transactions.
                  </p>
                )}
              </div>
            </div>
          </>
        );

      case "expenses":
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
                    ${(availableIncome ?? 0).toFixed(2)}
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
                      ? `(Available: $${availablePerCategory["Salary"].toFixed(
                          2
                        )})`
                      : "(No funds available)"}
                  </option>
                  <option
                    value="Freelance"
                    disabled={availablePerCategory["Freelance"] <= 0}
                  >
                    Freelance{" "}
                    {availablePerCategory["Freelance"] > 0
                      ? `(Available: $${availablePerCategory["Freelance"].toFixed(
                          2
                        )})`
                      : "(No funds available)"}
                  </option>
                  {/* Dynamically add other income categories */}
                  {incomeCategories
                    .filter(
                      (category) =>
                        category !== "Salary" && category !== "Freelance"
                    )
                    .map((category) => (
                      <option
                        key={category}
                        value={category}
                        disabled={(availablePerCategory[category] ?? 0) <= 0}
                      >
                        {category}{" "}
                        {(availablePerCategory[category] ?? 0) > 0
                          ? `(Available: $${availablePerCategory[
                              category
                            ].toFixed(2)})`
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
                          <p className="text-sm text-green-500">
                            Fixed Expense
                          </p>
                        )}
                        {t.paymentMethod && (
                          <p className="text-sm text-purple-500">
                            Paid from: {t.paymentMethod}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center">
                        <p className="text-red-500 mr-4">
                          -${(t.amount ?? 0).toFixed(2)}
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
                  <p className="text-gray-500">
                    You have no expense transactions.
                  </p>
                )}
              </div>
            </div>
          </>
        );

      case "goals":
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
                    You have {goals.length} existing goal(s). The new goal will
                    be added based on your available income after accounting for
                    existing goals.
                  </p>
                </div>
              )}
              <input
                type="text"
                placeholder="Goal Name"
                value={newGoal.name}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, name: e.target.value })
                }
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
                Fixed Salary: ${(totalFixedSalary ?? 0).toFixed(2)}
              </p>
              <p className="text-lg mb-4">
                Fixed Expenses: ${(totalFixedExpenses ?? 0).toFixed(2)}
              </p>
              <p className="text-lg mb-4">
                Existing Goals Monthly Payments: $
                {(existingGoalsMonthlyPayments ?? 0).toFixed(2)}
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
                    <p>Target Amount: ${(goal.targetAmount ?? 0).toFixed(2)}</p>
                    <p>
                      Desired Monthly Payment: $
                      {(goal.desiredMonthlyPayment ?? 0).toFixed(2)}
                    </p>
                    <p>
                      Time Period: {((goal.timePeriod ?? 0) / 12).toFixed(1)} years (
                      {(goal.timePeriod ?? 0)} months)
                    </p>
                    <CustomProgress
                      percent={Math.min(
                        Math.round(((goal.progress ?? 0) / (goal.targetAmount ?? 1)) * 100),
                        100
                      )}
                    />
                    <p>
                      Time Remaining:{" "}
                      {Math.max(goal.timePeriod - (goal.monthsElapsed || 0), 0)} months
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

      case "transactions":
        return (
          <>
            <h1 className="text-2xl font-semibold mb-6">View Transactions</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left px-4 py-2">Date</th>
                    <th className="text-left px-4 py-2">Type</th>
                    <th className="text-left px-4 py-2">Category</th>
                    <th className="text-left px-4 py-2">Description</th>
                    <th className="text-right px-4 py-2">Amount</th>
                    <th className="text-right px-4 py-2">Payment Method</th>
                    <th className="text-right px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((t) => (
                      <tr key={t._id} className="border-t">
                        <td className="px-4 py-2">
                          {t.date
                            ? new Date(t.date).toLocaleDateString()
                            : "No Date"}
                        </td>
                        <td
                          className={`px-4 py-2 ${
                            t.type === "income"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                        </td>
                        <td className="px-4 py-2">{t.category}</td>
                        <td className="px-4 py-2">{t.description}</td>
                        <td
                          className={`px-4 py-2 text-right ${
                            t.type === "income"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {t.type === "income" ? "+" : "-"}$
                          {(t.amount ?? 0).toFixed(2)}
                          {t.isRecurring && (
                            <span className="ml-2 text-xs text-blue-500">
                              (Recurring on {t.recurrenceDate})
                            </span>
                          )}
                        </td>
                        {/* Display Payment Method for Expenses */}
                        {t.type === "expense" && (
                          <td className="px-4 py-2 text-right">
                            {t.paymentMethod || "N/A"}
                          </td>
                        )}
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => deleteTransaction(t._id)}
                            className="text-red-500 hover:text-red-700"
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
                        className="text-center text-gray-500 p-4"
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

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md relative">
        <div className="p-4 flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="text-blue-500" />
          </div>
          <div>
            <h2 className="font-semibold">Mike</h2>
            <p className="text-sm text-gray-500">Your Money</p>
          </div>
        </div>
        <nav className="mt-8">
          <button
            onClick={() => setActiveView("dashboard")}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "dashboard"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200`}
          >
            <LayoutDashboard className="mr-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveView("income")}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "income"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200`}
          >
            <DollarSign className="mr-4" />
            Add Income
          </button>
          <button
            onClick={() => setActiveView("expenses")}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "expenses"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200`}
          >
            <PieChart className="mr-4" />
            Add Expenses
          </button>
          <button
            onClick={() => setActiveView("goals")}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "goals"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200`}
          >
            <Target className="mr-4" />
            Add Goal
          </button>
          <button
            onClick={() => setActiveView("transactions")}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "transactions"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200`}
          >
            <FileText className="mr-4" />
            View Transactions
          </button>
        </nav>
        <div className="absolute bottom-4 left-4">
          <button className="flex items-center text-gray-700 hover:text-red-500">
            <LogOut className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">{renderView()}</div>
    </div>
  );
};

export default Dashboard;
