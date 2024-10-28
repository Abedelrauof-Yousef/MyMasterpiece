// models/User.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  subscriptionStatus: {
    type: String,
    enum: ["trial", "active", "expired"],
    default: "trial",
  },
  trialStartDate: { type: Date, default: Date.now },
  subscriptionStartDate: { type: Date },
  subscriptionEndDate: { type: Date },
  isActive: { type: Boolean, default: true }, // Added field
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update `updatedAt` before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
