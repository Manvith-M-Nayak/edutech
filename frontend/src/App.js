import React from 'react';
import { BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register'; 
import AdminDashboard from "./components/AdminDashboard";
import Profile from "./components/Profile";
import Home from "./components/Home";
import LanguageSelection from './components/LanguageSection';
import Questions from './components/Questions';
import QuestionDetails from './components/QuestionDetails';
import TeacherChat from "./components/TeacherChat";
import SubmittedQuestions from "./components/SubmittedQuestions";

// Language Selection component
// const LanguageSelection = () => {
//   const navigate = useNavigate();
//   const languages = [
//     { id: 'c', name: 'C Programming', icon: '⚙️', description: 'Learn system-level programming' },
//     { id: 'python', name: 'Python', icon: '🐍', description: 'Master Python programming' }
//   ];
  
//   const handleLanguageSelect = (language) => {
//     if (language.id === 'c') {
//       navigate('/c-questions');
//     } else if (language.id === 'python') {
//       navigate('/python-questions');
//     }
//   };
  
//   return (
//     <div style={{
//       padding: '40px',
//       maxWidth: '800px',
//       margin: '50px auto',
//       backgroundColor: 'white',
//       borderRadius: '8px',
//       boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//     }}>
//       <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
//         <Link to="/home" style={{ 
//           color: '#4a54eb', 
//           textDecoration: 'none',
//           marginRight: '20px',
//           fontSize: '16px'
//         }}>← Back to Home</Link>
//         <h1 style={{ color: '#4a54eb', margin: 0, flexGrow: 1, textAlign: 'center' }}>
//           Select Programming Language
//         </h1>
//       </div>
      
//       <div style={{ 
//         display: 'grid', 
//         gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//         gap: '20px'
//       }}>
//         {languages.map(lang => (
//           <div 
//             key={lang.id}
//             style={{
//               padding: '20px',
//               backgroundColor: '#f8f9fa',
//               borderRadius: '8px',
//               boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
//               textAlign: 'center',
//               cursor: 'pointer',
//               transition: 'transform 0.2s, box-shadow 0.2s'
//             }}
//             onClick={() => handleLanguageSelect(lang)}
//             onMouseOver={(e) => {
//               e.currentTarget.style.transform = 'translateY(-5px)';
//               e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
//             }}
//             onMouseOut={(e) => {
//               e.currentTarget.style.transform = 'translateY(0)';
//               e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
//             }}
//           >
//             <span style={{ fontSize: '48px', display: 'block', marginBottom: '15px' }}>{lang.icon}</span>
//             <h2 style={{ marginBottom: '10px' }}>{lang.name}</h2>
//             <p style={{ color: '#666' }}>{lang.description}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// Teacher Assistance component (placeholder)
const TeacherAssistance = () => (
  <div style={{
    padding: '40px',
    maxWidth: '800px',
    margin: '50px auto',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
      <Link to="/" style={{ 
        color: '#4a54eb', 
        textDecoration: 'none',
        marginRight: '20px',
        fontSize: '16px'
      }}>← Back to Home</Link>
      <h1 style={{ color: '#4a54eb', margin: 0, flexGrow: 1, textAlign: 'center' }}>
        Teacher Assistance
      </h1>
    </div>
    
    <div style={{ 
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '20px',
      height: '400px',
      marginBottom: '20px',
      overflow: 'auto'
    }}>
      <div style={{ 
        backgroundColor: '#e9ecef',
        padding: '15px',
        borderRadius: '18px',
        borderBottomLeftRadius: '4px',
        maxWidth: '70%',
        marginBottom: '15px'
      }}>
        <p style={{ margin: 0, marginBottom: '5px' }}>Hello! How can I help you with your programming questions?</p>
        <span style={{ fontSize: '12px', color: '#666', textAlign: 'right', display: 'block' }}>10:00 AM</span>
      </div>
    </div>
    
    <div style={{ display: 'flex' }}>
      <input 
        type="text" 
        placeholder="Type your question here..." 
        style={{
          flexGrow: 1,
          padding: '12px',
          borderRadius: '25px',
          border: '1px solid #ddd',
          fontSize: '16px',
          marginRight: '10px'
        }}
      />
      <button style={{
        backgroundColor: '#4a54eb',
        color: 'white',
        border: 'none',
        borderRadius: '25px',
        padding: '0 20px',
        fontSize: '16px',
        cursor: 'pointer'
      }}>
        Send
      </button>
    </div>
  </div>
);

// Main App component with routing
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/languages" element={<LanguageSelection />} />
        <Route path="/assistance" element={<TeacherAssistance />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/question/:id" element={<QuestionDetails />} />
        <Route path="/chat" element={<TeacherChat />} />
        <Route path="/submittedquestions" element={<SubmittedQuestions />} />
      </Routes> 
    </BrowserRouter>
  );
}

export default App; 