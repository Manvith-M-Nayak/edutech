const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Sender's ID
    senderName: { type: String, required: true }, // ✅ Sender's username
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Receiver's ID
    receiverName: { type: String, required: true }, // ✅ Receiver's username
    message: { type: String, required: true }, // ✅ Message content
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", MessageSchema);
