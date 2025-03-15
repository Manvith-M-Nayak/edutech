// models/User.js - User Model
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        streaks: {
            type: Number,
            default: 0
        },
        leaderboardPosition: {
            type: Number,
            default: null
        },
        totalPoints: {
            type: Number,
            default: 0
        },
        level: {
            type: Number,
            default: 1
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isTeacher: {
            type: Boolean,
            default: false // ✅ By default, users are students; can be updated in MongoDB
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
