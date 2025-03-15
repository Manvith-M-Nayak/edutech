const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth"); // ✅ Protect routes

// ✅ Fetch private messages between two users
router.get("/:receiverId", verifyToken, async (req, res) => {
    try {
        const { receiverId } = req.params;

        if (!req.user || !req.user._id) {
            console.error("❌ Unauthorized access: Invalid token.");
            return res.status(401).json({ success: false, message: "Unauthorized. Invalid token." });
        }

        console.log(`📩 Fetching messages between ${req.user._id} and ${receiverId}`);

        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: receiverId },
                { sender: receiverId, receiver: req.user._id }
            ]
        }).sort({ createdAt: 1 });

        console.log("✅ Messages Found:", messages.length);

        res.json({ success: true, messages: messages || [] }); // ✅ Always return an array
    } catch (error) {
        console.error("❌ Error fetching messages:", error);
        res.status(500).json({ success: false, message: "Internal server error", error });
    }
});

// ✅ Send a private message
router.post("/", verifyToken, async (req, res) => {
    try {
        const { receiverId, message } = req.body;

        if (!req.user || !req.user._id) {
            console.error("❌ Unauthorized message attempt.");
            return res.status(401).json({ success: false, message: "Unauthorized. Invalid token." });
        }

        if (!receiverId || !message.trim()) {
            return res.status(400).json({ success: false, message: "Receiver and message are required." });
        }

        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ success: false, message: "Receiver not found" });
        }

        const newMessage = new Message({
            sender: req.user._id, // ✅ Ensure correct sender ID
            senderName: req.user.username,
            receiver: receiverId,
            receiverName: receiver.username,
            message
        });

        await newMessage.save();

        console.log("📤 Message Sent:", newMessage);

        res.status(201).json({ success: true, message: "Message sent successfully", newMessage });
    } catch (error) {
        console.error("❌ Error sending message:", error);
        res.status(500).json({ success: false, message: "Internal server error", error });
    }
});

module.exports = router;
