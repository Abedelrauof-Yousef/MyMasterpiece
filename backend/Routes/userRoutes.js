// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  updateUser,
} = require("../Controllers/userController");
const auth = require("../Middleware/userAuth"); // Import your auth middleware
const User = require("../Models/users"); // Import the User model
const upload = require("../Middleware/upload"); // Import upload middleware
const jwt = require("jsonwebtoken");

router.post("/register", register);
router.post("/login", login);

router.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "Strict" });
  res.status(200).json({ msg: "Logout successful" });
});

// Updated /checkAuth route
router.get("/checkAuth", (req, res) => {
  const token = req.cookies.token; // Assuming you are using cookies to store the token
  if (!token) {
    return res.status(401).json({ isAuthenticated: false });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ isAuthenticated: false });
    } else {
      return res.status(200).json({ isAuthenticated: true });
    }
  });
});

// New /me route to get the current user's data
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// New route to update user settings
router.put("/update", auth, upload.single("profilePicture"), updateUser);

module.exports = router;
