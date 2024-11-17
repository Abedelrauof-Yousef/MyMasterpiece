// src/routes/feedbackRoutes.js

const express = require('express');
const router = express.Router();
const Feedback = require('../Models/feedback');
const authMiddleware = require('../Middleware/userAuth');

// @route   POST /api/feedback
// @desc    Submit new feedback
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { rating, comment } = req.body;

  // Basic validation
  if (!rating || !comment) {
    return res.status(400).json({ msg: 'Please provide rating and comment.' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ msg: 'Rating must be between 1 and 5.' });
  }

  try {
    const newFeedback = new Feedback({
      user: req.user.id, // Assuming your auth middleware attaches the user to req.user
      rating,
      comment,
    });

    const savedFeedback = await newFeedback.save();
    res.json(savedFeedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/feedback
// @desc    Get all feedback
// @access  Public
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('user', 'username') // Populate user's username; adjust fields as needed
      .sort({ createdAt: -1 }); // Latest feedback first
    res.json(feedbacks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
