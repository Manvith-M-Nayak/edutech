import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('authToken'); // ✅ Fetch token for authentication
    const userData = JSON.parse(localStorage.getItem('user'));
    const username = userData ? userData.username : null;
    
    useEffect(() => {
        if (!token || !username) {
            setError("User not logged in.");
            setLoading(false);
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setUser(data);
            }
            setLoading(false);
        })
        .catch(err => {
            setError("Failed to fetch user data.");
            setLoading(false);
        });
    }, [token,username]);

    if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;
    if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;

    return (
        <div style={{
            padding: '40px',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '50px auto',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <h1 style={{ color: '#4a54eb', marginBottom: '20px' }}>Profile Page</h1>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '30px'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: '#4a54eb',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    marginRight: '20px'
                }}>
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <div style={{ textAlign: 'left' }}>
                    <h2 style={{ margin: '0 0 5px 0' }}>{user.username}</h2>
                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>Level {user.level}</p>
                    <div style={{
                        backgroundColor: '#4a54eb',
                        color: 'white',
                        padding: '3px 10px',
                        borderRadius: '15px',
                        display: 'inline-block',
                        fontSize: '14px'
                    }}>{user.totalPoints} Points</div>
                </div>
            </div>

            <div style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'left'
            }}>
                <h3 style={{ marginBottom: '15px' }}>Achievements</h3>
                <p>Streaks: {user.streaks}🔥</p>
                <p>Leaderboard Position: #{user.leaderboardPosition || 'N/A'}</p>
            </div>

            <div style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'left'
            }}>
                <h3 style={{ marginBottom: '15px' }}>Badges</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '15px'
                }}>
                    {getBadges(user.totalPoints).map((badge, index) => (
                        <div key={index} style={{ textAlign: 'center', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
                            <span style={{ fontSize: '24px', display: 'block', marginBottom: '5px' }}>{badge.icon}</span>
                            <p style={{ margin: 0, fontSize: '14px' }}>{badge.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Link to="/home" style={{ 
                backgroundColor: '#4a54eb', 
                color: 'white', 
                padding: '10px 20px', 
                borderRadius: '5px',
                textDecoration: 'none',
                display: 'inline-block'
            }}>Back to Home</Link>
        </div>
    );
};

// ✅ Generate badges dynamically based on user points
const getBadges = (points) => {
    const badges = [];

    if (points >= 10) badges.push({ name: "Getting Started", icon: "🚀" });
    if (points >= 20) badges.push({ name: "Beginner", icon: "🌱" });
    if (points >= 30) badges.push({ name: "Novice", icon: "🔰" });
    if (points >= 40) badges.push({ name: "Explorer", icon: "🧭" });
    if (points >= 50) badges.push({ name: "Learner", icon: "📖" });
    if (points >= 60) badges.push({ name: "Apprentice", icon: "🛠️" });
    if (points >= 70) badges.push({ name: "Crazy", icon: "💻" });
    if (points >= 80) badges.push({ name: "Enthusiast", icon: "🔥" });
    if (points >= 90) badges.push({ name: "Coder", icon: "👨‍💻" });
    if (points >= 100) badges.push({ name: "Adventurer", icon: "🏕️" });
    if (points >= 120) badges.push({ name: "Ace", icon: "🎖️" });
    if (points >= 140) badges.push({ name: "Master", icon: "🏆" });
    if (points >= 160) badges.push({ name: "Expert", icon: "💡" });
    if (points >= 180) badges.push({ name: "Pro", icon: "🎯" })
    if (points >= 180) badges.push({ name: "Out of badges boss", icon: "🧠" })

    return badges.length ? badges : [{ name: "No Badges Yet", icon: "🚀" }];
};

export default Profile;
