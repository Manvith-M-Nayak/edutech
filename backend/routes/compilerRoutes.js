const express = require("express");
const fs = require("fs");
const { spawn } = require("child_process");

const router = express.Router();

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
        return res.status(500).json({ output: "Internal Server Error", details: error.message });
    }
});

router.post("/submit", async (req, res) => {
    try {
        const { code, language, exampleInputs, expectedExampleOutputs, hiddenInputs, expectedHiddenOutputs } = req.body;

        if (!code || !language || !Array.isArray(exampleInputs) || !Array.isArray(expectedExampleOutputs) ||
            !Array.isArray(hiddenInputs) || !Array.isArray(expectedHiddenOutputs)) {
            return res.status(400).json({
                output: "Missing required parameters. Ensure all inputs and expected outputs are provided.",
                error: true
            });
        }

        let exampleResults = [];
        let hiddenResults = true;

        for (let i = 0; i < exampleInputs.length; i++) {
            const result = await executeCode(code, language, [exampleInputs[i]]);
            const passed = result.output.trim() === expectedExampleOutputs[i].trim();
            exampleResults.push({
                input: exampleInputs[i],
                output: result.output,
                expected: expectedExampleOutputs[i],
                passed,
                error: result.error ? result.output : null
            });
        }

        for (let i = 0; i < hiddenInputs.length; i++) {
            const result = await executeCode(code, language, [hiddenInputs[i]]);
            if (result.output.trim() !== expectedHiddenOutputs[i].trim()) {
                hiddenResults = false;
                break;
            }
        }

        const submissionPassed = exampleResults.every(test => test.passed) && hiddenResults;

        return res.json({
            success: submissionPassed,
            exampleResults,
            hiddenResults,
            message: submissionPassed ? "✅ All test cases passed!" : "❌ Hidden test cases failed. Please retry.",
        });
    } catch (error) {
        console.error("Execution Error:", error);
        return res.status(500).json({ output: "Internal Server Error", details: error.message });
    }
});

module.exports = router;
