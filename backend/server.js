require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const { exec } = require("child_process");
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const questionRoutes = require('./routes/questionRoutes');
const compilerRoutes = require('./routes/compilerRoutes');
const chatRoutes = require('./routes/chatRoutes');
const submissions = require('./routes/submissions');

// Initialize Express app
const app = express();

app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS for cross-origin requests

// Connect to MongoDB
connectDB();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"; // Default frontend URL

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true, // Allow cookies if needed
  })
);

// Define routes
app.use('/api/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/api/users', leaderboardRoutes);
app.use('/api', questionRoutes);
app.use('/api', compilerRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', submissions);

// Export the app for Vercel
module.exports = app;
