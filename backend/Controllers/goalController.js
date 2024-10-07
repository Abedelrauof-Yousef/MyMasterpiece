const Goal = require("../models/Goal");

// @desc    Add a new goal
// @route   POST /api/goals
// @access  Private
exports.addGoal = async (req, res) => {
  try {
    const { name, targetAmount, salary, monthlyExpenses, monthlySavings } =
      req.body;

    const timeToAchieve = Math.ceil(targetAmount / monthlySavings);

    const goal = await Goal.create({
      user: req.user.id,
      name,
      targetAmount,
      salary,
      monthlyExpenses,
      monthlySavings,
      timeToAchieve,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
  
      console.log('Deleting goal:', goal);
  
      await Goal.deleteOne({ _id: req.params.id });  // Try Goal.deleteOne({ _id: req.params.id }) if this fails
  
      res.status(200).json({ message: 'Goal deleted' });
    } catch (error) {
      console.error('Error during deletion:', error.message);  // Log the error
      res.status(500).json({ message: error.message });
    }
  };