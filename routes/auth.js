const express = require("express");
const router = express.Router();
// const { body, validationResult } = require("express-validation");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require('../models/User');
const auth = require('../middleware/auth');

// signup
router.post('/signup', async (req, res) => {
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
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({
            message: 'Server error'
        });
    }catch(err){
        console.error('Signup error: ',err);
        res.status(500).json({ message: 'Server error during signup '});
    }
});


// login
router.post('/login', async(req, res) => {
    try{
        const { email, password } = req.body;

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

        res.json({ token });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error "});
    }
});


router.get('/profile', auth, async (req, res) => {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
})
module.exports = router;