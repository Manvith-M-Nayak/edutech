const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model

// GET Leaderboard Data (sorted by points in descending order)
router.get('/leaderboard', async (req, res) => {
  try {
    // Fetch only users who are NOT teachers and NOT admins
    const leaderboard = await User.find(
      { isTeacher: false, isAdmin: false }, // Filtering criteria
      'username totalPoints'
    )
      .sort({ totalPoints: -1 }) // Sort in descending order
      .limit(10); // Limit to top 10 users

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST (Insert/Update) Leaderboard Entry
router.post('/leaderboard', async (req, res) => {
  try {
    const { username, totalPoints } = req.body;

    if (!username || totalPoints === undefined) {
      return res.status(400).json({ message: 'Username and points are required' });
    }

    // Find user by username and update points (if higher)
    const user = await User.findOneAndUpdate(
      { username },
      { $max: { totalPoints } }, // Update only if the new points are higher
      { upsert: true, new: true }
    );

    // Fetch the updated leaderboard after the update
    const leaderboard = await User.find({}, 'username totalPoints')
      .sort({ totalPoints: -1 })
      .limit(10);

    res.status(200).json({
      message: 'Leaderboard updated successfully',
      leaderboard,
    });
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
