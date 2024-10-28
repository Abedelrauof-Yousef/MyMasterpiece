const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction, deleteTransaction } = require('../Controllers/transactionController');
const auth = require('../Middleware/userAuth'); // This will be the middleware for JWT verification
const subscriptionCheck = require("../Middleware/subscriptionCheck");

// @route   GET /api/transactions
// @desc    Get all transactions for the logged-in user
// @access  Private
router.get('/', auth, subscriptionCheck, getTransactions);

// @route   POST /api/transactions
// @desc    Add a new transaction
// @access  Private
router.post('/', auth, subscriptionCheck, addTransaction);


router.delete('/:id', auth, subscriptionCheck, deleteTransaction);


module.exports = router;
