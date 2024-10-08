import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  User, LayoutDashboard, FileText, DollarSign, PieChart, LogOut, Target,
} from 'lucide-react';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [newIncome, setNewIncome] = useState({ amount: '', description: '' });
  const [newExpense, setNewExpense] = useState({ amount: '', description: '' });
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    salary: '',
    monthlyExpenses: '',
    monthlySavings: '',
  });
  const [error, setError] = useState(null);

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
          }),
        });
        const newTransaction = await res.json();
        setTransactions([...transactions, newTransaction]);
        type === 'income'
          ? setNewIncome({ amount: '', description: '' })
          : setNewExpense({ amount: '', description: '' });
      } catch (err) {
        console.error('Error adding transaction:', err);
      }
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    if (!id) {
      console.error('Transaction ID is undefined');  // Log an error if ID is undefined
      return;
    }

    console.log('Attempting to delete transaction with ID:', id);  // Log the ID

    try {
      const res = await fetch(`http://localhost:5001/api/transactions/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`Failed to delete transaction: ${res.status}`);
      }

      setTransactions(transactions.filter((t) => t._id !== id));  // Remove the deleted transaction from the state
    } catch (err) {
      console.error('Error deleting transaction:', err.message);
    }
  };

// Add goal with validation
const addGoal = async () => {
    const { name, targetAmount, salary, monthlyExpenses, monthlySavings } = newGoal;

    // Parse values to integers (to handle cases where inputs are treated as strings)
    const parsedSalary = parseInt(salary, 10);
    const parsedMonthlyExpenses = parseInt(monthlyExpenses, 10);
    const parsedMonthlySavings = parseInt(monthlySavings, 10);

    // Condition to check for invalid input
    if (parsedSalary <= parsedMonthlyExpenses) {
        setError('Salary must be greater than monthly expenses.');
        return;
    }

    if (parsedMonthlySavings > parsedSalary - parsedMonthlyExpenses) {
        setError('Monthly savings cannot be greater than what is left from salary after expenses.');
        return;
    }

    // Clear previous errors
    setError(null);

    if (name && targetAmount && salary && monthlyExpenses && monthlySavings) {
        try {
            const res = await fetch('http://localhost:5001/api/goals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...newGoal,
                    salary: parsedSalary,
                    monthlyExpenses: parsedMonthlyExpenses,
                    monthlySavings: parsedMonthlySavings
                }),
            });
            const addedGoal = await res.json();
            setGoals([...goals, addedGoal]);
            setNewGoal({
                name: '',
                targetAmount: '',
                salary: '',
                monthlyExpenses: '',
                monthlySavings: '',
            });
        } catch (err) {
            console.error('Error adding goal:', err);
        }
    }
};


  // Delete goal
  const deleteGoal = async (id) => {
    if (!id) {
      console.error('Goal ID is undefined');  // Log an error if ID is undefined
      return;
    }

    console.log('Attempting to delete goal with ID:', id);  // Log the ID

    try {
      const res = await fetch(`http://localhost:5001/api/goals/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`Failed to delete goal: ${res.status}`);
      }

      setGoals(goals.filter((goal) => goal._id !== id));  // Remove the deleted goal from the state
    } catch (err) {
      console.error('Error deleting goal:', err.message);
    }
  };

  const chartData = transactions
    .reduce((acc, transaction) => {
      const date = transaction.date.split('T')[0];
      const existingDate = acc.find((item) => item.date === date);
      if (existingDate) {
        existingDate[transaction.type] += transaction.amount;
      } else {
        acc.push({
          date,
          income: transaction.type === 'income' ? transaction.amount : 0,
          expense: transaction.type === 'expense' ? transaction.amount : 0,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const totalIncome = transactions.reduce(
    (sum, t) => (t.type === 'income' ? sum + t.amount : sum),
    0
  );
  const totalExpenses = transactions.reduce(
    (sum, t) => (t.type === 'expense' ? sum + t.amount : sum),
    0
  );
  const totalBalance = totalIncome - totalExpenses;

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <>
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="income" fill="#4CAF50" name="Income" />
                  <Bar dataKey="expense" fill="#F44336" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-2">Total Income</h2>
                <p className="text-3xl font-bold text-green-500">
                  $ {totalIncome.toFixed(2)}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-2">Total Expenses</h2>
                <p className="text-3xl font-bold text-red-500">
                  $ {totalExpenses.toFixed(2)}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-2">Total Balance</h2>
                <p className="text-3xl font-bold text-blue-500">
                  $ {totalBalance.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
              <div className="space-y-2">
                {transactions
                  .slice(-5)
                  .reverse()
                  .map((t) => (
                    <div key={t._id} className="flex justify-between items-center">
                      <span
                        className={t.type === 'income' ? 'text-green-500' : 'text-red-500'}
                      >
                        {t.description}
                      </span>
                      <span
                        className={t.type === 'income' ? 'text-green-500' : 'text-red-500'}
                      >
                        {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
              </div>
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
                    <th className="text-left">Description</th>
                    <th className="text-right">Amount</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t._id}>
                      <td>{t.date?.split('T')[0]}</td>
                      <td className={t.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                        {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                      </td>
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
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case 'income':
        const incomeTransactions = transactions.filter((t) => t.type === 'income');
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
                type="text"
                placeholder="Description"
                value={newIncome.description}
                onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
              />
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
        const expenseTransactions = transactions.filter((t) => t.type === 'expense');
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
                type="text"
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
              />
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
                placeholder="Monthly Salary"
                value={newGoal.salary}
                onChange={(e) => setNewGoal({ ...newGoal, salary: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="number"
                placeholder="Monthly Expenses"
                value={newGoal.monthlyExpenses}
                onChange={(e) => setNewGoal({ ...newGoal, monthlyExpenses: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="number"
                placeholder="Monthly Savings"
                value={newGoal.monthlySavings}
                onChange={(e) => setNewGoal({ ...newGoal, monthlySavings: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
              />
              <button
                onClick={addGoal}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Add Goal
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Your Goals</h2>
              {goals.map((goal) => (
                <div key={goal._id} className="mb-4 p-4 border rounded">
                  <h3 className="font-semibold">{goal.name}</h3>
                  <p>Target Amount: ${goal.targetAmount}</p>
                  <p>Time to Achieve: {goal.timeToAchieve} months</p>
                  <button
                    onClick={() => deleteGoal(goal._id)}
                    className="text-red-500 hover:text-red-700 mt-2"
                  >
                    Delete
                  </button>
                </div>
              ))}
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
              activeView === 'dashboard'
                ? 'text-blue-500 bg-blue-100'
                : 'text-gray-700'
            }`}
          >
            <LayoutDashboard className="mr-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('transactions')}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === 'transactions'
                ? 'text-blue-500 bg-blue-100'
                : 'text-gray-700'
            }`}
          >
            <FileText className="mr-4" />
            View Transactions
          </button>
          <button
            onClick={() => setActiveView('income')}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === 'income'
                ? 'text-blue-500 bg-blue-100'
                : 'text-gray-700'
            }`}
          >
            <DollarSign className="mr-4" />
            Add Income
          </button>
          <button
            onClick={() => setActiveView('expenses')}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === 'expenses'
                ? 'text-blue-500 bg-blue-100'
                : 'text-gray-700'
            }`}
          >
            <PieChart className="mr-4" />
            Add Expenses
          </button>
          <button
            onClick={() => setActiveView('goals')}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeView === 'goals'
                ? 'text-blue-500 bg-blue-100'
                : 'text-gray-700'
            }`}
          >
            <Target className="mr-4" />
            Add Goal
          </button>
        </nav>
        <div className="absolute bottom-4 left-4">
          <button className="flex items-center text-gray-700">
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
