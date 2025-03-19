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
            const response = await axios.post(`${import.meta.env.BACKEND_URL}/api/auth/login`, credentials);

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
        <div className="login-container">
            <div className="login-box">
                <h1>Login</h1>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                <p>
                    New user? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
