// Models/transaction.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  isFixed: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  recurrenceDate: {
    type: Number, // Day of the month (1-31)
    min: 1,
    max: 31,
    required: function() { return this.isRecurring; },
  },
  paymentMethod: {
    type: String, // Added paymentMethod field
    required: function() { return this.type === 'expense'; },
  },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
