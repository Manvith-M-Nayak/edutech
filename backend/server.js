require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const { exec } = require("child_process");
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const questionRoutes = require('./routes/questionRoutes');
const compilerRoutes = require('./routes/compilerRoutes');
const chatRoutes = require('./routes/chatRoutes');
const submissions = require('./routes/submissions');
const app = express();

app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS for cross-origin requests

connectDB();

app.use('/api/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/api/users', leaderboardRoutes);
app.use('/api', questionRoutes);
app.use('/api', compilerRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', submissions);

function installGCC() {
    exec("gcc --version", (error, stdout, stderr) => {
        if (!error) {
            return;
        }
        // Detect OS and choose package manager
        exec("cat /etc/os-release", (err, osInfo) => {
            if (err) {
                console.error("Could not determine OS type. Install GCC manually.");
                return;
            }

            let installCommand = "";
            if (osInfo.includes("Ubuntu") || osInfo.includes("Debian")) {
                installCommand = "sudo apt update && sudo apt install gcc -y";
            } else if (osInfo.includes("CentOS") || osInfo.includes("RHEL")) {
                installCommand = "sudo yum install gcc -y";
            } else {
                console.error("Unsupported OS. Install GCC manually.");
                return;
            }

            // Execute installation command
            exec(installCommand, (installErr, installStdout, installStderr) => {
                if (installErr) {
                    console.error("Failed to install GCC:", installStderr);
                    return;
                }
            });
        });
    });
}

function installPython() {
    exec("python3 --version", (error, stdout, stderr) => {
        if (!error) {
            return;
        }

        exec("cat /etc/os-release", (err, osInfo) => {
            if (err) {
                console.error("Could not determine OS type. Install Python manually.");
                return;
            }

            let installCommand = "";
            if (osInfo.includes("Ubuntu") || osInfo.includes("Debian")) {
                installCommand = "sudo apt update && sudo apt install python3 -y";
            } else if (osInfo.includes("CentOS") || osInfo.includes("RHEL")) {
                installCommand = "sudo yum install python3 -y";
            } else {
                console.error("Unsupported OS. Install Python manually.");
                return;
            }

            // Execute the installation command
            exec(installCommand, (installErr, installStdout, installStderr) => {
                if (installErr) {
                    console.error("Failed to install Python:", installStderr);
                    return;
                }
            });
        });
    });
}

installGCC();
installPython();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
