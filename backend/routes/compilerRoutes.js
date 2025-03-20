const express = require("express");
const axios = require("axios");
const User = require("../models/User");
const Question = require("../models/Question");

const router = express.Router();

/**
 * Sanitizes error messages to remove file paths and names
 */
const sanitizeErrorMessage = (errorMsg) => {
    if (!errorMsg) return "";
    return errorMsg
        .replace(/in\s+['"]?[\/\\]?.*?['"]?:/gi, "in code:")
        .replace(/['"]?[\/\\]?.*?\.(?:py|c|exe|out)['"]?/gi, "code")
        .replace(/file\s+['"]?.*?['"]?/gi, "file")
        .replace(/['"]?temp\w+\.(py|c|exe|out)['"]?/g, "code")
        .replace(/line\s+(\d+)/gi, "line $1");
};

const Docker = require('dockerode');
const docker = new Docker();

const executeCode = async (code, language, inputs) => {
    try {
        // Map your language to the Docker image and command
        const languageMap = {
            "C": {
                image: "gcc",
                cmd: ["sh", "-c", `echo "${code}" > code.c && gcc code.c -o code && ./code`]
            },
            "Python": {
                image: "python",
                cmd: ["sh", "-c", `echo "${code}" > code.py && python code.py`]
            },
            "JavaScript": {
                image: "node",
                cmd: ["sh", "-c", `echo "${code}" > code.js && node code.js`]
            }
            // Add more mappings as needed
        };

        const langConfig = languageMap[language];
        if (!langConfig) {
            return { output: "Unsupported language: " + language, error: true };
        }

        // Create a container with the specified image and command
        const container = await docker.createContainer({
            Image: langConfig.image,
            Cmd: langConfig.cmd,
            Tty: false,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            OpenStdin: true,
            StdinOnce: true
        });

        // Start the container
        await container.start();

        // Attach to the container to get the output
        const stream = await container.attach({ stream: true, stdout: true, stderr: true });
        let output = '';
        stream.on('data', (chunk) => {
            output += chunk.toString();
        });

        // Wait for the container to finish execution
        await container.wait();

        // Remove the container after execution
        await container.remove();

        return { output: output.trim(), error: false };
    } catch (error) {
        console.error("Docker Execution Error:", error);
        return { output: "System Error: " + sanitizeErrorMessage(error.message), error: true };
    }
};

/**
 * Endpoint to run code against example test cases.
 */
router.post("/run", async (req, res) => {
    try {
        const { code, language, inputs, expectedOutputs, userId } = req.body;

        // Validate required parameters
        if (!code || !language || !Array.isArray(inputs) || !Array.isArray(expectedOutputs)) {
            return res.status(400).json({
                output: "Missing required parameters. Ensure 'code', 'language', 'inputs', and 'expectedOutputs' are provided.",
                error: true
            });
        }

        // Use temp ID if user is not logged in
        const userIdToUse = userId || "temp" + Date.now();
        
        // Run code against each test case
        let exampleResults = [];
        for (let i = 0; i < inputs.length; i++) {
            const result = await executeCode(code, language, [inputs[i]]);
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
        return res.status(500).json({ output: "Internal Server Error", details: sanitizeErrorMessage(error.message) });
    }
});

/**
 * Endpoint to submit a solution for a coding question.
 * Checks both example and hidden test cases before awarding points.
 */
router.post("/submit", async (req, res) => {
    try {
        const { userId, questionId, code, language } = req.body;
        
        // Validate required parameters
        if (!userId || !questionId || !code || !language) {
            return res.status(400).json({ message: "Missing required parameters" });
        }
        
        // Find the question and user
        const question = await Question.findById(questionId).exec();
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }
        
        const user = await User.findById(userId).exec();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Check if user has already completed this question
        const alreadyCompleted = user.completedQuestions.includes(questionId);
        if (alreadyCompleted) {
            return res.status(200).json({ 
                message: "You've already completed this question.", 
                passedAllTests: true,
                alreadySubmitted: true
            });
        }
        
        // Get test cases from the question
        const exampleInputs = [question.exampleInput1, question.exampleInput2];
        const expectedExampleOutputs = [question.exampleOutput1, question.exampleOutput2];
        const hiddenInputs = [question.hiddenInput1, question.hiddenInput2, question.hiddenInput3];
        const expectedHiddenOutputs = [question.hiddenOutput1, question.hiddenOutput2, question.hiddenOutput3];
        
        // Run example test cases
        let exampleResults = [];
        for (let i = 0; i < exampleInputs.length; i++) {
            const result = await executeCode(code, language, [exampleInputs[i]]);
            const passed = result.output.trim() === expectedExampleOutputs[i].trim();
            exampleResults.push({
                input: exampleInputs[i],
                output: result.output,
                expected: expectedExampleOutputs[i],
                passed
            });
        }
        
        // Check if all example tests passed
        const allExamplesPassed = exampleResults.every(test => test.passed);
        if (!allExamplesPassed) {
            return res.json({
                success: false,
                passedAllTests: false,
                exampleResults,
                message: "❌ Example test cases failed."
            });
        }
        
        // Run hidden test cases
        let hiddenResults = true;
        for (let i = 0; i < hiddenInputs.length; i++) {
            const result = await executeCode(code, language, [hiddenInputs[i]]);
            if (result.output.trim() !== expectedHiddenOutputs[i].trim()) {
                hiddenResults = false;
                break;
            }
        }
        
        // Create a new submission entry
        const newSubmission = {
            questionId: questionId,
            submission: code,
            language: language,
            points: hiddenResults ? question.points : 0,
            submittedAt: new Date()
        };
        
        // Add the submission to the user's questionSubmissions array
        user.questionSubmissions.push(newSubmission);
        
        // Update user progress if all tests passed
        if (hiddenResults) {
            user.totalPoints += question.points;
            const today = new Date().toISOString().split("T")[0];
            if (!user.lastStreakDate) {
                // First time user is answering a question
                user.streaks = 1;
                user.lastStreakDate = today;
            } else {
                const lastDate = new Date(user.lastStreakDate);
                const currentDate = new Date(today);

                // Calculate the difference in days
                const timeDiff = currentDate - lastDate;
                const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

                if (daysDiff === 1) {
                    // User answered a question the day after their last activity
                    user.streaks += 1;
                } else if (daysDiff > 1) {
                    // User missed a day or more, reset streak to 1
                    user.streaks = 1;
                } else if (daysDiff === 0) {
                    // Same day, don't increment streak
                    // No change to streak
                }

                user.lastStreakDate = today;
            }

            // Add bonus point for maintaining streak
            if (user.streaks > 0) {
                user.totalPoints += 1;
            }
        }
        
        // Save the user
        await user.save();
        
        return res.json({
            success: hiddenResults,
            passedAllTests: hiddenResults,
            exampleResults,
            message: hiddenResults 
                ? "✅ All test cases passed! Points awarded." 
                : "❌ Hidden test cases failed. Try a different approach.",
            submissionId: user.questionSubmissions[user.questionSubmissions.length - 1]._id
        });
    } catch (error) {
        console.error("Execution Error:", error);
        return res.status(500).json({ message: "Internal Server Error", details: sanitizeErrorMessage(error.message) });
    }
});

/**
 * Get user information by ID
 */
router.get("/users/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        
        const user = await User.findById(userId).exec();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Return user information (excluding sensitive data)
        return res.json({
            id: user._id,
            username: user.username,
            totalPoints: user.totalPoints,
            streaks: user.streaks,
            completedQuestions: user.completedQuestions,
            lastStreakDate: user.lastStreakDate
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;