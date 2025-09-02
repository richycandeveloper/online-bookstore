const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// Email setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ name, email, password: hashed });
    res.json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// Login (send verification code)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.verificationCode = code;
  await user.save();

  // Send email
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Login Verification Code",
    text: `Your verification code is ${code}`
  });

  res.json({ message: "Verification code sent to email" });
});

// Verify code
router.post("/verify", async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user || user.verificationCode !== code) {
    return res.status(400).json({ error: "Invalid verification code" });
  }

  user.verificationCode = null;
  await user.save();

  const token = jwt.sign({ id: user.id }, "secretkey", { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
});

module.exports = router;
