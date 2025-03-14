require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user')
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const questionRoutes = require('./routes/questionRoutes');
const compilerRoutes = require('./routes/compilerRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json());

// Connect Database
connectDB();

app.use('/api/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user',userRoutes);
app.use('/api/users', leaderboardRoutes);
app.use('/api',questionRoutes);
app.use('/api',compilerRoutes);
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
