const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    category: { type: String, required: true },
    exampleInput1: { type: String, required: true },
    exampleInput2: { type: String, required: true },
    exampleOutput1: { type: String, required: true },
    exampleOutput2: { type: String, required: true },
    hiddenInput1: { type: String, required: true },
    hiddenInput2: { type: String, required: true },
    hiddenInput3: { type: String, required: true },
    hiddenOutput1: { type: String, required: true },
    hiddenOutput2: { type: String, required: true },
    hiddenOutput3: { type: String, required: true },
    points: { type: Number, required: true}
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
