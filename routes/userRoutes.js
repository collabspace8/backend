const express = require("express");
const router = express.Router();
const userController = require("../controllers/registrationController");

// Registration
router.post("/register", userController.createUser);

// Login
router.post("/login", userController.loginUser);

module.exports = router;
