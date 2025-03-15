const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// ✅ Register a new user
const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // ✅ Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists." });
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create new user (Default: Not a teacher/admin)
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            isAdmin: false,
            isTeacher: false
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully." });

    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
};

// ✅ Login User
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // ✅ Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        // ✅ Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        // ✅ Fetch latest user data (excluding password)
        const updatedUser = await User.findById(user._id).select("-password");

        // ✅ Generate JWT Token (Expire in 24 hours)
        const token = jwt.sign(
            { 
                id: updatedUser._id, 
                username: updatedUser.username, 
                email: updatedUser.email, 
                isAdmin: updatedUser.isAdmin, 
                isTeacher: updatedUser.isTeacher 
            }, 
            process.env.JWT_SECRET,
            { expiresIn: "24h" } // ✅ Extend session to 24 hours
        );

        res.json({ 
            token, 
            user: { 
                id: updatedUser._id, 
                username: updatedUser.username, 
                email: updatedUser.email, 
                isAdmin: updatedUser.isAdmin, 
                isTeacher: updatedUser.isTeacher 
            } 
        });

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
};

module.exports = { register, login };
