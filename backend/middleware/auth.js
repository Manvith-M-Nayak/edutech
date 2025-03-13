const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyAdmin = async (req, res, next) => {
    try {
        // ✅ Extract token properly
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ message: "Access denied. No token provided" });
        }

        const token = authHeader.split(" ")[1]; // ✅ Extract token from "Bearer TOKEN"
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Verify token

        // ✅ Check if user exists in database
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Ensure the user is an admin
        if (!user.isAdmin) {
            return res.status(403).json({ message: "Admins only!" });
        }

        req.user = user; // ✅ Attach user to request
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = { verifyAdmin };
