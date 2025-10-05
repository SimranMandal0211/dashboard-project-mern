const express = require("express");
const router = express.Router();
// const { body, validationResult } = require("express-validation");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require('../models/User');
const auth = require('../middleware/auth');
const { signupValidation, loginValidation } = require('../middleware/validate');

// signup
router.post('/signup', signupValidation, async (req, res) => {
    try{
        const { name, email, password } = req.body;

        // Basic validation
        if(!name || !email || !password){
            return res.status(400).json({ message: 'All fields are required' });
        }

        // check if user exists
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        // create user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({
            message: 'Signup successful',
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email },
        });
    }catch(err){
        console.error('Signup error: ',err);
        res.status(500).json({ message: 'Server error during signup '});
    }
});


// login
router.post('/login', loginValidation, async(req, res) => {
    try{
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        // Check user
        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({ message: 'Invalid credentials '});

        // compared password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ message: "Invalid credentials "});

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    }catch(err){
        console.error("Login error: ",err);
        res.status(500).json({ message: "Server error during login "});
    }
});


router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    }catch (err) {
        console.error("Profile error:", err);
        res.status(500).json({ message: "Server error loading profile." });
    }
});


// 🟥 LOGOUT (optional placeholder)
router.post("/logout", auth, async (req, res) => {
  try {
    // You can implement a token blacklist if needed (optional)
    res.json({ message: "Logout successful (client should clear token)" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error during logout." });
  }
});

module.exports = router;