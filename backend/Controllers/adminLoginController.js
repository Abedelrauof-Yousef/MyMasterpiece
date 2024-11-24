const Admin = require("../Models/AdminLogin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.login = async (req, res) => {
    
  const { formData } = req.body;

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ email:formData.email }).select('+password');
    if (!admin) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(formData.password, admin.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
    }


    res.status(200).json({ msg: 'Login successful', userId: admin._id });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

