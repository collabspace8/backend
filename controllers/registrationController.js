const express = require("express");
const router = express.Router();
const { connect } = require("../connection"); // Path to your db.js

router.post("/register", async (req, res) => {
  const db = await connect();
  const collection = db.collection("registrations"); // Use your collection name

  try {
    const { fullname, email, phone, username, password, access } = req.body;

    // Insert the new registration into the database
    const result = await collection.insertOne({
      fullname,
      email,
      phone,
      username,
      password,
      access,
    });

    res
      .status(201)
      .json({ message: "Registration successful", result: result.ops });
  } catch (error) {
    console.error("Error registering:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
