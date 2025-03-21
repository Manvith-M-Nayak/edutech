import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            if (response.status === 201) {
                setSuccess('Registration successful! Redirecting to login...');
                setTimeout(() => navigate('/'), 1000); // Redirect to login after 1 second
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="register-page-container">
            <div className="register-card">
                <div className="edutech-info">
                    <h1>EduTech</h1>
                    <p>
                        EduTech is a comprehensive learning platform that transforms education through the power of gamification. By incorporating elements such as leaderboards, achievements, streaks, and interactive challenges, it creates an engaging and competitive learning experience. This innovative approach not only makes learning fun but also enhances knowledge retention and problem-solving skills.
                    </p>
                </div>
                <div className="register-form-container">
                    <h2>Register</h2>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="register-button">Register</button>
                    </form>
                    <div className="login-link">
                        <p>Already have an account? <Link to="/">Login here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;