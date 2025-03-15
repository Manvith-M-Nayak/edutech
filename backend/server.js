require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // ✅ Logging middleware
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const questionRoutes = require('./routes/questionRoutes');
const compilerRoutes = require('./routes/compilerRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// ✅ Middleware
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS for cross-origin requests
app.use(morgan('dev')); // ✅ Logs incoming requests (method, status, response time)

// ✅ Check Required Environment Variables
if (!process.env.JWT_SECRET) {
    console.error("❌ Missing JWT_SECRET! Add it to .env");
    process.exit(1); // Stop execution
}
if (!process.env.MONGO_URI) {
    console.error("❌ Missing MONGO_URI! Add it to .env");
    process.exit(1);
}

// ✅ Connect to Database
(async () => {
    try {
        await connectDB();
        console.log("✅ MongoDB Connected Successfully!");
    } catch (err) {
        console.error("❌ MongoDB Connection Failed:", err.message);
        process.exit(1);
    }
})();

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/compiler', compilerRoutes);
app.use('/api/chat', chatRoutes);

// ✅ Root Route
app.get("/", (req, res) => {
    res.status(200).json({ message: "🚀 Server is running!" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
