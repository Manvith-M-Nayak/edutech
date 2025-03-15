const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🔐 Middleware: Verify User Token
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("🔍 Received Auth Header:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.error("❌ No valid token provided!");
            return res.status(401).json({ error: "Unauthorized: No token provided." });
        }

        const token = authHeader.split(" ")[1];
        console.log("🔑 Extracted Token:", token);

        if (!process.env.JWT_SECRET) {
            console.error("❌ JWT_SECRET is missing in environment variables!");
            return res.status(500).json({ error: "Internal server error: Missing JWT secret." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token Verified:", decoded);

        if (!decoded || !decoded.id) {
            console.error("❌ Invalid token payload!");
            return res.status(403).json({ error: "Forbidden: Invalid token data." });
        }

        req.user = decoded; // Attach user data to request
        next();
    } catch (err) {
        console.error("❌ Token verification failed:", err);

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Session expired. Please log in again." });
        }

        return res.status(403).json({ error: "Forbidden: Invalid or expired token." });
    }
};

// 🔐 Middleware: Verify Admin Token
const verifyAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("🔍 Received Admin Auth Header:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.error("❌ No valid admin token provided!");
            return res.status(403).json({ error: "Forbidden: No token provided." });
        }

        const token = authHeader.split(" ")[1];
        console.log("🔑 Extracted Admin Token:", token);

        if (!process.env.JWT_SECRET) {
            console.error("❌ JWT_SECRET is missing in environment variables!");
            return res.status(500).json({ error: "Internal server error: Missing JWT secret." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Admin Token Verified:", decoded);

        if (!decoded || !decoded.id) {
            console.error("❌ Invalid admin token payload!");
            return res.status(403).json({ error: "Forbidden: Invalid token data." });
        }

        // 🔍 Fetch user from database
        const user = await User.findById(decoded.id);
        if (!user) {
            console.error("❌ Admin user not found!");
            return res.status(404).json({ error: "User not found." });
        }

        if (!user.isAdmin) {
            console.error("❌ User is not an admin!");
            return res.status(403).json({ error: "Forbidden: Admins only." });
        }

        req.user = user; // Attach admin user data to request
        next();
    } catch (err) {
        console.error("❌ Admin token verification failed:", err);

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Session expired. Please log in again." });
        }

        return res.status(403).json({ error: "Forbidden: Invalid or expired token." });
    }
};

module.exports = { verifyToken, verifyAdmin };
