const Expense = require('../Models/expense');
const Goal = require('../models/Goal');

// Get dashboard data (budget summary, expenses, goals)
const getDashboardData = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });
    const goals = await Goal.find({ user: req.user._id });
    res.json({ expenses, goals });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving dashboard data', error });
  }
};

// Add a new expense
const addExpense = async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;
    const newExpense = new Expense({ amount, category, date, description, user: req.user._id });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense', error });
  }
};

// Get all expenses
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving expenses', error });
  }
};

// Add a new goal
const addGoal = async (req, res) => {
  try {
    const { name, targetAmount, savedAmount, deadline } = req.body;
    const newGoal = new Goal({ name, targetAmount, savedAmount, deadline, user: req.user._id });
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ message: 'Error adding goal', error });
  }
};

// Get all goals
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({});
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving goals', error });
  }
};

module.exports = {
  getDashboardData,
  addExpense,
  getExpenses,
  addGoal,
  getGoals,
};
