const express = require("express");
const axios = require("axios");
const User = require("../models/User");
const Question = require("../models/Question");
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

// For Vercel, we need to use a different approach since Docker isn't available
// Using a code execution service option

// Use the /tmp directory which is writable in Vercel
const tempDir = process.env.NODE_ENV === 'production' 
    ? '/tmp/code_execution' 
    : path.resolve(process.cwd(), 'temp_execution');

// Create temp directory if it doesn't exist
if (!fs.existsSync(tempDir)) {
    try {
        fs.mkdirSync(tempDir, { recursive: true });
        console.log(`Created temp directory: ${tempDir}`);
    } catch (error) {
        console.error(`Failed to create temp directory: ${error.message}`);
    }
}

/**
 * Generate a safe filename based on userId and random string
 * @param {string} userId - User ID or temp ID
 * @returns {string} Safe filename
 */
const generateSafeFilename = (userId) => {
    const safeUserId = userId.replace(/[^a-zA-Z0-9]/g, '_');
    const randomString = crypto.randomBytes(8).toString('hex');
    return `${safeUserId}_${randomString}_${Date.now()}`;
};

/**
 * Execute code using child_process for local development
 * For production, we'd integrate with a code execution service
 */
const executeCode = async (code, language, inputs, userId) => {
    // In Vercel's production environment, we need an alternative approach
    if (process.env.NODE_ENV === 'production') {
        return await executeCodeServerless(code, language, inputs, userId);
    } else {
        // For local development, use a simplified approach with child_process
        return await executeCodeLocal(code, language, inputs, userId);
    }
};

/**
 * Execute code in Vercel's serverless environment
 * This uses child_process with strict timeouts and resource limits
 */
const executeCodeServerless = async (code, language, inputs, userId) => {
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    try {
        // Generate a safe, unique filename for this execution
        const safeFilename = generateSafeFilename(userId || 'anonymous');
        const filePath = path.join(tempDir, safeFilename);
        
        let cmd;
        
        // Prepare command based on language
        switch (language) {
            case "Python":
                fs.writeFileSync(`${filePath}.py`, code);
                // For Python, we can use the built-in Python
                cmd = `cd ${tempDir} && python ${safeFilename}.py`;
                break;
            case "C":
                fs.writeFileSync(`${filePath}.c`, code);
                // For C, we'd need to check if gcc is available
                // For Vercel, this won't work without special buildpacks
                return { 
                    output: "C compilation is not supported in this environment", 
                    error: true 
                };
            default:
                return { 
                    output: "Unsupported language: " + language, 
                    error: true 
                };
        }
        
        // Prepare input if provided
        if (inputs && inputs.length > 0) {
            const inputContent = inputs.join('\n');
            fs.writeFileSync(`${filePath}.input`, inputContent);
            cmd = `cd ${tempDir} && cat ${safeFilename}.input | ${cmd.split(' && ')[1]}`;
        }
        
        // Execute with timeout
        const { stdout, stderr } = await execPromise(cmd, { 
            timeout: 5000, // 5 seconds timeout
            maxBuffer: 1024 * 1024 // 1MB max buffer
        });
        
        // Clean up files
        try {
            if (fs.existsSync(`${filePath}.py`)) fs.unlinkSync(`${filePath}.py`);
            if (fs.existsSync(`${filePath}.c`)) fs.unlinkSync(`${filePath}.c`);
            if (fs.existsSync(`${filePath}.input`)) fs.unlinkSync(`${filePath}.input`);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch (err) {
            console.error("Cleanup error:", err);
        }
        
        return {
            output: stdout || stderr,
            error: !!stderr,
            exitCode: stderr ? 1 : 0
        };
    } catch (error) {
        console.error("Execution Error:", error);
        return { 
            output: "Execution Error: " + sanitizeErrorMessage(error.message), 
            error: true, 
            exitCode: 1 
        };
    }
};

/**
 * Execute code locally with child_process (for development)
 */
const executeCodeLocal = async (code, language, inputs, userId) => {
    const { spawn } = require('child_process');
    
    try {
        // Generate a safe, unique filename for this execution
        const safeFilename = generateSafeFilename(userId || 'anonymous');
        const filePath = path.join(tempDir, safeFilename);
        
        let process;
        let compileProcess;
        
        // Prepare based on language
        switch (language) {
            case "C":
                fs.writeFileSync(`${filePath}.c`, code);
                
                // First compile
                return new Promise((resolve) => {
                    compileProcess = spawn('gcc', [`${filePath}.c`, '-o', filePath]);
                    
                    let compileError = '';
                    compileProcess.stderr.on('data', (data) => {
                        compileError += data.toString();
                    });
                    
                    compileProcess.on('close', (compileCode) => {
                        if (compileCode !== 0) {
                            // Clean up files
                            try {
                                if (fs.existsSync(`${filePath}.c`)) fs.unlinkSync(`${filePath}.c`);
                            } catch (err) {
                                console.error("Cleanup error:", err);
                            }
                            
                            resolve({ 
                                output: sanitizeErrorMessage(compileError), 
                                error: true, 
                                exitCode: compileCode 
                            });
                            return;
                        }
                        
                        // Then execute
                        process = spawn(filePath);
                        handleExecution(process, inputs, filePath, resolve);
                    });
                });
                
            case "Python":
                fs.writeFileSync(`${filePath}.py`, code);
                process = spawn('python', [`${filePath}.py`]);
                return handleExecution(process, inputs, filePath);
                
            default:
                return { 
                    output: "Unsupported language: " + language, 
                    error: true 
                };
        }
    } catch (error) {
        console.error("Execution Error:", error);
        return { 
            output: "System Error: " + sanitizeErrorMessage(error.message), 
            error: true 
        };
    }
};

/**
 * Helper to handle process execution with input/output
 */
const handleExecution = (process, inputs, filePath) => {
    return new Promise((resolve) => {
        let output = '';
        let error = '';
        
        // Handle stdout
        process.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        // Handle stderr
        process.stderr.on('data', (data) => {
            error += data.toString();
        });
        
        // Send inputs if provided
        if (inputs && inputs.length > 0) {
            process.stdin.write(inputs.join('\n'));
            process.stdin.end();
        }
        
        // Handle process completion
        process.on('close', (code) => {
            // Clean up files
            try {
                const baseFileName = filePath.replace(/\.[^/.]+$/, "");
                if (fs.existsSync(`${baseFileName}.c`)) fs.unlinkSync(`${baseFileName}.c`);
                if (fs.existsSync(`${baseFileName}.py`)) fs.unlinkSync(`${baseFileName}.py`);
                if (fs.existsSync(baseFileName)) fs.unlinkSync(baseFileName);
            } catch (err) {
                console.error("Cleanup error:", err);
            }
            
            resolve({ 
                output: error || output, 
                error: code !== 0 || error.length > 0,
                exitCode: code
            });
        });
        
        // Handle timeouts
        setTimeout(() => {
            process.kill();
            resolve({ 
                output: "Execution timed out after 5 seconds", 
                error: true, 
                exitCode: 124 
            });
        }, 5000);
    });
};

/**
 * Periodically clean up any orphaned files
 */
setInterval(() => {
    try {
        const files = fs.readdirSync(tempDir);
        const now = Date.now();
        
        files.forEach(file => {
            const filePath = path.join(tempDir, file);
            const stats = fs.statSync(filePath);
            
            // Remove files older than 1 hour
            if (now - stats.mtime.getTime() > 60 * 60 * 1000) {
                fs.unlinkSync(filePath);
                console.log(`Cleaned up old file: ${file}`);
            }
        });
    } catch (error) {
        console.error("Error cleaning up temp files:", error);
    }
}, 30 * 60 * 1000); // Run every 30 minutes

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
            const result = await executeCode(code, language, [inputs[i]], userIdToUse);
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
            const result = await executeCode(code, language, [exampleInputs[i]], userId);
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
            const result = await executeCode(code, language, [hiddenInputs[i]], userId);
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