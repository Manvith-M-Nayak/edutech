const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth"); // ✅ Authentication middleware

// ✅ Get user profile by username
router.get("/profile/:username", verifyToken, async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if streak needs to be reset
        if (user.lastStreakDate) {
            const currentDate = new Date();
            const lastStreakDate = new Date(user.lastStreakDate);
            
            // Set both dates to midnight for comparison
            currentDate.setHours(0, 0, 0, 0);
            lastStreakDate.setHours(0, 0, 0, 0);
            
            // Calculate the difference in days
            const diffTime = Math.abs(currentDate - lastStreakDate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            // If the difference is more than 1 day, reset streak
            if (diffDays > 1) {
                user.streaks = 0;
                await user.save();
            }
        }

        res.json({
            username: user.username,
            level: user.level,
            totalPoints: user.totalPoints,
            streaks: user.streaks,
            leaderboardPosition: user.leaderboardPosition
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// ✅ Get students if the user is a teacher, and vice versa (for chat system)
router.get("/", verifyToken, async (req, res) => {
    try {

        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // ✅ Return students for teachers and teachers for students
        const users = await User.find({ isTeacher: !req.user.isTeacher }).select("_id username isTeacher");

        if (users.length === 0) {
            return res.status(404).json({ error: "No users found" });
        }

        console.log("Fetched Users:", users); // ✅ Debugging log
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
