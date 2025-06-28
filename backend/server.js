// server.js
require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
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

// Connect to MongoDB
connectDB();

// Setup CORS
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.status(200).send('API is running');
});

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/users', leaderboardRoutes);
app.use('/api', questionRoutes);
app.use('/api', compilerRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', submissions);

// For local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

//Export the Express API for Vercel
module.exports = app;
