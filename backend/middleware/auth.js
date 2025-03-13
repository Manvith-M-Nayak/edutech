const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // ✅ Ensure token exists and is properly formatted
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1]; // ✅ Extract token from "Bearer TOKEN"
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Verify token

        if (!decoded.id) {
            return res.status(403).json({ error: "Invalid token structure." });
        }

        req.user = decoded; // ✅ Attach decoded user data to request
        next(); // ✅ Move to the next middleware
    } catch (err) {
        console.error("Token verification failed:", err);

        // ✅ Handle expired token case separately
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Session expired. Please log in again." });
        }

        res.status(403).json({ error: "Invalid or expired token." });
    }
};

const verifyAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ error: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            return res.status(403).json({ error: "Invalid token structure." });
        }

        // ✅ Fetch user from database
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // ✅ Ensure user is an admin
        if (!user.isAdmin) {
            return res.status(403).json({ error: "Admins only!" });
        }

        req.user = user; // ✅ Attach user data to request
        next();
    } catch (error) {
        console.error("Admin verification failed:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Session expired. Please log in again." });
        }

        res.status(403).json({ error: "Invalid or expired token." });
    }
};

module.exports = { verifyToken, verifyAdmin };
