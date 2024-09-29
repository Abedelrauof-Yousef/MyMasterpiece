const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/users");

// Register function
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists by username or email
    let existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        msg: "User with that email or username already exists",
      });
    }

    // Create a new user object
    const newUser = new User({
      username,
      email,
      password,
    });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ msg: "User Registered Successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email or username (not password)
    let existingUser = await User.findOne({
      $or: [{ email }, { username: email }],
    }); // This assumes you're allowing login with either username or email
    if (!existingUser) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Create JWT payload
    const payload = { user: { id: existingUser._id } };

    // Generate JWT token and set it in an HTTP-only cookie
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" }, // Token expiration
      (err, token) => {
        if (err) {
          console.error("JWT Sign Error:", err);
          return res.status(500).json({ msg: "Error generating token" });
        }

        // Set the token in an HTTP-only cookie
        res.cookie("token", token, {
          httpOnly: true, // Prevents access to the cookie via JavaScript
          secure: process.env.NODE_ENV === "production", // Ensures the cookie is sent over HTTPS only in production
          sameSite: "Strict", // Prevents the cookie from being sent along with cross-site requests
          maxAge: 3600000, // Cookie expiration (1 hour)
        });

        // Send back a success message and optionally the user ID
        res
          .status(200)
          .json({ msg: "Login successful", userId: existingUser._id });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
