// Import necessary modules and models
const express = require("express");
const router = express.Router();
const Registration = require("../models/registrationModel");

// Route to handle registration submission
router.post("/register", async (req, res) => {
  try {
    const { fullname, email, phone, username, password, access } = req.body;

    // Create a new registration instance
    const newRegistration = new Registration({
      fullname,
      email,
      phone,
      username,
      password,
      access,
    });

    // Save the registration data to MongoDB
    await newRegistration.save();

    // Send a success response
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    // Handle errors
    console.error("Error registering:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
