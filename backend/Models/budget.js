const mongoose = require('mongoose');
const { Schema } = mongoose;

const budgetSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  spent: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Budget = mongoose.model('Budget', budgetSchema);
module.exports = Budget;
