// src/components/Dashboard/Dashboard.jsx

import React, { useState, useEffect, useMemo, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Menu } from "lucide-react"; // Import Menu icon

import Sidebar from "./Sidebar";
import DashboardView from "./views/DashboardView";
import IncomeView from "./views/IncomeView";
import ExpensesView from "./views/ExpensesView";
import GoalsView from "./views/GoalsView";
import TransactionsView from "./views/TransactionsView";
import SettingsView from "./views/SettingsView";

const Dashboard = () => {
  const { isAuthenticated, isLoading: authLoading } = useContext(AuthContext);

  // Sidebar state for responsiveness
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          <DashboardView
            netIncomesPerCategory={netIncomesPerCategory}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            totalBalance={totalBalance}
            goals={goals}
          />
        );

      case "income":
        return (
          <IncomeView
            newIncome={newIncome}
            setNewIncome={setNewIncome}
            addTransaction={addTransaction}
            incomeTransactions={incomeTransactions}
            deleteTransaction={deleteTransaction}
            error={error}
            successMessage={successMessage}
          />
        );

      case "expenses":
        return (
          <ExpensesView
            newExpense={newExpense}
            setNewExpense={setNewExpense}
            addTransaction={addTransaction}
            expenseTransactions={expenseTransactions}
            deleteTransaction={deleteTransaction}
            availableIncome={availableIncome}
            availablePerCategory={availablePerCategory}
            incomeCategories={incomeCategories}
            error={error}
            successMessage={successMessage}
          />
        );

      case "goals":
        return (
          <GoalsView
            newGoal={newGoal}
            setNewGoal={setNewGoal}
            addGoal={addGoal}
            goals={goals}
            deleteGoal={deleteGoal}
            totalFixedSalary={totalFixedSalary}
            totalFixedExpenses={totalFixedExpenses}
            existingGoalsMonthlyPayments={existingGoalsMonthlyPayments}
            error={error}
            successMessage={successMessage}
          />
        );

      case "transactions":
        return (
          <TransactionsView
            transactions={transactions}
            deleteTransaction={deleteTransaction}
          />
        );

      case "settings":
        return (
          <SettingsView
            settingsData={settingsData}
            setSettingsData={setSettingsData}
            handleSettingsSubmit={handleSettingsSubmit}
            user={user}
            subscriptionStatus={subscriptionStatus}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            error={error}
            successMessage={successMessage}
            trialTimeRemaining={trialTimeRemaining}
            nextPaymentTimeRemaining={nextPaymentTimeRemaining}
          />
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
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isSubscriptionActive={isSubscriptionActive}
        user={user}
        handleLogout={handleLogout}
        isSidebarOpen={isSidebarOpen} // Pass isSidebarOpen
        setIsSidebarOpen={setIsSidebarOpen} // Pass setIsSidebarOpen
      />

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto relative">
        {/* Burger Menu Button - visible on small screens */}
        <button
          className="md:hidden mt-10 focus:outline-none" // Updated margin-top for small screens
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Overlay when sidebar is open on small screens */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Display User Error */}
        {userError && <p className="text-red-500">{userError}</p>}
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
