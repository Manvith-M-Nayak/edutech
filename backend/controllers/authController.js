const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// User registration function
const register = async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password before storing in database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save new user (default isAdmin to false)
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            isAdmin: false // ✅ Ensure new users are not admins by default
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error, please try again later" });
    }
};

// User login function
const login = async (req, res) => {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Generate JWT Token (Include isAdmin)
        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin }, 
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // ✅ Include isAdmin in the response
        res.json({ 
            token, 
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                isAdmin: user.isAdmin // ✅ Make sure frontend gets isAdmin
            } 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error, please try again later" });
    }
};

module.exports = { register, login };
