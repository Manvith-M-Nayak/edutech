const express = require("express");
const fs = require("fs").promises;
const { spawn } = require("child_process");
const User = require("../models/User");
const Question = require("../models/Question");
const path = require("path");
const os = require("os");

const router = express.Router();

// Map to store running processes by user ID
const runningProcesses = new Map();
// Directory for temporary files
const tempDir = path.join(os.tmpdir(), "code-executor");

/**
 * Sanitizes error messages to remove file paths and names
 */
const sanitizeErrorMessage = (errorMsg) => {
    if (!errorMsg) return "";
    
    // Replace common patterns that might contain filenames/paths
    return errorMsg
        .replace(/in\s+['"]?[\/\\]?.*?['"]?:/gi, "in code:")
        .replace(/['"]?[\/\\]?.*?\.(?:py|c|exe|out)['"]?/gi, "code")
        .replace(/file\s+['"]?.*?['"]?/gi, "file")
        .replace(/['"]?temp\w+\.(py|c|exe|out)['"]?/g, "code")
        .replace(/line\s+(\d+)/gi, "line $1");
};

/**
 * Creates the temporary directory if it doesn't exist
 */
const ensureTempDir = async () => {
    try {
        await fs.mkdir(tempDir, { recursive: true });
    } catch (err) {
        console.error("Failed to create temp directory:", err);
    }
};

/**
 * Executes code with input handling and timeout
 */
const executeWithInputs = (command, args, inputs, timeout = 5000) => {
    return new Promise((resolve) => {
        let stdout = "";
        let stderr = "";
        
        const process = spawn(command, args);
        
        // Store process with ID for potential termination
        const processInfo = {
            process,
            pid: process.pid,
            command,
            args
        };
        
        // Write inputs to stdin
        if (inputs) {
            // Make sure inputs is an array
            const inputArray = Array.isArray(inputs) ? inputs : [inputs];
            
            // Write each input followed by newline
            for (const input of inputArray) {
                if (input && input.trim() !== "") {
                    process.stdin.write(input + "\n");
                }
            }
            process.stdin.end();
        } else {
            process.stdin.end();
        }
        
        // Collect stdout
        process.stdout.on("data", (data) => {
            stdout += data.toString();
        });
        
        // Collect stderr
        process.stderr.on("data", (data) => {
            stderr += data.toString();
        });
        
        // Set timeout
        const timeoutId = setTimeout(() => {
            process.kill();
            resolve({ 
                error: true, 
                stdout, 
                stderr: stderr || "Execution timed out after " + (timeout/1000) + " seconds" 
            });
        }, timeout);
        
        // Handle process completion
        process.on("close", (code) => {
            clearTimeout(timeoutId);
            resolve({
                error: code !== 0,
                stdout,
                stderr,
                exitCode: code
            });
        });
        
        // Handle process error
        process.on("error", (err) => {
            clearTimeout(timeoutId);
            resolve({
                error: true,
                stdout,
                stderr: err.message,
                exitCode: 1
            });
        });
        
        return processInfo;
    });
};

/**
 * Executes user-submitted code in C or Python, handling compilation (if needed) and execution.
 */
const executeCode = async (code, language, inputs, userId) => {
    await ensureTempDir();
    
    // Generate unique filenames using userId and timestamp to avoid collisions
    const timestamp = Date.now();
    const fileId = `${userId}_${timestamp}`;
    const filePath = path.join(tempDir, fileId);
    
    // Terminate any existing process for this user
    if (runningProcesses.has(userId)) {
        await terminateProcess(userId);
    }
    
    try {
        if (language === "C") {
            // Write C code to file
            const cFilePath = `${filePath}.c`;
            const outputPath = `${filePath}.out`;
            
            await fs.writeFile(cFilePath, code);
            
            // Compile C code with security flags
            const compileArgs = [cFilePath, "-o", outputPath, "-Wall", "-std=c99"];
            const compileResult = await executeWithInputs("gcc", compileArgs, null, 10000);
            
            if (compileResult.error) {
                // Clean up the source file
                await fs.unlink(cFilePath).catch(() => {});
                return { 
                    output: "Compilation Error: " + sanitizeErrorMessage(compileResult.stderr), 
                    error: true 
                };
            }
            
            // Make the output file executable on UNIX systems
            try {
                await fs.chmod(outputPath, 0o755);
            } catch (err) {
                // Ignore chmod errors on Windows
            }
            
            // Run the compiled executable with input
            const runResult = await executeWithInputs(outputPath, [], inputs, 5000);
            
            // Clean up files
            await Promise.all([
                fs.unlink(cFilePath).catch(() => {}),
                fs.unlink(outputPath).catch(() => {})
            ]);
            
            if (runResult.error) {
                return { 
                    output: "Execution Error: " + sanitizeErrorMessage(runResult.stderr), 
                    error: true 
                };
            }
            
            return { output: runResult.stdout.trim(), error: false };
            
        } else if (language === "Python") {
            // Write Python code to file
            const pyFilePath = `${filePath}.py`;
            await fs.writeFile(pyFilePath, code);
            
            // Run Python code with input
            const runResult = await executeWithInputs("python", [pyFilePath], inputs, 5000);
            
            // Clean up file
            await fs.unlink(pyFilePath).catch(() => {});
            
            if (runResult.error) {
                return { 
                    output: "Execution Error: " + sanitizeErrorMessage(runResult.stderr), 
                    error: true 
                };
            }
            
            return { output: runResult.stdout.trim(), error: false };
        } else {
            return { output: "Unsupported language: " + language, error: true };
        }
    } catch (err) {
        // Clean up any remaining files
        await fs.unlink(`${filePath}.c`).catch(() => {});
        await fs.unlink(`${filePath}.py`).catch(() => {});
        await fs.unlink(`${filePath}.out`).catch(() => {});
        
        return { 
            output: "System Error: " + sanitizeErrorMessage(err.message), 
            error: true 
        };
    }
};

/**
 * Terminates a running process by user ID
 */
const terminateProcess = async (userId) => {
    if (runningProcesses.has(userId)) {
        const processInfo = runningProcesses.get(userId);
        
        // Kill the process
        try {
            processInfo.process.kill();
        } catch (err) {
            console.error("Error killing process:", err);
        }
        
        runningProcesses.delete(userId);
        return true;
    }
    return false;
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
            const result = await executeCode(code, language, inputs[i], userIdToUse);
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
 * Endpoint to terminate a running code execution process.
 */
router.post("/terminate", async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        
        const terminated = await terminateProcess(userId);
        
        if (terminated) {
            return res.json({ message: "Code execution terminated successfully" });
        } else {
            return res.json({ message: "No running process found for this user" });
        }
    } catch (error) {
        console.error("Termination Error:", error);
        return res.status(500).json({ message: "Internal Server Error", details: sanitizeErrorMessage(error.message) });
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
            const result = await executeCode(code, language, exampleInputs[i], userId);
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
            const result = await executeCode(code, language, hiddenInputs[i], userId);
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

/**
 * Get information about running processes
 */
router.get("/status", async (req, res) => {
    try {
        const runningCount = runningProcesses.size;
        const runningUsers = Array.from(runningProcesses.keys());
        
        return res.json({
            runningCount,
            runningUsers
        });
    } catch (error) {
        console.error("Error getting status:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;