import React, { useState } from "react";
import { Link } from "react-router-dom";

const TeacherAssistance = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  const sendMessage = async () => {
    const token = localStorage.getItem("token"); // Get token from localStorage

    if (!token) {
      setError("Error: No token found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Attach token properly
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setMessages([...messages, { text: message, sender: "You" }]);
      setMessage("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "50px auto", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
        <Link to="/" style={{ color: "#4a54eb", textDecoration: "none", marginRight: "20px", fontSize: "16px" }}>← Back to Home</Link>
        <h1 style={{ color: "#4a54eb", margin: 0, flexGrow: 1, textAlign: "center" }}>Teacher Assistance</h1>
      </div>

      <div style={{ backgroundColor: "#f8f9fa", borderRadius: "8px", padding: "20px", height: "400px", marginBottom: "20px", overflow: "auto" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ backgroundColor: msg.sender === "You" ? "#d1e7dd" : "#e9ecef", padding: "15px", borderRadius: "18px", borderBottomLeftRadius: msg.sender === "You" ? "18px" : "4px", maxWidth: "70%", marginBottom: "15px" }}>
            <p style={{ margin: 0, marginBottom: "5px" }}>{msg.text}</p>
            <span style={{ fontSize: "12px", color: "#666", textAlign: "right", display: "block" }}>{msg.sender}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex" }}>
        <input type="text" placeholder="Type your question here..." value={message} onChange={(e) => setMessage(e.target.value)} style={{ flexGrow: 1, padding: "12px", borderRadius: "25px", border: "1px solid #ddd", fontSize: "16px", marginRight: "10px" }} />
        <button onClick={sendMessage} style={{ backgroundColor: "#4a54eb", color: "white", border: "none", borderRadius: "25px", padding: "0 20px", fontSize: "16px", cursor: "pointer" }}>Send</button>
      </div>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default TeacherAssistance;
