const Goal = require('../Models/goal');
const Transaction = require('../Models/transaction'); // Import transaction model to get income sources

// @desc    Add a new goal
// @route   POST /api/goals
// @access  Private
exports.addGoal = async (req, res) => {
  try {
    const { name, targetAmount } = req.body; // Removed monthlyExpenses and monthlySavings since they're computed

    const userId = req.user.id;

    if (!name || !targetAmount) {
      return res.status(400).json({ msg: 'Name and target amount are required.' });
    }

    // Fetch fixed salary and expenses from transactions
    const fixedSalaryTransactions = await Transaction.find({
      userId,
      type: 'income',
      category: 'Salary',
      isRecurring: true, // Only fixed salaries
    });

    const fixedExpenseTransactions = await Transaction.find({
      userId,
      type: 'expense',
      isFixed: true, // Only fixed expenses
    });

    // Handle the case where there is no fixed salary or fixed expenses
    if (fixedSalaryTransactions.length === 0) {
      return res.status(400).json({ msg: 'No fixed salary found. You need a fixed salary to set a goal.' });
    }

    const totalFixedSalary = fixedSalaryTransactions.reduce((acc, t) => acc + t.amount, 0);
    const totalFixedExpenses = fixedExpenseTransactions.reduce((acc, t) => acc + t.amount, 0);

    const salaryAfterExpenses = totalFixedSalary - totalFixedExpenses;

    // Calculate time to achieve the goal
    const calculatedTime = salaryAfterExpenses > 0 ? targetAmount / salaryAfterExpenses : Infinity;

    // Check if salary is enough
    if (salaryAfterExpenses <= 0) {
      return res.status(400).json({ msg: 'Your fixed salary is not enough to save for this goal.' });
    }

    const newGoal = new Goal({
      user: userId,
      name,
      targetAmount,
      monthlyExpenses: totalFixedExpenses, // Store the fixed monthly expenses
      monthlySavings: salaryAfterExpenses, // Store the salary left after expenses
      calculatedTime, // Store the calculated time to achieve the goal
    });

    const savedGoal = await newGoal.save();
    res.json(savedGoal);
  } catch (err) {
    console.error('Error adding goal:', err.message); // Improved error logging
    res.status(500).send('Server Error');
  }
};

// @desc    Get all goals for a user
// @route   GET /api/goals
// @access  Private
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error.message); // Added error logging
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    await Goal.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Goal deleted' });
  } catch (error) {
    console.error('Error deleting goal:', error.message); // Added error logging
    res.status(500).json({ message: error.message });
  }
};
