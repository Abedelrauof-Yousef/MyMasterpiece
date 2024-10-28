// src/components/Dashboard.jsx

import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  User,
  LayoutDashboard,
  FileText,
  DollarSign,
  PieChart,
  LogOut,
  Target,
  Settings,
} from "lucide-react";
import CustomProgress from "../components/CustomProgress"; // Adjust the import path as needed
import { AuthContext } from "../context/authContext"; // Import AuthContext
import { PayPalButtons } from "@paypal/react-paypal-js"; // Import PayPalButtons

const Dashboard = () => {
  const { isAuthenticated, isLoading: authLoading } = useContext(AuthContext);

  // Subscription and User States
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

  const [user, setUser] = useState(null);
  const [userError, setUserError] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // UI States
  const [activeView, setActiveView] = useState("dashboard");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Transaction and Goal States
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);

  // Form States
  const [newIncome, setNewIncome] = useState({
    amount: "",
    description: "",
    category: "Salary",
    customCategory: "",
    isRecurring: false,
    recurrenceDate: "",
    date: "",
  });

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

  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    desiredMonthlyPayment: "",
  });

  // Settings State
  const [settingsData, setSettingsData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });

  // Timer States
  const [trialTimeRemaining, setTrialTimeRemaining] = useState(null);
  const [nextPaymentTimeRemaining, setNextPaymentTimeRemaining] = useState(null);

  // Fetch User Data and Subscription Status
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/users/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch user: ${res.status}`);
        }

        const data = await res.json();
        setUser(data);
        setUserLoading(false);

        // Initialize settings data
        setSettingsData((prevData) => ({
          ...prevData,
          username: data.username || "",
        }));

        // Set subscription status
        setSubscriptionStatus(data.subscriptionStatus);
        setIsLoadingSubscription(false);
      } catch (err) {
        console.error("Error fetching user:", err.message);
        setUserError("Failed to load user data.");
        setUserLoading(false);
        setIsLoadingSubscription(false);
      }
    };

    fetchUser();
  }, []);

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
          )} from "${selectedMethod}". Available balance for this payment method is $${availableForMethod.toFixed(
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

  // Handle Settings Submit
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (settingsData.password !== settingsData.confirmPassword) {
      setError("Passwords do not match.");
      setSuccessMessage(null);
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("username", settingsData.username);
    if (settingsData.password) {
      formData.append("password", settingsData.password);
    }
    if (settingsData.profilePicture) {
      formData.append("profilePicture", settingsData.profilePicture);
    }

    try {
      const res = await fetch("http://localhost:5001/api/users/update", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        let errorMessage = `Failed to update settings: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.msg || errorMessage;
        } catch (jsonError) {
          // If response is not JSON
        }
        throw new Error(errorMessage);
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      setSuccessMessage("Settings updated successfully!");
      setError(null);
      // Reset password fields
      setSettingsData((prevData) => ({
        ...prevData,
        password: "",
        confirmPassword: "",
        profilePicture: null,
      }));
    } catch (err) {
      console.error("Error updating settings:", err.message);
      setError(err.message);
      setSuccessMessage(null);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/users/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to logout: ${res.status}`);
      }

      // Redirect to sign-in page
      window.location.href = "/signin";
    } catch (err) {
      console.error("Error logging out:", err.message);
      setError("Failed to logout.");
      setSuccessMessage(null);
    }
  };

  // Render Views
  const renderView = () => {
    const incomeTransactions = transactions.filter((t) => t.type === "income");
    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense"
    );

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
                    {source}: $
                    {Number(netIncomesPerCategory[source]).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-2">Total Income</h2>
                <p className="text-3xl font-bold text-green-500">
                  ${Number(totalIncome).toFixed(2)}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-2">Total Expenses</h2>
                <p className="text-3xl font-bold text-red-500">
                  ${Number(totalExpenses).toFixed(2)}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-2">Total Balance</h2>
                <p className="text-3xl font-bold text-blue-500">
                  ${Number(totalBalance).toFixed(2)}
                </p>
              </div>
            </div>
            {/* Goals Overview */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Your Goals Overview
              </h2>
              {goals.length > 0 ? (
                goals.map((goal) => (
                  <div key={goal._id} className="mb-4">
                    <h3 className="font-semibold">{goal.name}</h3>
                    <p>
                      Target Amount: ${Number(goal.targetAmount).toFixed(2)}
                    </p>
                    <p>
                      Desired Monthly Payment: $
                      {Number(goal.desiredMonthlyPayment).toFixed(2)}
                    </p>
                    <p>
                      Time Period: {Number(goal.timePeriod / 12).toFixed(1)}{" "}
                      years ({Number(goal.timePeriod)} months)
                    </p>
                    <CustomProgress
                      percent={Math.min(
                        Math.round(
                          ((goal.progress || 0) / (goal.targetAmount || 1)) *
                            100
                        ),
                        100
                      )}
                    />
                    <p>
                      Time to Achieve:{" "}
                      {Math.max(goal.timePeriod - (goal.monthsElapsed || 0), 0)}{" "}
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
                    <p>
                      Target Amount: ${Number(goal.targetAmount).toFixed(2)}
                    </p>
                    <p>
                      Desired Monthly Payment: $
                      {Number(goal.desiredMonthlyPayment).toFixed(2)}
                    </p>
                    <p>
                      Time Period: {Number(goal.timePeriod / 12).toFixed(1)}{" "}
                      years ({Number(goal.timePeriod)} months)
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
                          {Number(t.amount).toFixed(2)}
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
                      <td colSpan="7" className="text-center text-gray-500 p-4">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        );

      case "settings":
        return (
          <>
            <h1 className="text-2xl font-semibold mb-6">Settings</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {successMessage && (
              <p className="text-green-500 mb-4">{successMessage}</p>
            )}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <form onSubmit={handleSettingsSubmit}>
                {/* Username */}
                <div className="mb-4">
                  <label className="block mb-2">Username</label>
                  <input
                    type="text"
                    value={settingsData.username}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        username: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                {/* Password */}
                <div className="mb-4">
                  <label className="block mb-2">New Password</label>
                  <input
                    type="password"
                    value={settingsData.password}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        password: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                {/* Confirm Password */}
                <div className="mb-4">
                  <label className="block mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={settingsData.confirmPassword}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Leave blank if not changing password"
                  />
                </div>
                {/* Profile Picture */}
                <div className="mb-4">
                  <label className="block mb-2">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        profilePicture: e.target.files[0],
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                {/* Current Profile Picture */}
                {user && user.profilePicture && (
                  <div className="mb-4">
                    <p className="mb-2">Current Profile Picture:</p>
                    <img
                      src={`http://localhost:5001${user.profilePicture}`}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                )}
                {/* Submit Button */}
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </form>
            </div>
            {/* Subscription Information and PayPal Button */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Subscription Details</h2>
              <p className="mb-2">
                <span className="font-semibold">Status:</span>{" "}
                {subscriptionStatus === "active"
                  ? "Active"
                  : subscriptionStatus === "trial"
                  ? "Trial"
                  : "Inactive"}
              </p>
              {/* Trial Timer */}
              {subscriptionStatus === "trial" && trialTimeRemaining && (
                <p className="mb-4">
                  <span className="font-semibold">Trial Time Remaining:</span>{" "}
                  {trialTimeRemaining.days}d {trialTimeRemaining.hours}h{" "}
                  {trialTimeRemaining.minutes}m {trialTimeRemaining.seconds}s
                </p>
              )}
              {/* Next Payment Timer */}
              {subscriptionStatus === "active" && nextPaymentTimeRemaining && (
                <p className="mb-4">
                  <span className="font-semibold">Next Payment In:</span>{" "}
                  {nextPaymentTimeRemaining.days}d {nextPaymentTimeRemaining.hours}h{" "}
                  {nextPaymentTimeRemaining.minutes}m {nextPaymentTimeRemaining.seconds}s
                </p>
              )}
              {/* PayPal Buttons for Inactive, Expired, or Trial Subscriptions */}
              {(subscriptionStatus === "inactive" ||
                subscriptionStatus === "expired" ||
                subscriptionStatus === "trial") && (
                <div>
                  <p className="mb-4">
                    {subscriptionStatus === "trial"
                      ? "Your trial period allows you to use all features for a limited time. Consider subscribing to continue enjoying uninterrupted access."
                      : "Upgrade your subscription to access all features."}
                  </p>
                  {/* Display Error Messages */}
                  {error && <p className="text-red-500 mb-4">{error}</p>}
                  {successMessage && (
                    <p className="text-green-500 mb-4">{successMessage}</p>
                  )}
                  {/* PayPal Buttons */}
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  />
                </div>
              )}
              {/* If already active, provide an option to manage subscription */}
              {subscriptionStatus === "active" && (
                <div className="mt-4">
                  <p className="mb-4">
                    Your subscription is active. Thank you for your support!
                  </p>
                  {/* Optionally, add a button to manage subscription */}
                </div>
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  // PayPal Create Order Function
  const createOrder = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/payments/create-order", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      return data.id;
    } catch (err) {
      console.error("Error creating PayPal order:", err);
      setError("Failed to create PayPal order.");
      return;
    }
  };

  // PayPal OnApprove Function
  const onApprove = async (data) => {
    try {
      const res = await fetch("http://localhost:5001/api/payments/capture-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ orderID: data.orderID }),
      });
      if (res.ok) {
        setSubscriptionStatus("active");
        setSuccessMessage("Subscription activated successfully!");
        setError(null);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Payment capture failed.");
      }
    } catch (err) {
      console.error("Error capturing PayPal order:", err.message);
      setError(err.message);
      setSuccessMessage(null);
    }
  };

  // PayPal OnError Function
  const onError = (err) => {
    console.error("PayPal Checkout Error:", err);
    setError("An error occurred during the payment process. Please try again.");
  };

  // Handle Subscription Timers
  useEffect(() => {
    let trialTimer;
    let paymentTimer;

    if (user && subscriptionStatus === "trial") {
      if (!user.trialStartDate) {
        console.error("Trial Start Date is missing for trial subscription.");
        return;
      }

      const trialEndDate = new Date(user.trialStartDate);
      trialEndDate.setDate(trialEndDate.getDate() + 3); // Assuming a 3-day trial

      const updateTrialTimer = () => {
        const now = new Date();
        const timeDiff = trialEndDate - now;

        if (timeDiff <= 0) {
          setSubscriptionStatus("expired");
          clearInterval(trialTimer);
          setTrialTimeRemaining(null);
        } else {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          setTrialTimeRemaining({ days, hours, minutes, seconds });
        }
      };

      updateTrialTimer();
      trialTimer = setInterval(updateTrialTimer, 1000);
    }

    if (user && subscriptionStatus === "active") {
      // Assuming user has a nextPaymentDate field
      if (!user.nextPaymentDate) {
        console.error("Next Payment Date is missing for active subscription.");
        return;
      }

      const nextPaymentDate = new Date(user.nextPaymentDate);

      const updatePaymentTimer = () => {
        const now = new Date();
        const timeDiff = nextPaymentDate - now;

        if (timeDiff <= 0) {
          // Handle payment due or automatic renewal
          // For simplicity, we'll just clear the timer here
          setNextPaymentTimeRemaining(null);
          clearInterval(paymentTimer);
        } else {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          setNextPaymentTimeRemaining({ days, hours, minutes, seconds });
        }
      };

      updatePaymentTimer();
      paymentTimer = setInterval(updatePaymentTimer, 1000);
    }

    return () => {
      if (trialTimer) clearInterval(trialTimer);
      if (paymentTimer) clearInterval(paymentTimer);
    };
  }, [user, subscriptionStatus]);

  // Determine if Subscription is Active or Trial
  const isSubscriptionActive =
    subscriptionStatus === "active" || subscriptionStatus === "trial";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md relative">
        {/* User Info */}
        <div className="p-4 flex items-center space-x-4 mt-16">
          {user && user.profilePicture ? (
            <img
              src={`http://localhost:5001${user.profilePicture}`}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="text-blue-500" />
            </div>
          )}
          <div>
            {userLoading ? (
              <h2 className="font-semibold">Loading...</h2>
            ) : userError ? (
              <h2 className="font-semibold">User</h2>
            ) : (
              <h2 className="font-semibold">{user.username}</h2>
            )}
          </div>
        </div>
        <nav className="mt-8">
          {/* Dashboard Navigation Button */}
          <button
            onClick={() => setActiveView("dashboard")}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "dashboard"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200 ${
              !isSubscriptionActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isSubscriptionActive}
          >
            <LayoutDashboard className="mr-4" />
            Dashboard
          </button>
          {/* Add Income Navigation Button */}
          <button
            onClick={() => setActiveView("income")}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "income"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200 ${
              !isSubscriptionActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isSubscriptionActive}
          >
            <DollarSign className="mr-4" />
            Add Income
          </button>
          {/* Add Expenses Navigation Button */}
          <button
            onClick={() => setActiveView("expenses")}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "expenses"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200 ${
              !isSubscriptionActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isSubscriptionActive}
          >
            <PieChart className="mr-4" />
            Add Expenses
          </button>
          {/* Add Goal Navigation Button */}
          <button
            onClick={() => setActiveView("goals")}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "goals"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200 ${
              !isSubscriptionActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isSubscriptionActive}
          >
            <Target className="mr-4" />
            Add Goal
          </button>
          {/* View Transactions Navigation Button */}
          <button
            onClick={() => setActiveView("transactions")}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "transactions"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200 ${
              !isSubscriptionActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isSubscriptionActive}
          >
            <FileText className="mr-4" />
            View Transactions
          </button>
          {/* Settings Navigation Button (Always Enabled) */}
          <button
            onClick={() => setActiveView("settings")}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === "settings"
                ? "text-blue-500 bg-blue-100"
                : "text-gray-700"
            } hover:bg-gray-200`}
          >
            <Settings className="mr-4" />
            Settings
          </button>
        </nav>
        {/* Logout Button */}
        <div className="absolute bottom-4 left-4">
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-700 hover:text-red-500"
          >
            <LogOut className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {/* Display User Error */}
        {userError && <p className="text-red-500">{userError}</p>}
        {/* Removed Debug Info */}
        {authLoading || isLoadingSubscription ? (
          // Loading State
          <div className="flex items-center justify-center h-full">
            <p className="text-xl">Loading...</p>
          </div>
        ) : !isAuthenticated ? (
          // Access Denied
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md text-center">
              <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
              <p className="mb-6">
                You must be signed in to access the profile dashboard.
              </p>
              <a
                href="/signin"
                className="text-blue-500 hover:underline font-semibold"
              >
                Go to Sign In
              </a>
            </div>
          </div>
        ) : userLoading ? (
          // User Data Loading
          <div className="flex items-center justify-center h-full">
            <p className="text-xl">Loading user data...</p>
          </div>
        ) : subscriptionStatus === "expired" ? (
          // Subscription Required with PayPal Buttons in Settings
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md text-center">
              <h2 className="text-2xl font-semibold mb-4">
                Subscription Required
              </h2>
              <p className="mb-6">
                Your trial period has expired. Please subscribe to continue
                using the dashboard.
              </p>
              {/* Display Error Messages */}
              {error && <p className="text-red-500 mb-4">{error}</p>}
              {successMessage && (
                <p className="text-green-500 mb-4">{successMessage}</p>
              )}
              {/* PayPal Buttons */}
              <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
              />
            </div>
          </div>
        ) : isSubscriptionActive ? (
          // Render Main Dashboard Views
          renderView()
        ) : (
          // Handle Unknown Subscription Status
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md text-center">
              <h2 className="text-2xl font-semibold mb-4">
                Subscription Status Unknown
              </h2>
              <p className="mb-6">
                We are unable to determine your subscription status. Please
                contact support.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
