const express = require('express');
const router = express.Router();
const { addGoal, getGoals, deleteGoal } = require('../Controllers/goalController');
const  auth  = require('../Middleware/userAuth');

router.post('/', auth, addGoal);
router.get('/', auth, getGoals);
router.delete('/:id', auth, deleteGoal);

module.exports = router;