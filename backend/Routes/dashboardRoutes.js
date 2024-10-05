const express = require('express');
const router = express.Router();
const auth = require("../Middleware/userAuth");
const {
  getDashboardData,
  addExpense,
  getExpenses,
  addGoal,
  getGoals,
} = require('../controllers/dashboardController');

// Routes
router.get('/', auth, getDashboardData);
router.post('/add-expense', auth, addExpense);
router.get('/expenses', auth, getExpenses);
router.post('/add-goal', auth, addGoal);
router.get('/goals', auth, getGoals);

module.exports = router;
