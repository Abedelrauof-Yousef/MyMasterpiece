// controllers/AdminContactController.js

const ContactUs = require('../Models/contact');

// Get all contact messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactUs.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Mark a message as read
exports.markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    const message = await ContactUs.findById(id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    message.status = 'read';
    await message.save();
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
