const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const User = require("../models/User");

// User routes
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(400).json({ message: err.message });
  }
});

// Question routes
router.get("/questions", async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Get all questions first
    const questions = await Question.find();
    
    // If userId is provided, filter out completed questions
    if (userId) {
      const user = await User.findById(userId);
      
      if (user) {
        // Filter out questions that the user has already completed
        const filteredQuestions = questions.filter(question => 
          !user.completedQuestions.includes(question.id.toString())
        );
        return res.json(filteredQuestions);
      }
    }
    
    // If no userId or user not found, return all questions
    res.json(questions);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// Get a single question by ID
router.get("/questions/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json(question);
  } catch (err) {
    console.error("Error fetching question:", err);
    res.status(500).json({ error: "Failed to fetch question" });
  }
});

module.exports = router;