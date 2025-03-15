const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth"); // ✅ Protect routes

// ✅ Fetch private messages between two users
router.get("/:receiverId", verifyToken, async (req, res) => {
    try {
        const { receiverId } = req.params;
        const senderId = req.user.id;

        if (!senderId) {
            return res.status(401).json({ success: false, message: "Unauthorized. Invalid token." });
        }

        console.log(`📩 Fetching messages between ${senderId} and ${receiverId}`);

        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        })
        .sort({ createdAt: 1 })
        .populate("sender", "username")
        .populate("receiver", "username");

        res.json({ success: true, messages });
    } catch (error) {
        console.error("❌ Error fetching messages:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// ✅ Send a private message
router.post("/", verifyToken, async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user.id;
        const senderName = req.user.username;

        if (!senderId) {
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
            sender: senderId,
            senderName,
            receiver: receiverId,
            receiverName: receiver.username,
            message
        });

        await newMessage.save();

        res.status(201).json({ success: true, message: "Message sent successfully", newMessage });
    } catch (error) {
        console.error("❌ Error sending message:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;
