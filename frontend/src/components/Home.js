import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <nav className="home-nav">
        <h1>EduTech Platform</h1>
        <button onClick={() => navigate('/profile')} className="nav-button">
          My Profile
        </button>
      </nav>
      
      <div className="home-content">
        <div className="options-grid">
          <div className="option-card" onClick={() => navigate('/profile')}>
            <i className="fas fa-user"></i>
            <h2>View Profile</h2>
            <p>Check your achievements, badges, and points</p>
          </div>
          
          <div className="option-card" onClick={() => navigate('/languages')}>
            <i className="fas fa-code"></i>
            <h2>Choose Language</h2>
            <p>Start learning C or Python</p>
          </div>
          
          <div className="option-card" onClick={() => navigate('/assistance')}>
            <i className="fas fa-hands-helping"></i>
            <h2>Teacher Assistance</h2>
            <p>Get help from our expert teachers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 