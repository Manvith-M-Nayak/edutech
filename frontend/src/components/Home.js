import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // ✅ Memoizing user to prevent unnecessary re-renders
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem('user')) || {};
  }, []);

  // ✅ Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/users/leaderboard`);
        const data = await response.json();
        
        // ✅ Filter out teachers and admins
        const filteredLeaderboard = data.filter(u => !u.isTeacher && !u.isAdmin);
        setLeaderboard(filteredLeaderboard);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };
    fetchLeaderboard();
  }, []);

  // ✅ Check if user is a teacher or admin
  useEffect(() => {
    if (user?.isTeacher) setIsTeacher(true);
    if (user?.isAdmin) setIsAdmin(true);
  }, [user]);

  return (
    <div className="home-container">
      <div className="content-area">
        <h1 className="main-title">EduTech Platform</h1>
        <p className="main-description">Welcome to the educational technology platform!</p>
        
        <div className="grid-container">
          <div className="section-card">
            <span className="card-icon">👤</span>
            <h3 className="card-heading">Profile</h3>
            <p className="card-text">View your achievements and progress</p>
            <Link to="/profile" className="card-button">Go</Link>
          </div>
          
          <div className="section-card">
            <span className="card-icon">💻</span>
            <h3 className="card-heading">Programming</h3>
            <p className="card-text">Choose a programming language</p>
            <Link to="/languages" className="card-button">Go</Link>
          </div>

          {/* ✅ Dynamic Help Button for Teacher & Student */}
          <div className="section-card">
            <span className="card-icon">🧑‍🏫</span>
            <h3 className="card-heading">{isTeacher ? "Student Queries" : "Teacher Help"}</h3>
            <p className="card-text">{isTeacher ? "Answer student queries" : "Get assistance from teachers"}</p>
            <Link to="/chat" className="card-button">Go</Link>
          </div>

          {/* ✅ Show Admin Panel Only for Admin Users */}
          {isAdmin && (
            <div className="section-card admin-card">
              <span className="card-icon">⚙️</span>
              <h3 className="card-heading">Admin Panel</h3>
              <p className="card-text">Manage coding challenges</p>
              <Link to="/admin" className="card-button admin-button">Make questions</Link>
              <Link to="/submittedquestions" className="card-button admin-button">View Submissions</Link>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Leaderboard Section */}
      <div className="leaderboard">
        <h2 className="leaderboard-title">Leaderboard</h2>
        <ul className="leaderboard-list">
          {leaderboard.length > 0 ? leaderboard.map((user, index) => (
            <li key={user.username} className={`leaderboard-item ${index < 3 ? `top-${index + 1}` : ''}`}>
              <span className="rank-name">
                <span className="rank">#{user.totalPoints > 0 ? index + 1 : 'N/A'}</span>
                <span className="username">{user.username}</span>
              </span>
            </li>
          )) : <p className="no-data">No leaderboard data available</p>}
        </ul>
      </div>
    </div>
  );
};

export default Home;