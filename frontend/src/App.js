import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
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
        <Route path="/questions" element={<Questions />} />
        <Route path="/question/:id" element={<QuestionDetails />} />
        <Route path="/chat" element={<TeacherChat />} />
        <Route path="/submittedquestions" element={<SubmittedQuestions />} />
      </Routes> 
    </BrowserRouter>
  );
}

export default App; 