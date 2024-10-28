const express = require('express');
const router = express.Router();
const { addGoal, getGoals, deleteGoal } = require('../Controllers/goalController');
const  auth  = require('../Middleware/userAuth');
const subscriptionCheck = require("../Middleware/subscriptionCheck");

router.post('/', auth, subscriptionCheck, addGoal);
router.get('/', auth, subscriptionCheck, getGoals);
router.delete('/:id', auth, subscriptionCheck, deleteGoal);

module.exports = router;