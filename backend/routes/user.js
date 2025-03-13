const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");
 // ✅ Authentication middleware

// ✅ Get user profile by username
router.get("/profile/:username", verifyToken, async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
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

module.exports = router;
