import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isTeacher, setIsTeacher] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // ✅ Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/leaderboard');
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };
    fetchLeaderboard();
  }, []);

  // ✅ Check if user is a teacher
  useEffect(() => {
    if (user?.isTeacher) {
      setIsTeacher(true);
    }
  }, [user]);

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>EduTech Platform</h1>
        <p style={descriptionStyle}>
          Welcome to the educational technology platform!
        </p>
        <div style={gridContainerStyle}>
          {['Profile', 'Programming'].map((section, index) => (
            <div key={index} style={sectionCardStyle}>
              <span style={iconStyle}>{
                section === 'Profile' ? '👤' : '💻'
              }</span>
              <h3 style={headingStyle}>{section}</h3>
              <p style={textStyle}>
                {section === 'Profile' ? 'View your achievements and progress' :
                 'Choose a programming language'}
              </p>
              <Link to={section === 'Profile' ? '/profile' : '/languages'} style={buttonStyle}>Go</Link>
            </div>
          ))}

          {/* ✅ Dynamic Help Button for Teacher & Student */}
          <div style={sectionCardStyle}>
            <span style={iconStyle}>🧑‍🏫</span>
            <h3 style={headingStyle}>{isTeacher ? "Student Queries" : "Teacher Help"}</h3>
            <p style={textStyle}>
              {isTeacher ? "Answer student queries" : "Get assistance from teachers"}
            </p>
            <Link to="/chat" style={buttonStyle}>Go</Link>
          </div>

          {/* ✅ Show Admin Panel Only for Admin Users */}
          {user?.isAdmin && (
            <div style={{ ...sectionCardStyle, backgroundColor: '#ffe0b2' }}>
              <span style={iconStyle}>⚙️</span>
              <h3 style={headingStyle}>Admin Panel</h3>
              <p style={textStyle}>Manage coding challenges</p>
              <Link to="/admin" style={{ ...buttonStyle, backgroundColor: '#ff9800' }}>Go to Admin Panel</Link>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Leaderboard Section */}
      <div style={leaderboardStyle}>
        <h2 style={titleStyle}>Leaderboard</h2>
        <ul style={listStyle}>
          {leaderboard.length > 0 ? leaderboard.map((user, index) => (
            <li key={user.username} style={leaderboardItemStyle(index)}>
              <span>#{user.totalPoints > 0 ? index + 1 : 'N/A'} - {user.username}</span>
              <span>{user.totalPoints} pts</span>
            </li>
          )) : <p>No leaderboard data available</p>}
        </ul>
      </div>
    </div>
  );
};

// ✅ Styles
const containerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '40px',
  maxWidth: '1200px',
  margin: '50px auto',
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
  gap: '30px'
};

const contentStyle = { flex: 2, paddingRight: '20px' };
const titleStyle = { color: '#4a54eb', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' };
const descriptionStyle = { fontSize: '18px', marginBottom: '30px', lineHeight: '1.6', color: '#333' };
const gridContainerStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' };
const iconStyle = { fontSize: '40px', marginBottom: '10px' };
const headingStyle = { marginBottom: '10px', fontSize: '18px', fontWeight: '600' };
const textStyle = { marginBottom: '15px', fontSize: '14px', color: '#666', textAlign: 'center' };
const buttonStyle = { backgroundColor: '#4a54eb', color: 'white', padding: '10px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', transition: 'background-color 0.3s', textAlign: 'center', display: 'inline-block' };
const leaderboardStyle = { flex: 1, paddingLeft: '20px', borderLeft: '4px solid #ddd', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px' };
const listStyle = { listStyleType: 'none', padding: 0, width: '100%' };

const sectionCardStyle = {
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '10px',
  boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.3s ease'
};

const leaderboardItemStyle = (index) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '12px',
  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f1f1f1',
  borderRadius: '8px',
  marginBottom: '6px',
  fontWeight: '500',
  border: '1px solid #ddd'
});

export default Home;
