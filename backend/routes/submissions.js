// routes/api/submissions.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Question = require('../models/Question');
const { verifyToken } = require('../middleware/auth'); // Correctly destructure the middleware

// @route   GET api/submissions
// @desc    Get all submissions
// @access  Private/Admin or Teacher
router.get('/submissions', verifyToken, async (req, res) => {
  try {
    // Check if user is admin or teacher
    if (!req.user.isAdmin && !req.user.isTeacher) {
      return res.status(403).json({ message: 'Access denied. Admin/Teacher privileges required.' });
    }

    // Aggregate all submissions from all users
    const allUsers = await User.find({ 'questionSubmissions.0': { $exists: true } })
      .select('_id username questionSubmissions');
    
    // Format the submissions for frontend use
    const formattedSubmissions = [];
    
    allUsers.forEach(user => {
      user.questionSubmissions.forEach(submission => {
        formattedSubmissions.push({
          _id: submission._id,
          userId: user._id,
          username: user.username,
          questionId: submission.questionId,
          submission: submission.submission,
          points: submission.points,
          submittedAt: submission.submittedAt,
          language: submission.language || 'C'
        });
      });
    });
    
    // Sort by submission date (newest first)
    formattedSubmissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    res.json(formattedSubmissions);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/submissions/user/:userId
// @desc    Get submissions for a specific user
// @access  Private (own submissions) or Admin/Teacher
router.get('/api/user/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is requesting their own submissions or is admin/teacher
    if (req.user.id !== userId && !req.user.isAdmin && !req.user.isTeacher) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    
    const user = await User.findById(userId).select('questionSubmissions');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Format submissions with user data
    const submissions = user.questionSubmissions.map(sub => ({
      _id: sub._id,
      userId: userId,
      questionId: sub.questionId,
      submission: sub.submission,
      points: sub.points,
      submittedAt: sub.submittedAt,
      language: sub.language || 'javascript'
    }));
    
    // Sort by submission date (newest first)
    submissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    res.json(submissions);
  } catch (err) {
    console.error('Error fetching user submissions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/submissions/question/:questionId
// @desc    Get submissions for a specific question
// @access  Private/Admin or Teacher
router.get('/question/:questionId', verifyToken, async (req, res) => {
  try {
    const { questionId } = req.params;
    
    // Check if user is admin or teacher
    if (!req.user.isAdmin && !req.user.isTeacher) {
      return res.status(403).json({ message: 'Access denied. Admin/Teacher privileges required.' });
    }
    
    // Find all users who have submitted this question
    const users = await User.find({ 'questionSubmissions.questionId': questionId })
      .select('_id username questionSubmissions');
    
    const questionSubmissions = [];
    
    users.forEach(user => {
      // Filter only submissions for this question
      const relevantSubmissions = user.questionSubmissions.filter(
        sub => sub.questionId.toString() === questionId
      );
      
      relevantSubmissions.forEach(sub => {
        questionSubmissions.push({
          _id: sub._id,
          userId: user._id,
          username: user.username,
          questionId: sub.questionId,
          submission: sub.submission,
          points: sub.points,
          submittedAt: sub.submittedAt,
          language: sub.language || 'javascript'
        });
      });
    });
    
    // Sort by submission date (newest first)
    questionSubmissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    res.json(questionSubmissions);
  } catch (err) {
    console.error('Error fetching question submissions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;