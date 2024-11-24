const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction, deleteTransaction } = require('../Controllers/transactionController');
const auth = require('../Middleware/userAuth'); // This will be the middleware for JWT verification
const subscriptionCheck = require("../Middleware/subscriptionCheck");


router.get('/', auth, subscriptionCheck, getTransactions);


router.post('/', auth, subscriptionCheck, addTransaction);


router.delete('/:id', auth, subscriptionCheck, deleteTransaction);


module.exports = router;
