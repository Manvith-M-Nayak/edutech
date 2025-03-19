require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const { exec } = require("child_process");
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const questionRoutes = require('./routes/questionRoutes');
const compilerRoutes = require('./routes/compilerRoutes');
const chatRoutes = require('./routes/chatRoutes');
const submissions = require('./routes/submissions');
const app = express();

app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS for cross-origin requests

connectDB();
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true, // Allow cookies if needed
  })
);


app.use('/api/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/api/users', leaderboardRoutes);
app.use('/api', questionRoutes);
app.use('/api', compilerRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', submissions);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
