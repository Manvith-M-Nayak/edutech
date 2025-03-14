const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// Get all questions
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
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
    res.status(500).json({ error: "Failed to fetch question" });
  }
});

// Submit a solution (Placeholder for future evaluation)
router.post("/questions/:id/submit", async (req, res) => {
  const { solution } = req.body;

  if (!solution) {
    return res.status(400).json({ error: "Solution cannot be empty" });
  }

  res.json({ message: "Solution submitted successfully! (Evaluation logic pending)" });
});

module.exports = router;
