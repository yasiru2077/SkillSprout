const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// Multer setup for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Register User
router.post("/register", upload.single("profilePic"), async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      profilePic: req.file ? req.file.path : "", // Save profile pic path if uploaded
    });

    const user = await newUser.save();
    res.status(201).json({ message: "User registered successfully!", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ error: "User not found!" });

    // Validate password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).json({ error: "Invalid credentials!" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful!", user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

router.post("/logout", async (req, res) => {
  try {
    res
      .clearCookie("accessToken", {
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json("User has been logged out");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
