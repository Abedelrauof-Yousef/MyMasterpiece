const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactUsSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read'], default: 'unread' },
  createdAt: { type: Date, default: Date.now }, 
});

const ContactUs = mongoose.model('ContactUs', contactUsSchema);
module.exports = ContactUs;
