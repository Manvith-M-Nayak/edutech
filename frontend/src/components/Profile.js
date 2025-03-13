import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  
  // Mock data - replace with actual user data
  const userData = {
    name: "John Doe",
    points: 1250,
    level: 5,
    badges: [
      { id: 1, name: "Python Master", icon: "🐍" },
      { id: 2, name: "C Champion", icon: "🏆" },
      { id: 3, name: "Team Player", icon: "👥" },
    ],
    achievements: [
      { id: 1, name: "Completed 10 Daily Challenges", progress: 100 },
      { id: 2, name: "Solved 50 Problems", progress: 75 },
      { id: 3, name: "Team Project Expert", progress: 60 },
    ]
  };

  return (
    <div className="profile-container">
      <nav className="profile-nav">
        <button onClick={() => navigate('/home')} className="back-button">
          ← Back to Home
        </button>
        <h1>My Profile</h1>
      </nav>

      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar">
            {userData.name.charAt(0)}
          </div>
          <div className="profile-info">
            <h2>{userData.name}</h2>
            <p>Level {userData.level}</p>
            <div className="points-badge">
              {userData.points} Points
            </div>
          </div>
        </div>

        <div className="profile-sections">
          <section className="badges-section">
            <h3>Badges</h3>
            <div className="badges-grid">
              {userData.badges.map(badge => (
                <div key={badge.id} className="badge-card">
                  <span className="badge-icon">{badge.icon}</span>
                  <p>{badge.name}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="achievements-section">
            <h3>Achievements</h3>
            {userData.achievements.map(achievement => (
              <div key={achievement.id} className="achievement-card">
                <div className="achievement-info">
                  <h4>{achievement.name}</h4>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
                <span className="progress-text">{achievement.progress}%</span>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile; 