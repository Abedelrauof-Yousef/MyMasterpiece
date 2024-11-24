// src/routes/feedbackRoutes.js

const express = require('express');
const router = express.Router();
const Feedback = require('../Models/feedback');
const authMiddleware = require('../Middleware/userAuth');


router.post('/', authMiddleware, async (req, res) => {
  const { rating, comment } = req.body;


 
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


router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('user', 'username') 
      .sort({ createdAt: -1 }); 
    res.json(feedbacks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
