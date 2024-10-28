// routes/AdminContactRoutes.js

const express = require('express');
const router = express.Router();
const { getAllMessages, markAsRead } = require('../Controllers/adminContactController');

// Middleware to protect routes (e.g., admin authentication)
// const { protect, admin } = require('../middleware/authMiddleware');

router.get('/contact-messages', /* protect, admin, */ getAllMessages);
router.patch('/contact-messages/:id/read', /* protect, admin, */ markAsRead);

module.exports = router;
