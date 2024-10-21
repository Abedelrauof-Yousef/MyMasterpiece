// Controllers/goalController.js

const Goal = require('../Models/goal');
const Transaction = require('../Models/transaction'); // Import transaction model to get income sources

// @desc    Add a new goal
// @route   POST /api/goals
// @access  Private
exports.addGoal = async (req, res) => {
  try {
    const { name, targetAmount, desiredMonthlyPayment, timePeriod } = req.body;

    const userId = req.user.id;

    if (!name || !targetAmount || !desiredMonthlyPayment || !timePeriod) {
      return res.status(400).json({ msg: 'All fields are required.' });
    }

    const parsedTargetAmount = parseFloat(targetAmount);
    const parsedDesiredMonthlyPayment = parseFloat(desiredMonthlyPayment);
    const parsedTimePeriod = parseFloat(timePeriod);

    if (
      isNaN(parsedTargetAmount) ||
      parsedTargetAmount <= 0 ||
      isNaN(parsedDesiredMonthlyPayment) ||
      parsedDesiredMonthlyPayment <= 0 ||
      isNaN(parsedTimePeriod) ||
      parsedTimePeriod <= 0
    ) {
      return res.status(400).json({ msg: 'Invalid input values.' });
    }

    // Fetch fixed salary and expenses from transactions
    const fixedSalaryTransactions = await Transaction.find({
      userId,
      type: 'income',
      isRecurring: true, // Only fixed salaries
    });

    const fixedExpenseTransactions = await Transaction.find({
      userId,
      type: 'expense',
      isFixed: true, // Only fixed expenses
    });

    // Handle the case where there is no fixed salary or fixed expenses
    if (fixedSalaryTransactions.length === 0) {
      return res.status(400).json({
        msg: 'No fixed salary found. You need a fixed salary to set a goal.',
      });
    }

    const totalFixedSalary = fixedSalaryTransactions.reduce(
      (acc, t) => acc + t.amount,
      0
    );
    const totalFixedExpenses = fixedExpenseTransactions.reduce(
      (acc, t) => acc + t.amount,
      0
    );

    // Calculate existing goals' total desired monthly payments
    const existingGoals = await Goal.find({ user: userId });
    const existingGoalsMonthlyPayments = existingGoals.reduce(
      (sum, goal) => sum + goal.desiredMonthlyPayment,
      0
    );

    // Available income for new goals
    const availableMonthlyIncome =
      totalFixedSalary - totalFixedExpenses - existingGoalsMonthlyPayments;

    if (parsedDesiredMonthlyPayment > availableMonthlyIncome) {
      return res.status(400).json({
        msg: `Desired monthly payment of $${parsedDesiredMonthlyPayment.toFixed(
          2
        )} exceeds available income of $${availableMonthlyIncome.toFixed(
          2
        )}. Please increase your available income, decrease the monthly payment, or reduce your expenses.`,
      });
    }

    // Check if desired monthly payment over the time period meets the target amount
    const totalSavings = parsedDesiredMonthlyPayment * parsedTimePeriod;

    if (totalSavings < parsedTargetAmount) {
      return res.status(400).json({
        msg: `With a monthly payment of $${parsedDesiredMonthlyPayment.toFixed(
          2
        )} over ${parsedTimePeriod} months, you will save $${totalSavings.toFixed(
          2
        )}, which is less than the target amount of $${parsedTargetAmount.toFixed(
          2
        )}. Please increase your monthly payment or extend the time period.`,
      });
    }

    const newGoal = new Goal({
      user: userId,
      name,
      targetAmount: parsedTargetAmount,
      desiredMonthlyPayment: parsedDesiredMonthlyPayment,
      timePeriod: parsedTimePeriod,
      progress: 0, // Initialize progress
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

    // Calculate progress for each goal
    const updatedGoals = goals.map(goal => {
      const monthsElapsed = Math.floor(
        (new Date() - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24 * 30)
      );
      const progress = monthsElapsed * goal.desiredMonthlyPayment;

      // Ensure progress does not exceed targetAmount
      const cappedProgress = Math.min(progress, goal.targetAmount);

      return {
        ...goal.toObject(),
        progress: cappedProgress,
        monthsElapsed,
      };
    });

    res.json(updatedGoals);
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
