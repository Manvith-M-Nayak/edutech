const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    category: { type: String, required: true },
    exampleInput: { type: String, required: true },
    exampleOutput: { type: String, required: true },
    points: { type: Number, required: true}
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
