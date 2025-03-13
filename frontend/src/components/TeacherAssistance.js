import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherAssistance.css';

const TeacherAssistance = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'teacher',
      text: 'Hello! How can I help you with your programming questions today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, userMessage]);
    setMessage('');
    
    // Simulate teacher response after a short delay
    setTimeout(() => {
      const teacherMessage = {
        id: messages.length + 2,
        sender: 'teacher',
        text: "I've received your question. Let me analyze it and provide assistance shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, teacherMessage]);
    }, 1000);
  };

  return (
    <div className="assistance-container">
      <nav className="assistance-nav">
        <button onClick={() => navigate('/home')} className="back-button">
          ← Back to Home
        </button>
        <h1>Teacher Assistance</h1>
      </nav>
      
      <div className="assistance-content">
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`message ${msg.sender === 'user' ? 'user-message' : 'teacher-message'}`}
              >
                <div className="message-content">
                  <p>{msg.text}</p>
                  <span className="message-time">{msg.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
          
          <form className="message-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your question here..."
              className="message-input"
            />
            <button type="submit" className="send-button">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherAssistance; 