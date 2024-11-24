// routes/AdminContactRoutes.js

const express = require('express');
const router = express.Router();
const { getAllMessages, markAsRead } = require('../Controllers/adminContactController');



router.get('/contact-messages', getAllMessages);
router.patch('/contact-messages/:id/read',  markAsRead);

module.exports = router;
