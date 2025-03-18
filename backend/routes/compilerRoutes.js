const express = require("express");
const fs = require("fs");
const { spawn } = require("child_process");
const User = require("../models/User");
const Question = require("../models/Question");

const router = express.Router();

// Map to store running processes by user ID
const runningProcesses = new Map();

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
 * Executes user-submitted code in C or Python, handling compilation (if needed) and execution.
 */
const executeCode = (code, language, inputs, userId) => {
    return new Promise((resolve) => {
        // Terminate any existing process for this user
        if (runningProcesses.has(userId)) {
            terminateProcess(userId);
        }

        const isWindows = process.platform === "win32";
        const filename = language === "C" ? `temp${userId}.c` : `temp${userId}.py`;
        let executable = language === "C" ? (isWindows ? `temp${userId}.exe` : `./temp${userId}.out`) : "python";

        // Write code to file
        fs.writeFileSync(filename, code);

        if (language === "C") {
            // Compile C code
            const compileProcess = spawn("gcc", [filename, "-o", isWindows ? `temp${userId}.exe` : `temp${userId}.out`]);
            let compileError = "";

            compileProcess.stderr.on("data", (data) => {
                compileError += data.toString();
            });

            compileProcess.on("exit", (exitCode) => {
                if (exitCode !== 0) {
                    // Clean up the source file
                    try { fs.unlinkSync(filename); } catch (err) { /* ignore */ }
                    // Sanitize error before returning
                    return resolve({ output: "Compilation Error: " + sanitizeErrorMessage(compileError.trim()), error: true });
                }
                // Run the compiled executable
                const runProcess = spawn(executable, [], { shell: true, stdio: ["pipe", "pipe", "pipe"] });
                // Store the process reference
                runningProcesses.set(userId, runProcess);
                handleProcess(runProcess, inputs, resolve, userId, language, filename);
            });
        } else {
            // Run Python code
            const runProcess = spawn("python", [filename], { stdio: ["pipe", "pipe", "pipe"] });
            // Store the process reference
            runningProcesses.set(userId, runProcess);
            handleProcess(runProcess, inputs, resolve, userId, language, filename);
        }
    });
};

/**
 * Terminates a running process by user ID
 */
const terminateProcess = (userId) => {
    if (runningProcesses.has(userId)) {
        const process = runningProcesses.get(userId);
        
        // Different termination methods based on platform
        if (process.platform === "win32") {
            spawn("taskkill", ["/pid", process.pid, "/f", "/t"]);
        } else {
            process.kill("SIGTERM");
        }
        
        // Clean up files
        try {
            fs.unlinkSync(`temp${userId}.py`);
        } catch (err) { /* ignore */ }
        
        try {
            fs.unlinkSync(`temp${userId}.c`);
        } catch (err) { /* ignore */ }
        
        try {
            const isWindows = process.platform === "win32";
            fs.unlinkSync(isWindows ? `temp${userId}.exe` : `temp${userId}.out`);
        } catch (err) { /* ignore */ }
        
        runningProcesses.delete(userId);
        return true;
    }
    return false;
};

/**
 * Handles input and output processing for the executed code.
 */
const handleProcess = (process, inputs, resolve, userId, language, filename) => {
    let output = "";
    let errorOutput = "";

    // Ensure inputs is an array
    if (!Array.isArray(inputs)) {
        inputs = [inputs];
    }
    
    // Write inputs to the process
    inputs.forEach(input => {
        process.stdin.write(input + "\n");
    });
    process.stdin.end();

    // Collect output
    process.stdout.on("data", (data) => {
        output += data.toString();
    });

    // Collect error output
    process.stderr.on("data", (data) => {
        errorOutput += data.toString();
    });

    // Handle process completion
    process.on("close", (exitCode) => {
        // Remove from running processes map
        runningProcesses.delete(userId);
        
        // Clean up files
        try { 
            fs.unlinkSync(filename);
            if (language === "C") {
                const isWindows = process.platform === "win32";
                fs.unlinkSync(isWindows ? `temp${userId}.exe` : `temp${userId}.out`);
            }
        } catch (err) { /* ignore cleanup errors */ }

        if (exitCode !== 0) {
            // Sanitize error before returning
            return resolve({ output: "Error: " + sanitizeErrorMessage(errorOutput.trim()), error: true });
        }
        resolve({ output: output.trim(), error: false });
    });

    // Handle process error
    process.on("error", (err) => {
        // Remove from running processes map
        runningProcesses.delete(userId);
        
        // Clean up files on error
        try { 
            fs.unlinkSync(filename);
            if (language === "C") {
                const isWindows = process.platform === "win32";
                fs.unlinkSync(isWindows ? `temp${userId}.exe` : `temp${userId}.out`);
            }
        } catch (err) { /* ignore cleanup errors */ }

        // Sanitize error message before returning
        resolve({ output: "Execution Error: " + sanitizeErrorMessage(err.message), error: true });
    });
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
        
        const terminated = terminateProcess(userId);
        
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
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }
        
        const user = await User.findById(userId);
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
            // Add points
            user.totalPoints += question.points;
            
            // Update streak if applicable
            const today = new Date().toISOString().split("T")[0];
            if (!user.lastStreakDate || user.lastStreakDate !== today) {
                user.streaks += 1;
                user.totalPoints += 1;
                user.lastStreakDate = today;
            }
            
            // Add the question to completed questions
            user.completedQuestions.push(questionId);
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
        
        const user = await User.findById(userId);
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