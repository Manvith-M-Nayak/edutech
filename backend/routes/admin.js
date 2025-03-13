const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { verifyAdmin } = require('../middleware/auth'); // ✅ Import Admin Middleware

// ✅ Add a new question (Admin only)
router.post('/questions', verifyAdmin, async (req, res) => {
    try {
        const { title, description, difficulty, category, exampleInput, exampleOutput } = req.body;

        // ✅ Validate required fields
        if (!title || !description || !difficulty || !category || !exampleInput || !exampleOutput) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Check if the title already exists
        const existingQuestion = await Question.findOne({ title });
        if (existingQuestion) {
            return res.status(400).json({ message: `A question with the title "${title}" already exists. Please use a different title.` });
        }

        // ✅ Create and save new question
        const question = new Question(req.body);
        await question.save();
        res.status(201).json({ message: "Question added successfully", question });

    } catch (error) {
        console.error("Error adding question:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});

// ✅ Get all questions (Admin only)
router.get('/questions', verifyAdmin, async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions.length > 0 ? questions : []); // ✅ Ensure empty array if no questions
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});

// ✅ Update a question (Admin only)
router.put('/questions/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Check if the new title already exists (only if title is being updated)
        if (req.body.title) {
            const existingQuestion = await Question.findOne({ title: req.body.title });
            if (existingQuestion && existingQuestion._id.toString() !== id) {
                return res.status(400).json({ message: `A question with the title "${req.body.title}" already exists. Please choose a different title.` });
            }
        }

        const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json({ message: "Question updated successfully", updatedQuestion });
    } catch (error) {
        console.error("Error updating question:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});

// ✅ Delete a question (Admin only)
router.delete('/questions/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        await Question.findByIdAndDelete(id);
        res.json({ message: "Question deleted successfully" });
    } catch (error) {
        console.error("Error deleting question:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});

module.exports = router;
