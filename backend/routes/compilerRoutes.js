const express = require("express");
const fs = require("fs");
const { spawn } = require("child_process");
const User = require("../models/User");
const Question = require("../models/Question");

const router = express.Router();

/**
 * Executes user-submitted code in C or Python, handling compilation (if needed) and execution.
 */
const executeCode = (code, language, inputs) => {
    return new Promise((resolve) => {
        const isWindows = process.platform === "win32";
        const filename = language === "C" ? "temp.c" : "temp.py";
        let executable = language === "C" ? (isWindows ? "temp.exe" : "./temp.out") : "python";

        fs.writeFileSync(filename, code);

        if (language === "C") {
            let compileProcess = spawn("gcc", [filename, "-o", isWindows ? "temp.exe" : "temp.out"]);
            let compileError = "";

            compileProcess.stderr.on("data", (data) => {
                compileError += data.toString();
            });

            compileProcess.on("exit", (exitCode) => {
                if (exitCode !== 0) {
                    return resolve({ output: "Compilation Error: " + compileError.trim(), error: true });
                }
                let runProcess = spawn(executable, [], { shell: true, stdio: ["pipe", "pipe", "pipe"] });
                handleProcess(runProcess, inputs, resolve);
            });
        } else {
            let runProcess = spawn("python", [filename], { stdio: ["pipe", "pipe", "pipe"] });
            handleProcess(runProcess, inputs, resolve);
        }
    });
};

/**
 * Handles input and output processing for the executed code.
 */
const handleProcess = (process, inputs, resolve) => {
    let output = "";
    let errorOutput = "";

    if (!Array.isArray(inputs)) {
        inputs = [inputs];
    }
    
    inputs.forEach(input => {
        process.stdin.write(input + "\n");
    });
    process.stdin.end();

    process.stdout.on("data", (data) => {
        output += data.toString();
    });

    process.stderr.on("data", (data) => {
        errorOutput += data.toString();
    });

    process.on("close", (exitCode) => {
        if (exitCode !== 0) {
            return resolve({ output: "Error: " + errorOutput.trim(), error: true });
        }
        resolve({ output: output.trim(), error: false });
    });

    process.on("error", (err) => {
        resolve({ output: "Execution Error: " + err.message, error: true });
    });
};

/**
 * Endpoint to test a given code snippet against provided example inputs and expected outputs.
 */
router.post("/run", async (req, res) => {
    try {
        const { code, language, inputs, expectedOutputs } = req.body;

        if (!code || !language || !Array.isArray(inputs) || !Array.isArray(expectedOutputs)) {
            return res.status(400).json({
                output: "Missing required parameters. Ensure 'code', 'language', 'inputs', and 'expectedOutputs' are provided.",
                error: true
            });
        }

        let exampleResults = [];

        for (let i = 0; i < inputs.length; i++) {
            const result = await executeCode(code, language, inputs[i]);
            const passed = result.output.trim() === expectedOutputs[i].trim();
            exampleResults.push({
                input: inputs[i],
                output: result.output,
                expected: expectedOutputs[i],
                passed,
                error: result.error ? result.output : null
            });
        }

        const allPassed = exampleResults.every(test => test.passed);

        return res.json({
            success: allPassed,
            exampleResults,
            message: allPassed ? "✅ All example test cases passed!" : "❌ Some test cases failed. Check errors in output.",
        });
    } catch (error) {
        console.error("Execution Error:", error);
        return res.status(500).json({ output: "Internal Server Error", details: error.message });
    }
});

/**
 * Endpoint to submit a solution for a coding question.
 * Checks both example and hidden test cases before awarding points.
 */
router.post("/submit", async (req, res) => {
    try {
        const { userId, questionId, code, language } = req.body;

        if (!userId || !questionId || !code || !language) {
            return res.status(400).json({ output: "Missing required parameters.", error: true });
        }

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Fetch test cases from the Question model
        const exampleInputs = [question.exampleInput1, question.exampleInput2];
        const expectedExampleOutputs = [question.exampleOutput1, question.exampleOutput2];
        const hiddenInputs = [question.hiddenInput1, question.hiddenInput2, question.hiddenInput3];
        const expectedHiddenOutputs = [question.hiddenOutput1, question.hiddenOutput2, question.hiddenOutput3];

        let exampleResults = [];
        let hiddenResults = true;

        // Run example test cases
        for (let i = 0; i < exampleInputs.length; i++) {
            const result = await executeCode(code, language, exampleInputs[i]);
            const passed = result.output.trim() === expectedExampleOutputs[i].trim();
            exampleResults.push({ 
                input: exampleInputs[i], 
                output: result.output, 
                expected: expectedExampleOutputs[i], 
                passed 
            });
        }

        // Run hidden test cases
        for (let i = 0; i < hiddenInputs.length; i++) {
            const result = await executeCode(code, language, hiddenInputs[i]);
            if (result.output.trim() !== expectedHiddenOutputs[i].trim()) {
                hiddenResults = false;
                break;
            }
        }
        
        const submissionPassed = exampleResults.every(test => test.passed) && hiddenResults;

        if (submissionPassed) {
            // Update user progress directly without using fetch
            user.totalPoints += question.points;
            
            // Get today's date
            const today = new Date().toISOString().split("T")[0];
            
            // Update streak if applicable
            if (!user.lastStreakDate || user.lastStreakDate !== today) {
                user.streaks += 1;
                user.lastStreakDate = today;
            }
            
            // Add the question to completed questions if not already completed
            if (!user.completedQuestions.includes(questionId)) {
                user.completedQuestions.push(questionId);
            }
            
            // Save the user
            await user.save();
        }

        return res.json({
            success: submissionPassed,
            passedAllTests: submissionPassed,
            exampleResults,
            hiddenResults,
            message: submissionPassed ? "✅ All test cases passed! Points awarded." : "❌ Some test cases failed.",
        });
    } catch (error) {
        console.error("Execution Error:", error);
        return res.status(500).json({ output: "Internal Server Error", details: error.message });
    }
});

/**
 * Updates user progress when a coding problem is successfully solved.
 */
router.post("/update-user-progress", async (req, res) => {
    try {
        const { userId, questionId, points, increaseStreak } = req.body;

        // Log the incoming request for debugging
        console.log("Received request to update user progress:", req.body);

        // Find the user by ID
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the question has already been completed
        if (user.completedQuestions.includes(questionId)) {
            return res.status(400).json({ message: "Question already completed" });
        }

        // Update total points
        user.totalPoints += points;

        // Get today's date
        const today = new Date().toISOString().split("T")[0];

        // Update streak if applicable
        if (increaseStreak && (!user.lastStreakDate || user.lastStreakDate !== today)) {
            user.streaks += 1;
            user.lastStreakDate = today;
        }

        // Add the question to completed questions
        user.completedQuestions.push(questionId);

        // Save the user
        await user.save();

        // Respond with the updated user progress
        res.json({ 
            message: "User progress updated successfully", 
            points: user.totalPoints, 
            streak: user.streaks 
        });
    } catch (error) {
        console.error("Error updating user progress:", error);
        res.status(500).json({ message: "Internal server error", details: error.message });
    }
});

module.exports = router;