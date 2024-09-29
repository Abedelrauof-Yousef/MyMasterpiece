const jwt = require("jsonwebtoken");
const User = require("../Models/users");

module.exports = (req, res, next) => {
  const token = req.cookies.token;  // Get the token from cookies

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
    req.user = decoded.user;  // Attach the user ID to the request object
    next();  // Continue to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
