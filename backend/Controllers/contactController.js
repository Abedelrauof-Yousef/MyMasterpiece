const express = require("express");
const ContactUs = require('../Models/contact');

// Contact submission endpoint (accessible only by authenticated users)
exports.contact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Ensure all required fields are present
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new ContactUs instance
    const newContact = new ContactUs({ name, email, subject, message });

    // Save the new contact to the database
    await newContact.save();

    // Return success message
    return res.status(200).json({ message: "Data Saved" });
  } catch (error) {
    console.error("Error while sending data:", error);
    return res.status(500).json({ message: "Technical Error Occurred" });
  }
};
