import React, { useState, useEffect } from "react";

const TeacherChat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [receiverId, setReceiverId] = useState(""); // ✅ Store receiver's ID
    const [users, setUsers] = useState([]); // ✅ List of available users

    const user = JSON.parse(localStorage.getItem("user"));
    const isTeacher = user?.isTeacher;
    const token = localStorage.getItem("authToken");

    // ✅ Fetch available users (students for teachers, teachers for students)
    useEffect(() => {
        if (!token) {
            console.error("❌ No token found in localStorage!");
            return;
        }

        fetch("http://localhost:5000/api/users", {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            console.log("📋 Fetched Users:", data); // ✅ Debugging log
            if (!Array.isArray(data)) {
                console.error("❌ Unexpected response format:", data);
                return;
            }
            const filteredUsers = data.filter(u => (isTeacher ? !u.isTeacher : u.isTeacher));
            setUsers(filteredUsers);
        })
        .catch(err => console.error("❌ Error fetching users:", err));
    }, []);

    // ✅ Fetch messages when a receiver is selected
    useEffect(() => {
        if (!receiverId) return;

        fetch(`http://localhost:5000/api/chat/${receiverId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            console.log("📩 Fetched Messages:", data); // ✅ Debugging log
            if (!data.success) {
                console.error("❌ Error fetching messages:", data.message);
                return;
            }
            setMessages(Array.isArray(data.messages) ? data.messages : []);
        })
        .catch(err => console.error("❌ Error fetching messages:", err));
    }, [receiverId]);

    // ✅ Handle sending messages
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!receiverId || !newMessage.trim()) {
            console.error("❌ Cannot send message: receiver or message is missing.");
            alert("Please select a recipient and enter a message.");
            return;
        }

        console.log("📤 Sending Message To:", receiverId, "Message:", newMessage);

        try {
            const response = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ receiverId, message: newMessage })
            });

            const data = await response.json();
            console.log("✅ Message Sent Response:", data);

            if (!data.success) {
                console.error("❌ Error sending message:", data.message);
                alert(`Error: ${data.message}`);
            } else {
                setMessages(prevMessages => [...prevMessages, data.newMessage]);
                setNewMessage("");
            }
        } catch (error) {
            console.error("❌ Error sending message:", error);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
            <h2>{isTeacher ? "Student Queries" : "Teacher Help"}</h2>

            {/* ✅ User Selection */}
            <select onChange={(e) => setReceiverId(e.target.value)} value={receiverId} style={{ width: "100%", padding: "8px", marginBottom: "10px" }}>
                <option value="">Select a {isTeacher ? "Student" : "Teacher"}</option>
                {users.map(user => (
                    <option key={user._id} value={user._id}>{user.username}</option>
                ))}
            </select>

            <div style={{ maxHeight: "300px", overflowY: "auto", borderBottom: "1px solid #ccc", marginBottom: "10px" }}>
                {messages.length > 0 ? messages.map((msg, index) => (
                    msg && msg.sender ? (
                        <div key={index} style={{
                            marginBottom: "8px",
                            padding: "5px",
                            backgroundColor: String(msg.sender) === String(user.id) ? "#d1e7fd" : "#f1f1f1",
                            borderRadius: "5px"
                        }}>
                            <strong>{msg.senderName || "Unknown"}:</strong> {msg.message}
                        </div>
                    ) : (
                        <div key={index} style={{ color: "red" }}>⚠️ Error: Invalid Message</div>
                    )
                )) : <p>No messages yet.</p>}
            </div>

            <form onSubmit={sendMessage}>
                <input type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} required style={{ width: "80%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
                <button type="submit" style={{ padding: "8px", marginLeft: "5px", borderRadius: "5px", backgroundColor: "#4a54eb", color: "white", border: "none" }}>Send</button>
            </form>
        </div>
    );
};

export default TeacherChat;
    