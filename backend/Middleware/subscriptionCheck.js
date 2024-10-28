// Middleware/subscriptionCheck.js
const User = require("../Models/users");

module.exports = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming user ID is stored in req.user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    const now = new Date();

    if (user.subscriptionStatus === "trial") {
      const trialEndDate = new Date(user.trialStartDate);
      trialEndDate.setDate(trialEndDate.getDate() + 3);

      if (now > trialEndDate) {
        // Trial expired
        user.subscriptionStatus = "expired";
        await user.save();
        return res.status(403).json({ msg: "Trial expired. Please subscribe." });
      }
    } else if (user.subscriptionStatus === "active") {
      if (now > user.subscriptionEndDate) {
        // Subscription expired
        user.subscriptionStatus = "expired";
        await user.save();
        return res.status(403).json({ msg: "Subscription expired. Please renew." });
      }
    } else if (user.subscriptionStatus === "expired") {
      return res.status(403).json({ msg: "Access denied. Please subscribe." });
    }

    // User is either on trial or has an active subscription
    next();
  } catch (err) {
    console.error("Subscription check error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
