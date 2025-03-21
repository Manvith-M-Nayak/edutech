import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
            // Extract user data and token
            const { token, user } = response.data; // Ensure backend sends 'user' along with 'token'
            // Store both user and token in localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user)); // ✅ Store user data in localStorage
            console.log("User logged in:", user); // Debugging (Check if user contains 'isAdmin')
            navigate('/home'); // Redirect to Home
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-card">
                <div className="edutech-info">
                    <h1>EduTech</h1>
                    <p>
                        EduTech is a comprehensive learning platform that transforms education through the power of gamification. By incorporating elements such as leaderboards, achievements, streaks, and interactive challenges, it creates an engaging and competitive learning experience. This innovative approach not only makes learning fun but also enhances knowledge retention and problem-solving skills.
                    </p>
                </div>
                <div className="login-form-container">
                    <h2>Login</h2>
                    {error && <p className="error-message">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Email"
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">Login</button>
                    </form>
                    <div className="register-link">
                        <p>New user? <Link to="/register">Register here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;