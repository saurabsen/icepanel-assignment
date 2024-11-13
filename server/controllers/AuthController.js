// controllers/AuthController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const AuthController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ error: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });

      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Registration Error:", error.message);
      res.status(500).json({ error: "Error registering user" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid password" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({
        token,
        user: {
          email: user.email,
          name: user.name,
          savings: user.totalSaving,
          id: user._id,
        },
      });
    } catch (error) {
      console.error("Login Error:", error.message);
      res.status(500).json({ error: "Error logging in" });
    }
  },

  authenticate: (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ error: "Access denied" });

    const token = authHeader.replace("Bearer ", "");
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Token Error:", error.message);
      res.status(401).json({ error: "Invalid token" });
    }
  },
};

module.exports = AuthController;
