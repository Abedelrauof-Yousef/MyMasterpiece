const mongoose = require('mongoose');
const { Schema } = mongoose;

const settingsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  preferences: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Settings = mongoose.model('Settings', settingsSchema);
module.exports = Settings;
