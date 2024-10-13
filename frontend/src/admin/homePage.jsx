import React, { useState, useEffect } from 'react';
import {
  User, LayoutDashboard, FileText, DollarSign, PieChart, LogOut, Target,
} from 'lucide-react';
import { Progress } from 'antd'; // Importing Progress bar from antd

const Dashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [newIncome, setNewIncome] = useState({
    amount: '',
    description: '',
    category: 'Salary',
    customCategory: '',
    isRecurring: false,
    recurrenceDate: '',
    date: '' // Adding manual date input
  });
  const [newExpense, setNewExpense] = useState({
    amount: '',
    description: '',
    category: 'Needs',
    customCategory: '',
    isRecurring: false,
    isFixed: false,
    date: '' // Adding manual date input
  });
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    yearsToAchieve: '',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // To display success message

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/transactions', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch transactions: ${res.status}`);
        }

        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error('Error fetching transactions:', err.message);
      }
    };

    fetchTransactions();
  }, []);

  // Fetch goals
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/goals', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch goals: ${res.status}`);
        }

        const data = await res.json();
        setGoals(data);
      } catch (err) {
        console.error('Error fetching goals:', err.message);
      }
    };

    fetchGoals();
  }, []);

  // Add transaction
  const addTransaction = async (type) => {
    const transaction = type === 'income' ? newIncome : newExpense;

    if (transaction.amount && transaction.description) {
      try {
        const res = await fetch('http://localhost:5001/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            type,
            amount: parseFloat(transaction.amount),
            description: transaction.description,
            category: transaction.category === 'Other'
              ? transaction.customCategory
              : transaction.category,
            isRecurring: transaction.isRecurring,
            isFixed: type === 'expense' ? transaction.isFixed : undefined,
            date: transaction.date ? new Date(transaction.date) : undefined, // Add manual date
            recurrenceDate: type === 'income' ? transaction.recurrenceDate : undefined, // For recurring income
          }),
        });

        const newTransaction = await res.json();
        setTransactions([...transactions, newTransaction]);

        if (type === 'income') {
          setNewIncome({
            amount: '',
            description: '',
            category: 'Salary',
            customCategory: '',
            isRecurring: false,
            recurrenceDate: '',
            date: '' // Reset date input
          });
        } else {
          setNewExpense({
            amount: '',
            description: '',
            category: 'Needs',
            customCategory: '',
            isRecurring: false,
            isFixed: false,
            date: '' // Reset date input
          });
        }
      } catch (err) {
        console.error('Error adding transaction:', err);
      }
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    if (!id) {
      console.error('Transaction ID is undefined');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/transactions/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`Failed to delete transaction: ${res.status}`);
      }

      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Error deleting transaction:', err.message);
    }
  };

  // Add Goal
  const addGoal = async () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.yearsToAchieve) {
      setError('All fields are required.');
      return;
    }

    // Calculate how many months are needed based on fixed salary, expenses, and target years
    const timeToAchieve = calculateTimeToAchieve();

    if (timeToAchieve === Infinity) {
      setError('Your fixed expenses are higher than or equal to your fixed salary. Goal cannot be achieved.');
      return;
    }

    if (timeToAchieve > newGoal.yearsToAchieve * 12) {
      setError('Your salary is not enough to achieve the goal within the specified time frame.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: newGoal.name,
          targetAmount: newGoal.targetAmount,
          timeToAchieve, // Calculating based on fixed salary
        }),
      });

      if (!res.ok) {
        // Handling non-JSON response from the server
        try {
          const errorResponse = await res.json();
          setError(`Error: ${errorResponse.message}`);
        } catch (jsonError) {
          setError(`Error adding goal: ${res.statusText}`);
        }
        return;
      }

      const addedGoal = await res.json();
      setGoals([...goals, addedGoal]);
      setNewGoal({
        name: '',
        targetAmount: '',
        yearsToAchieve: '',
      });
      setSuccessMessage(`Goal added successfully! Time to achieve: ${timeToAchieve} months.`);
      setError(null);
    } catch (err) {
      console.error('Error adding goal:', err);
      setError('Error adding goal. Please try again.');
    }
  };

  // Delete goal
  const deleteGoal = async (id) => {
    if (!id) {
      console.error('Goal ID is undefined');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/goals/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`Failed to delete goal: ${res.status}`);
      }

      setGoals(goals.filter((goal) => goal._id !== id));
    } catch (err) {
      console.error('Error deleting goal:', err.message);
    }
  };

  // Group transactions by income sources and calculate totals
  const groupedIncomes = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, transaction) => {
      const category = transaction.category || 'Other';
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {});

  const totalIncome = transactions.reduce(
    (sum, t) => (t.type === 'income' ? sum + t.amount : sum),
    0
  );
  const totalExpenses = transactions.reduce(
    (sum, t) => (t.type === 'expense' ? sum + t.amount : sum),
    0
  );
  const totalBalance = totalIncome - totalExpenses;

  // Calculate fixed salaries and fixed expenses
  const fixedIncomeTransactions = transactions.filter(
    (t) => t.type === 'income' && t.isRecurring
  );
  const fixedExpenseTransactions = transactions.filter(
    (t) => t.type === 'expense' && t.isFixed
  );

  // Sum up fixed salaries and expenses
  const totalFixedSalary = fixedIncomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalFixedExpenses = fixedExpenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Calculate the time to achieve goal based on fixed salary and expenses
  const calculateTimeToAchieve = () => {
    const availableMonthlyIncome = totalFixedSalary - totalFixedExpenses;
    if (availableMonthlyIncome <= 0) {
      return Infinity;
    }
    return Math.ceil(newGoal.targetAmount / availableMonthlyIncome);
  };

  const renderView = () => {
    const incomeTransactions = transactions.filter((t) => t.type === 'income');
    const expenseTransactions = transactions.filter((t) => t.type === 'expense');

    switch (activeView) {
      case 'dashboard':
        return (
          <>
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold">Income Sources</h2>
              {Object.keys(groupedIncomes).map((source) => (
                <div key={source}>
                  <p className="text-lg">{source}: ${groupedIncomes[source].toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-2">Total Income</h2>
                <p className="text-3xl font-bold text-green-500">${totalIncome.toFixed(2)}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-2">Total Expenses</h2>
                <p className="text-3xl font-bold text-red-500">${totalExpenses.toFixed(2)}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-2">Total Balance</h2>
                <p className="text-3xl font-bold text-blue-500">${totalBalance.toFixed(2)}</p>
              </div>
            </div>
          </>
        );

      case 'income':
        return (
          <>
            <h1 className="text-2xl font-semibold mb-6">Add Income</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <input
                type="number"
                placeholder="Amount"
                value={newIncome.amount}
                onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="date"
                value={newIncome.date}
                onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
              />
              <select
                value={newIncome.category}
                onChange={(e) => setNewIncome({ ...newIncome, category: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
              >
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Other">Other</option>
              </select>
              {newIncome.category === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter category"
                  value={newIncome.customCategory}
                  onChange={(e) => setNewIncome({ ...newIncome, customCategory: e.target.value })}
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
                    setNewIncome({ ...newIncome, isRecurring: e.target.checked })
                  }
                  className="mr-2"
                />
                <label>Is this a fixed salary (monthly)?</label>
              </div>
              {newIncome.isRecurring && (
                <div className="mb-4">
                  <label className="block mb-2">Date of the month it repeats (1-31)</label>
                  <input
                    type="number"
                    placeholder="Recurrence Date"
                    value={newIncome.recurrenceDate}
                    onChange={(e) =>
                      setNewIncome({ ...newIncome, recurrenceDate: e.target.value })
                    }
                    className="w-full p-2 mb-4 border rounded"
                    min="1"
                    max="31"
                  />
                </div>
              )}
              <button
                onClick={() => addTransaction('income')}
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                Add Income
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Your Incomes</h2>
              <div className="space-y-2">
                {incomeTransactions.map((t) => (
                  <div key={t._id} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{t.description}</p>
                      <p className="text-sm text-gray-500">{t.date?.split('T')[0]}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-green-500 mr-4">+${t.amount.toFixed(2)}</p>
                      <button
                        onClick={() => deleteTransaction(t._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'expenses':
        return (
          <>
            <h1 className="text-2xl font-semibold mb-6">Add Expense</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
              />
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
              >
                <option value="Needs">Needs</option>
                <option value="Wants">Wants</option>
                <option value="Other">Other</option>
              </select>
              {newExpense.category === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter custom category"
                  value={newExpense.customCategory}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, customCategory: e.target.value })}
                  className="w-full p-2 mb-4 border rounded"
                />
              )}
              <input
                type="text"
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, description: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
              />
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={newExpense.isRecurring}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, isRecurring: e.target.checked })}
                  className="mr-2"
                />
                <label>Is this a recurring monthly expense?</label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={newExpense.isFixed}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, isFixed: e.target.checked })}
                  className="mr-2"
                />
                <label>Is this a fixed monthly expense (e.g., food, bills)?</label>
              </div>
              <button
                onClick={() => addTransaction('expense')}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Add Expense
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Your Expenses</h2>
              <div className="space-y-2">
                {expenseTransactions.map((t) => (
                  <div key={t._id} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{t.description}</p>
                      <p className="text-sm text-gray-500">{t.date?.split('T')[0]}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-red-500 mr-4">-${t.amount.toFixed(2)}</p>
                      <button
                        onClick={() => deleteTransaction(t._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'goals':
        return (
          <>
            <h1 className="text-2xl font-semibold mb-6">Add Goal</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
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
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="number"
                placeholder="Years to Achieve"
                value={newGoal.yearsToAchieve}
                onChange={(e) => setNewGoal({ ...newGoal, yearsToAchieve: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
              />
              <p className="text-lg mb-4">Fixed Salary: ${totalFixedSalary.toFixed(2)}</p>
              <p className="text-lg mb-4">Fixed Expenses: ${totalFixedExpenses.toFixed(2)}</p>
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
                    <p>Target Amount: ${goal.targetAmount}</p>
                    <Progress percent={Math.round((goal.progress / goal.targetAmount) * 100)} />
                    <p>Time to Achieve: {goal.timeToAchieve} months</p>
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

      case 'transactions':
        return (
          <>
            <h1 className="text-2xl font-semibold mb-6">View Transactions</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Date</th>
                    <th className="text-left">Type</th>
                    <th className="text-left">Category</th>
                    <th className="text-left">Description</th>
                    <th className="text-right">Amount</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((t) => (
                      <tr key={t._id}>
                        <td>{t.date ? new Date(t.date).toLocaleDateString() : 'No Date'}</td>
                        <td className={t.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                          {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                        </td>
                        <td>{t.category}</td>
                        <td>{t.description}</td>
                        <td className={`text-right ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                          {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                        </td>
                        <td className="text-right">
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
                      <td colSpan="6" className="text-center text-gray-500">
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
      <div className="w-64 bg-white shadow-md">
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
            onClick={() => setActiveView('dashboard')}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === 'dashboard' ? 'text-blue-500 bg-blue-100' : 'text-gray-700'
            }`}
          >
            <LayoutDashboard className="mr-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('income')}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === 'income' ? 'text-blue-500 bg-blue-100' : 'text-gray-700'
            }`}
          >
            <DollarSign className="mr-4" />
            Add Income
          </button>
          <button
            onClick={() => setActiveView('expenses')}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === 'expenses' ? 'text-blue-500 bg-blue-100' : 'text-gray-700'
            }`}
          >
            <PieChart className="mr-4" />
            Add Expenses
          </button>
          <button
            onClick={() => setActiveView('goals')}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === 'goals' ? 'text-blue-500 bg-blue-100' : 'text-gray-700'
            }`}
          >
            <Target className="mr-4" />
            Add Goal
          </button>
          <button
            onClick={() => setActiveView('transactions')}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === 'transactions' ? 'text-blue-500 bg-blue-100' : 'text-gray-700'
            }`}
          >
            <FileText className="mr-4" />
            View Transactions
          </button>
        </nav>
        <div className="absolute bottom-4 left-4">
          <button className="flex items-center text-gray-700">
            <LogOut className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>
      <div className="flex-1 p-8 overflow-auto">{renderView()}</div>
    </div>
  );
};

export default Dashboard;
