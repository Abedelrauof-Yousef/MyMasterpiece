const express = require("express");
const router = express.Router();
const { register, login } = require("../Controllers/userController");

router.post("/register", register);
router.post("/login", login);


router.post("/logout", (req, res) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'Strict' });
    res.status(200).json({ msg: "Logout successful" });
  });
  



  // New /checkAuth route
router.get("/checkAuth", (req, res) => {
    const token = req.cookies.token; // Assuming you are using cookies to store the token
    if (token) {
      res.status(200).json({ isAuthenticated: true });
    } else {
      res.status(401).json({ isAuthenticated: false });
    }
  });
module.exports = router;
