const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  targetAmount: {
    type: Number,
    required: true,
  },
  monthlyExpenses: {
    type: Number,
    required: true,
  },
  monthlySavings: {
    type: Number,
    required: true,
  },
  salaryAfterExpenses: {
    type: Number, // Salary after deducting expenses
  },
  calculatedTime: {
    type: Number, // Time to achieve the goal in months
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Goal', GoalSchema);
