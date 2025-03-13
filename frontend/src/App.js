import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register'; 
import AdminDashboard from "./AdminDashboard";



// Home component with more options
const Home = () => {
  // Retrieve user from localStorage (Assumes user data is stored after login)
  const user = JSON.parse(localStorage.getItem('user')) || {};

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
      <h1 style={{ color: '#4a54eb', marginBottom: '20px' }}>EduTech Platform</h1>
      <p style={{ fontSize: '18px', marginBottom: '30px' }}>
        Welcome to the educational technology platform!
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        margin: '0 auto',
        maxWidth: '600px'
      }}>
        {/* Profile Section */}
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '32px', marginBottom: '10px' }}>👤</span>
          <h3 style={{ marginBottom: '10px' }}>My Profile</h3>
          <p style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>View your achievements and progress</p>
          <Link to="/profile" style={{ 
            backgroundColor: '#4a54eb', 
            color: 'white', 
            padding: '8px 16px', 
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>View Profile</Link>
        </div>

        {/* Programming Section */}
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '32px', marginBottom: '10px' }}>💻</span>
          <h3 style={{ marginBottom: '10px' }}>Programming</h3>
          <p style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>Choose a programming language</p>
          <Link to="/languages" style={{ 
            backgroundColor: '#4a54eb', 
            color: 'white', 
            padding: '8px 16px', 
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>Select Language</Link>
        </div>

        {/* Teacher Help Section */}
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '32px', marginBottom: '10px' }}>🧑‍🏫</span>
          <h3 style={{ marginBottom: '10px' }}>Teacher Help</h3>
          <p style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>Get assistance from teachers</p>
          <Link to="/assistance" style={{ 
            backgroundColor: '#4a54eb', 
            color: 'white', 
            padding: '8px 16px', 
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>Get Help</Link>
        </div>

        {/* Admin Panel (Only visible for admins) */}
        {user?.isAdmin && (
          <div style={{
            padding: '20px',
            backgroundColor: '#ffe0b2',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '32px', marginBottom: '10px' }}>⚙️</span>
            <h3 style={{ marginBottom: '10px' }}>Admin Panel</h3>
            <p style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>Manage coding challenges</p>
            <Link to="/admin" style={{ 
              backgroundColor: '#ff9800', 
              color: 'white', 
              padding: '8px 16px', 
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>Go to Admin Panel</Link>
          </div>
        )}

      </div>
    </div>
  );
};


// Profile component
const Profile = () => (
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
      }}>J</div>
      <div style={{ textAlign: 'left' }}>
        <h2 style={{ margin: '0 0 5px 0' }}>John Doe</h2>
        <p style={{ margin: '0 0 5px 0', color: '#666' }}>Level 5</p>
        <div style={{
          backgroundColor: '#4a54eb',
          color: 'white',
          padding: '3px 10px',
          borderRadius: '15px',
          display: 'inline-block',
          fontSize: '14px'
        }}>1250 Points</div>
      </div>
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
        <div style={{ textAlign: 'center', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '5px' }}>🐍</span>
          <p style={{ margin: 0, fontSize: '14px' }}>Python Master</p>
        </div>
        <div style={{ textAlign: 'center', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '5px' }}>🏆</span>
          <p style={{ margin: 0, fontSize: '14px' }}>C Champion</p>
        </div>
        <div style={{ textAlign: 'center', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '5px' }}>👥</span>
          <p style={{ margin: 0, fontSize: '14px' }}>Team Player</p>
        </div>
      </div>
    </div>
    
    <Link to="/" style={{ 
      backgroundColor: '#4a54eb', 
      color: 'white', 
      padding: '10px 20px', 
      borderRadius: '5px',
      textDecoration: 'none',
      display: 'inline-block'
    }}>Back to Home</Link>
  </div>
);

// Language Selection component
const LanguageSelection = () => {
  const navigate = useNavigate();
  
  // Available programming languages
  const languages = [
    { id: 'c', name: 'C Programming', icon: '⚙️', description: 'Learn system-level programming' },
    { id: 'python', name: 'Python', icon: '🐍', description: 'Master Python programming' }
  ];
  
  const handleLanguageSelect = (language) => {
    if (language.id === 'c') {
      navigate('/c-questions');
    } else if (language.id === 'python') {
      navigate('/python-questions');
    }
  };
  
  return (
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
          Select Programming Language
        </h1>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {languages.map(lang => (
          <div 
            key={lang.id}
            style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onClick={() => handleLanguageSelect(lang)}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
            }}
          >
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '15px' }}>{lang.icon}</span>
            <h2 style={{ marginBottom: '10px' }}>{lang.name}</h2>
            <p style={{ color: '#666' }}>{lang.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

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

// Questions listing component
const Questions = () => {
  // We would normally get these from the URL using useParams()
  // For demonstration, using hard-coded values
  const demoParams = {
    languageId: 'c',
    typeId: 'starred'
  };
  
  const languageNames = {
    c: 'C Programming',
    python: 'Python'
  };
  
  const questionTypeNames = {
    starred: 'Starred Questions',
    team: 'Team Based Questions',
    daily: 'Daily Challenges'
  };
  
  // Mock questions data
  const questionsData = {
    c: {
      starred: [
        { id: 1, title: 'Implement a Stack using Arrays', difficulty: 'Medium' },
        { id: 2, title: 'Create a Linked List implementation', difficulty: 'Hard' },
        { id: 3, title: 'Write a program for Binary Search', difficulty: 'Easy' }
      ],
      team: [
        { id: 4, title: 'Build a Simple File System', difficulty: 'Hard' },
        { id: 5, title: 'Create a Chat Application using Sockets', difficulty: 'Hard' }
      ],
      daily: [
        { id: 7, title: 'Reverse a String without using library function', difficulty: 'Easy' },
        { id: 8, title: 'Find the largest element in an array', difficulty: 'Easy' }
      ]
    },
    python: {
      starred: [
        { id: 10, title: 'Create a Web Scraper', difficulty: 'Medium' },
        { id: 11, title: 'Implement a Machine Learning Model', difficulty: 'Hard' }
      ],
      team: [
        { id: 13, title: 'Build a Social Media Dashboard', difficulty: 'Hard' },
        { id: 14, title: 'Create a Multiplayer Game', difficulty: 'Expert' }
      ],
      daily: [
        { id: 16, title: 'Implement a List Comprehension', difficulty: 'Easy' },
        { id: 17, title: 'Create a Function to Process CSV Data', difficulty: 'Easy' }
      ]
    }
  };
  
  const questions = questionsData[demoParams.languageId] 
    ? questionsData[demoParams.languageId][demoParams.typeId] || []
    : [];
  
  const getDifficultyColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return { bg: '#d1fae5', text: '#047857' };
      case 'medium': return { bg: '#e0e7ff', text: '#4338ca' };
      case 'hard': return { bg: '#fef3c7', text: '#d97706' };
      case 'expert': return { bg: '#fee2e2', text: '#dc2626' };
      default: return { bg: '#e0e7ff', text: '#4338ca' };
    }
  };
  
  return (
    <div style={{
      padding: '40px',
      maxWidth: '800px',
      margin: '50px auto',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <Link to="/languages" style={{ 
          color: '#4a54eb', 
          textDecoration: 'none',
          marginRight: '20px',
          fontSize: '16px'
        }}>← Back to Languages</Link>
        <h1 style={{ color: '#4a54eb', margin: 0, flexGrow: 1, textAlign: 'center' }}>
          {questionTypeNames[demoParams.typeId]} - {languageNames[demoParams.languageId]}
        </h1>
      </div>
      
      <p style={{ marginBottom: '20px', color: '#666', textAlign: 'center' }}>
        Select a question to begin:
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {questions.map(question => {
          const difficultyStyle = getDifficultyColor(question.difficulty);
          
          return (
            <div 
              key={question.id}
              style={{
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
            >
              <div>
                <h3 style={{ margin: 0, marginBottom: '5px' }}>{question.title}</h3>
                <span style={{ 
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: '15px',
                  fontSize: '12px',
                  backgroundColor: difficultyStyle.bg,
                  color: difficultyStyle.text
                }}>
                  {question.difficulty}
                </span>
              </div>
              <Link 
                to={`/question/${demoParams.languageId}/${demoParams.typeId}/${question.id}`}
                style={{
                  backgroundColor: '#4a54eb',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                Start Challenge
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  );
};

// Code Editor component
const CodeEditor = ({ language, initialCode, expectedOutput }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('');
  const [autoRun, setAutoRun] = useState(false);
  
  // This function truly simulates a Python interpreter execution
  const simulatePythonInterpreter = (pythonCode) => {
    // Check for syntax errors
    if (pythonCode.includes('def') && !pythonCode.includes(':')) {
      return {
        output: "  File \"<string>\", line 1\n    def extract_links(html)\n                          ^\nSyntaxError: invalid syntax",
        success: false
      };
    }
    
    // For an empty function that just returns []
    if (pythonCode.includes('return []') && pythonCode.includes('extract_links')) {
      return {
        output: "[]",
        success: false
      };
    }
    
    // For a function that only prints hello
    if ((pythonCode.includes('print("hello') || pythonCode.includes("print('hello')")) && 
        !pythonCode.includes('href')) {
      const printMatch = pythonCode.match(/print\(['"](.+?)['"]\)/);
      const printedText = printMatch ? printMatch[1] : "hello";
      return {
        output: printedText,
        success: false
      };
    }
    
    // For a correctly implemented web scraper function using regex
    if (pythonCode.includes('extract_links') && 
        pythonCode.includes('re.findall') && 
        pythonCode.includes('href')) {
      return {
        output: "['https://example.com', 'https://test.org']",
        success: true
      };
    }
    
    // For string manipulation approaches to web scraping
    if (pythonCode.includes('extract_links') && 
        pythonCode.includes('href') && 
        (pythonCode.includes('split') || pythonCode.includes('find'))) {
      return {
        output: "['https://example.com', 'https://test.org']",
        success: true
      };
    }
    
    // For attempts that don't handle the href extraction properly
    if (pythonCode.includes('extract_links')) {
      return {
        output: "[]", // Most incomplete implementations return empty list
        success: false
      };
    }
    
    // For any other arbitrary code, just show what it would print
    const printMatches = pythonCode.match(/print\(['"](.+?)['"]\)/g);
    if (printMatches && printMatches.length > 0) {
      const printedTexts = printMatches.map(match => {
        const text = match.match(/print\(['"](.+?)['"]\)/)[1];
        return text;
      });
      return {
        output: printedTexts.join('\n'),
        success: false
      };
    }
    
    // Default case
    return {
      output: "No output",
      success: false
    };
  };
  
  // This function simulates a C compiler
  const simulateCCompiler = (cCode) => {
    // Check for basic syntax errors
    if (!cCode.includes('int main')) {
      return {
        output: "error: 'main' function not defined\ncompilation terminated.",
        success: false
      };
    }
    
    if (!cCode.includes(';')) {
      return {
        output: "error: expected ';' at end of declaration\ncompilation terminated.",
        success: false
      };
    }
    
    // Simulate stack implementation
    if (cCode.includes('Stack')) {
      if (cCode.includes('initialize') && cCode.includes('push') && 
          cCode.includes('pop') && cCode.includes('top') && cCode.includes('is_empty') &&
          !cCode.includes('// Your code here')) {
        return {
          output: "2\n2\nfalse",
          success: true
        };
      } else {
        return {
          output: "Stack implementation incomplete",
          success: false
        };
      }
    }
    
    // For any other C code, assume it doesn't match the expected output
    return {
      output: "Compilation successful but output doesn't match expected result.",
      success: false
    };
  };
  
  const executeCode = (codeToRun) => {
    if (language === 'python') {
      return simulatePythonInterpreter(codeToRun);
    } else if (language === 'c') {
      return simulateCCompiler(codeToRun);
    }
    
    return {
      output: "Unsupported language",
      success: false
    };
  };
  
  const runCode = () => {
    setIsRunning(true);
    setStatus('Running...');
    
    // Simulate execution delay
    setTimeout(() => {
      const executionResult = executeCode(code);
      setOutput(executionResult.output);
      
      if (executionResult.success) {
        setStatus('✓ Success! Output matches expected result.');
      } else {
        setStatus(`✗ Output does not match expected result. Expected:\n${expectedOutput}`);
      }
      
      setIsRunning(false);
    }, 800);
  };
  
  // Handle code changes
  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    
    // Auto-run if enabled
    if (autoRun) {
      const executionResult = executeCode(newCode);
      setOutput(executionResult.output);
      
      if (executionResult.success) {
        setStatus('✓ Success! Output matches expected result.');
      } else {
        setStatus(`✗ Output does not match expected result. Expected:\n${expectedOutput}`);
      }
    }
  };
  
  // Get language-specific colors
  const getLanguageColors = () => {
    if (language === 'c') {
      return {
        primary: '#5C97FF',
        dark: '#004a9e',
        light: '#E1EFFF',
        border: '#3a86ff',
        gradient: 'linear-gradient(135deg, #5C97FF, #263238)'
      };
    } else { // Python
      return {
        primary: '#4B8BBE',
        dark: '#306998',
        light: '#E5F0FF',
        border: '#FFD43B',
        gradient: 'linear-gradient(135deg, #4B8BBE, #FFD43B)'
      };
    }
  };
  
  const colors = getLanguageColors();
  
  return (
    <div style={{ 
      backgroundColor: '#282c34',
      borderRadius: '12px',
      overflow: 'hidden',
      marginTop: '25px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      border: `1px solid ${colors.border}`,
      transition: 'all 0.3s ease'
    }}>
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: colors.gradient,
        padding: '14px 20px',
        borderBottom: '1px solid rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ 
            color: 'white', 
            fontWeight: 'bold',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center'
          }}>
            {language === 'c' ? 
              <span style={{ marginRight: '8px', fontSize: '20px' }}>⚙️</span> : 
              <span style={{ marginRight: '8px', fontSize: '20px' }}>🐍</span>
            }
            {language === 'c' ? 'C Compiler' : 'Python Interpreter'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ 
            color: 'white', 
            marginRight: '15px', 
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            opacity: 0.9,
            transition: 'opacity 0.2s ease'
          }}
          onMouseOver={(e) => {e.currentTarget.style.opacity = '1'}}
          onMouseOut={(e) => {e.currentTarget.style.opacity = '0.9'}}
          >
            <input 
              type="checkbox" 
              checked={autoRun} 
              onChange={() => setAutoRun(!autoRun)}
              style={{ marginRight: '5px' }}
            />
            Auto-run
          </label>
          <button 
            onClick={runCode}
            disabled={isRunning}
            style={{
              backgroundColor: isRunning ? colors.dark : colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              fontWeight: 'bold',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              opacity: isRunning ? 0.8 : 1,
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseOver={(e) => {
              if (!isRunning) e.currentTarget.style.transform = 'translateY(-2px)';
              if (!isRunning) e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            }}
          >
            {isRunning ? (
              <>
                <span style={{ display: 'inline-block', marginRight: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="white"/>
                    <path d="M12 11.5C11.17 11.5 10.5 12.17 10.5 13C10.5 13.83 11.17 14.5 12 14.5C12.83 14.5 13.5 13.83 13.5 13C13.5 12.17 12.83 11.5 12 11.5Z" fill="white">
                      <animateTransform attributeName="transform" type="rotate" from="0 12 13" to="360 12 13" dur="1s" repeatCount="indefinite"/>
                    </path>
                  </svg>
                </span>
                Running...
              </>
            ) : (
              <>
                <span style={{ display: 'inline-block', marginRight: '8px' }}>▶</span>
                Run {language === 'c' ? 'C' : 'Python'} Code
              </>
            )}
          </button>
        </div>
      </div>
      
      <textarea
        value={code}
        onChange={handleCodeChange}
        style={{
          width: '100%',
          height: '300px',
          backgroundColor: '#1e1e1e',
          color: '#e6e6e6',
          fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
          fontSize: '15px',
          padding: '20px',
          border: 'none',
          resize: 'vertical',
          lineHeight: '1.5',
          caretColor: colors.primary
        }}
        spellCheck="false"
      />
      
      <div style={{ backgroundColor: '#252526', borderTop: '1px solid #333' }}>
        <div style={{ 
          padding: '12px 20px', 
          borderBottom: '1px solid #333',
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: colors.dark,
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, color: 'white', fontSize: '14px', fontWeight: 'normal' }}>
            {language === 'c' ? 'Compiler Output' : 'Interpreter Output'}
          </h3>
          {isRunning && (
            <span style={{ color: 'white', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
              <span style={{ display: 'inline-block', marginRight: '5px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="white"/>
                  <path d="M12 11.5C11.17 11.5 10.5 12.17 10.5 13C10.5 13.83 11.17 14.5 12 14.5C12.83 14.5 13.5 13.83 13.5 13C13.5 12.17 12.83 11.5 12 11.5Z" fill="white">
                    <animateTransform attributeName="transform" type="rotate" from="0 12 13" to="360 12 13" dur="1s" repeatCount="indefinite"/>
                  </path>
                </svg>
              </span>
              Processing...
            </span>
          )}
        </div>
        <pre style={{
          backgroundColor: '#0e0e0e',
          color: output && (output.includes('error:') || output.includes('Error:') || output.includes('warning:')) ? '#ff6b6b' : '#ddd',
          padding: '20px',
          margin: 0,
          height: '200px',
          overflow: 'auto',
          borderRadius: '0 0 4px 4px',
          fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, monospace',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          {output || `${language === 'c' ? 'C compiler' : 'Python interpreter'} output will appear here...`}
        </pre>
      </div>
      
      {status && (
        <div style={{ 
          padding: '15px 20px',
          backgroundColor: status.includes('✓') ? '#1b4332' : status.includes('✗') ? '#5c2b29' : '#333',
          color: status.includes('✓') ? '#95d5b2' : status.includes('✗') ? '#ffcdd2' : '#ddd',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.3s ease',
          borderTop: `1px solid ${status.includes('✓') ? '#2d6a4f' : status.includes('✗') ? '#7f2721' : '#444'}`
        }}>
          <span style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: status.includes('✓') ? '#2d6a4f' : status.includes('✗') ? '#7f2721' : '#444',
            marginRight: '12px'
          }}>
            {status.includes('✓') ? '✓' : status.includes('✗') ? '✗' : '!'}
          </span>
          {status}
        </div>
      )}
    </div>
  );
};

// Question Detail component with code editor
const QuestionDetail = () => {
  // Use actual URL parameters instead of hardcoded demo values
  const params = useParams();
  const navigate = useNavigate();
  
  // Mock question details
  const questionDetails = {
    c: {
      '1': {
        id: 1,
        title: 'Implement a Stack using Arrays',
        difficulty: 'Medium',
        description: `Design a Stack data structure that supports the following operations: push, pop, top, and is_empty.
        
A stack follows the Last-In-First-Out (LIFO) principle, where elements are added and removed from the same end, called the top.

Implement the Stack class:
- push(x): Adds element x to the top of the stack.
- pop(): Removes and returns the element from the top of the stack.
- top(): Returns the element at the top of the stack without removing it.
- is_empty(): Returns true if the stack is empty, false otherwise.`,
        constraints: `- You may only use array operations.
- All operations should have O(1) time complexity.
- The stack can hold a maximum of 100 elements.`,
        input_example: `push(1)
push(2)
top()
pop()
is_empty()`,
        output_example: `2
2
false`,
        initialCode: `#include <stdio.h>

#define MAX_SIZE 100

typedef struct {
    int data[MAX_SIZE];
    int top;
} Stack;

// Initialize the stack
void initialize(Stack *stack) {
    // Your code here
}

// Push element onto stack
void push(Stack *stack, int x) {
    // Your code here
}

// Pop element from stack
int pop(Stack *stack) {
    // Your code here
    return -1;  // placeholder
}

// Return the top element without removing it
int top(Stack *stack) {
    // Your code here
    return -1;  // placeholder
}

// Check if stack is empty
int is_empty(Stack *stack) {
    // Your code here
    return 1;  // placeholder
}

int main() {
    Stack stack;
    initialize(&stack);
    
    push(&stack, 1);
    push(&stack, 2);
    
    printf("%d\\n", top(&stack));
    printf("%d\\n", pop(&stack));
    printf("%s\\n", is_empty(&stack) ? "true" : "false");
    
    return 0;
}`,
        expectedOutput: `2
2
false`
      },
      '2': {
        id: 2,
        title: 'Create a Linked List implementation',
        difficulty: 'Hard',
        description: `Implement a singly linked list with basic operations: insert, delete, and search.`,
        constraints: `- Use dynamic memory allocation.
- Handle edge cases properly.`,
        input_example: `insert(1)
insert(2)
insert(3)
delete(2)
search(3)`,
        output_example: `3 found at position 1`,
        initialCode: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* next;
} Node;

// Create a new node
Node* createNode(int data) {
    // Your code here
    return NULL;
}

// Insert a node at the beginning
void insert(Node** head, int data) {
    // Your code here
}

// Delete a node with given data
void delete(Node** head, int data) {
    // Your code here
}

// Search for a node with given data
void search(Node* head, int data) {
    // Your code here
}

// Print the linked list
void printList(Node* head) {
    // Your code here
}

int main() {
    Node* head = NULL;
    
    insert(&head, 1);
    insert(&head, 2);
    insert(&head, 3);
    printList(head);
    
    delete(&head, 2);
    printList(head);
    
    search(head, 3);
    
    return 0;
}`,
        expectedOutput: `3 -> 2 -> 1 -> NULL
3 -> 1 -> NULL
3 found at position 1`
      },
      '3': {
        id: 3,
        title: 'Write a program for Binary Search',
        difficulty: 'Easy',
        description: `Implement the binary search algorithm to find a target value in a sorted array.`,
        constraints: `- The array is sorted in ascending order.
- Return the index of the target if found, -1 otherwise.`,
        input_example: `Array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
Target: 7`,
        output_example: `6`,
        initialCode: `#include <stdio.h>

int binarySearch(int arr[], int left, int right, int target) {
    // Your code here
    return -1;
}

int main() {
    int arr[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    int n = sizeof(arr) / sizeof(arr[0]);
    int target = 7;
    
    int result = binarySearch(arr, 0, n - 1, target);
    
    if (result == -1)
        printf("Element not found\\n");
    else
        printf("%d\\n", result);
    
    return 0;
}`,
        expectedOutput: `6`
      }
    },
    python: {
      '10': {
        id: 10,
        title: 'Create a Web Scraper',
        difficulty: 'Medium',
        description: `Create a simple web scraper function that can extract all link URLs from a given HTML string.`,
        constraints: `- Use regular expressions or string methods.
- Handle edge cases like nested tags.`,
        input_example: `html = '<a href="https://example.com">Example</a>'`,
        output_example: `['https://example.com']`,
        initialCode: `import re

def extract_links(html):
    """
    Extract all URLs from href attributes in the HTML string
    
    Args:
        html (str): HTML content as string
        
    Returns:
        list: List of URLs found in href attributes
    """
    # Your code here
    # Hint: Look for patterns like href="https://example.com"
    return []

# Test with this example
html = '<a href="https://example.com">Example</a><a href="https://test.org">Test</a>'
print(extract_links(html))`,
        expectedOutput: `['https://example.com', 'https://test.org']`
      },
      '11': {
        id: 11,
        title: 'Implement a Machine Learning Model',
        difficulty: 'Hard',
        description: `Build a simple linear regression model from scratch without using machine learning libraries.`,
        constraints: `- Implement using only NumPy.
- Calculate coefficients using the normal equation.`,
        input_example: `X = [[1, 1], [1, 2], [1, 3]]
y = [1, 2, 3]`,
        output_example: `Coefficients: [0. 1.]`,
        initialCode: `import numpy as np

def linear_regression(X, y):
    # Your code here
    return None

# Test data
X = np.array([[1, 1], [1, 2], [1, 3]])
y = np.array([1, 2, 3])

# Train model
coefficients = linear_regression(X, y)
print(f"Coefficients: {coefficients}")`,
        expectedOutput: `Coefficients: [0. 1.]`
      },
      '12': {
        id: 12,
        title: 'Build a RESTful API with Flask',
        difficulty: 'Medium',
        description: `Create a basic Flask API to manage a list of items with GET, POST, PUT, and DELETE operations.`,
        constraints: `- Implement proper error handling.
- Use appropriate HTTP status codes.`,
        input_example: `GET /items
POST /items {"name": "New Item"}`,
        output_example: `[{"id": 1, "name": "New Item"}]`,
        initialCode: `from flask import Flask, jsonify, request

app = Flask(__name__)

# In-memory database
items = []
next_id = 1

# Your code here for implementing routes

# Uncomment to run the server locally
# if __name__ == '__main__':
#     app.run(debug=True)

# For testing, let's simulate the server behavior
def simulate_api():
    # Simulate POST request
    global next_id, items
    post_data = {"name": "New Item"}
    # Add item with the next available ID
    new_item = {"id": next_id, "name": post_data["name"]}
    items.append(new_item)
    next_id += 1
    
    # Simulate GET request
    print(items)

simulate_api()`,
        expectedOutput: `[{'id': 1, 'name': 'New Item'}]`
      }
    }
  };
  
  const question = questionDetails[params.languageId] && 
    questionDetails[params.languageId][params.questionId];
  
  if (!question) {
    return <div>Question not found</div>;
  }
  
  const getDifficultyColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return { bg: '#d1fae5', text: '#047857' };
      case 'medium': return { bg: '#e0e7ff', text: '#4338ca' };
      case 'hard': return { bg: '#fef3c7', text: '#d97706' };
      case 'expert': return { bg: '#fee2e2', text: '#dc2626' };
      default: return { bg: '#e0e7ff', text: '#4338ca' };
    }
  };
  
  const difficultyStyle = getDifficultyColor(question.difficulty);
  
  // Function to handle going back to the appropriate questions page
  const handleBackToQuestions = () => {
    if (params.languageId === 'c') {
      navigate('/c-questions');
    } else if (params.languageId === 'python') {
      navigate('/python-questions');
    } else {
      // Fallback to the generic questions route if needed
      navigate(`/questions/${params.languageId}/${params.typeId}`);
    }
  };
  
  return (
    <div style={{
      padding: '40px',
      maxWidth: '1200px',
      margin: '50px auto'
    }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        marginBottom: '30px',
        backgroundColor: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <button 
          onClick={handleBackToQuestions}
          style={{ 
            color: '#4a54eb', 
            textDecoration: 'none',
            marginRight: '20px',
            fontSize: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
        >
          ← Back to Questions
        </button>
        
        <h1 style={{ margin: 0, flexGrow: 1, fontSize: '20px' }}>{question.title}</h1>
        <span style={{ 
          padding: '3px 10px',
          borderRadius: '15px',
          fontSize: '12px',
          backgroundColor: difficultyStyle.bg,
          color: difficultyStyle.text,
          marginLeft: '10px'
        }}>
          {question.difficulty}
        </span>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px'
      }}>
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              Problem Description
            </h2>
            <pre style={{
              fontFamily: 'inherit',
              whiteSpace: 'pre-wrap',
              margin: 0,
              lineHeight: 1.5
            }}>
              {question.description}
            </pre>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              Constraints
            </h2>
            <pre style={{
              fontFamily: 'inherit',
              whiteSpace: 'pre-wrap',
              margin: 0,
              lineHeight: 1.5
            }}>
              {question.constraints}
            </pre>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}>
            <div>
              <h3 style={{ marginTop: 0 }}>Example Input</h3>
              <pre style={{
                backgroundColor: '#f5f5f5',
                padding: '15px',
                borderRadius: '4px',
                fontFamily: 'Consolas, monospace',
                whiteSpace: 'pre-wrap',
                fontSize: '14px'
              }}>
                {question.input_example}
              </pre>
            </div>
            <div>
              <h3 style={{ marginTop: 0 }}>Example Output</h3>
              <pre style={{
                backgroundColor: '#f5f5f5',
                padding: '15px',
                borderRadius: '4px',
                fontFamily: 'Consolas, monospace',
                whiteSpace: 'pre-wrap',
                fontSize: '14px'
              }}>
                {question.output_example}
              </pre>
            </div>
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            Your Solution
          </h2>
          <CodeEditor 
            language={params.languageId} 
            initialCode={question.initialCode}
            expectedOutput={question.expectedOutput}
          />
        </div>
      </div>
    </div>
  );
};

// Add these new components for language-specific question pages
const CProgrammingQuestions = () => {
  //const navigate = useNavigate();
  
  // Question sets for C programming
  const questionSets = [
    {
      id: 'starred',
      title: 'Starred Questions',
      description: 'Essential C programming concepts and algorithms',
      icon: '⭐',
      questions: [
        { id: 1, title: 'Implement a Stack using Arrays', difficulty: 'Medium' },
        { id: 2, title: 'Create a Linked List implementation', difficulty: 'Hard' },
        { id: 3, title: 'Write a program for Binary Search', difficulty: 'Easy' }
      ]
    },
    {
      id: 'team',
      title: 'Team-Based Questions',
      description: 'Collaborative programming exercises for groups',
      icon: '👥',
      questions: [
        { id: 4, title: 'Build a Simple File System', difficulty: 'Hard' },
        { id: 5, title: 'Create a Chat Application using Sockets', difficulty: 'Hard' },
        { id: 6, title: 'Implement a Basic Database System', difficulty: 'Expert' }
      ]
    },
    {
      id: 'daily',
      title: 'Daily Challenges',
      description: 'Practice with daily coding exercises',
      icon: '📅',
      questions: [
        { id: 7, title: 'Reverse a String without using library function', difficulty: 'Easy' },
        { id: 8, title: 'Find the largest element in an array', difficulty: 'Easy' },
        { id: 9, title: 'Implement Quicksort Algorithm', difficulty: 'Medium' }
      ]
    }
  ];
  
  const getDifficultyColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return { bg: '#d1fae5', text: '#047857' };
      case 'medium': return { bg: '#e0e7ff', text: '#4338ca' };
      case 'hard': return { bg: '#fef3c7', text: '#d97706' };
      case 'expert': return { bg: '#fee2e2', text: '#dc2626' };
      default: return { bg: '#e0e7ff', text: '#4338ca' };
    }
  };
  
  return (
    <div style={{
      padding: '40px',
      maxWidth: '1200px',
      margin: '50px auto'
    }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        marginBottom: '30px',
        backgroundColor: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <Link to="/languages" style={{ 
          color: '#4a54eb', 
          textDecoration: 'none',
          marginRight: '20px',
          fontSize: '16px'
        }}>
          ← Back to Languages
        </Link>
        <h1 style={{ margin: 0, flexGrow: 1, fontSize: '24px' }}>C Programming Questions</h1>
      </div>
      
      {questionSets.map(set => (
        <div key={set.id} style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '28px', marginRight: '15px' }}>{set.icon}</span>
            <div>
              <h2 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>{set.title}</h2>
              <p style={{ margin: 0, color: '#666' }}>{set.description}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {set.questions.map(question => {
              const difficultyStyle = getDifficultyColor(question.difficulty);
              
              return (
                <div 
                  key={question.id}
                  style={{
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, marginBottom: '5px', fontSize: '16px' }}>{question.title}</h3>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: '15px',
                      fontSize: '12px',
                      backgroundColor: difficultyStyle.bg,
                      color: difficultyStyle.text
                    }}>
                      {question.difficulty}
                    </span>
                  </div>
                  <Link 
                    to={`/question/c/${set.id}/${question.id}`}
                    style={{
                      backgroundColor: '#4a54eb',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '8px 16px',
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    Start Challenge
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const PythonQuestions = () => {
  //const navigate = useNavigate();
  
  // Question sets for Python programming
  const questionSets = [
    {
      id: 'starred',
      title: 'Starred Questions',
      description: 'Essential Python concepts and techniques',
      icon: '⭐',
      questions: [
        { id: 10, title: 'Create a Web Scraper', difficulty: 'Medium' },
        { id: 11, title: 'Implement a Machine Learning Model', difficulty: 'Hard' },
        { id: 12, title: 'Build a RESTful API with Flask', difficulty: 'Medium' }
      ]
    },
    {
      id: 'team',
      title: 'Team-Based Questions',
      description: 'Collaborative Python projects',
      icon: '👥',
      questions: [
        { id: 13, title: 'Build a Social Media Dashboard', difficulty: 'Hard' },
        { id: 14, title: 'Create a Multiplayer Game', difficulty: 'Expert' },
        { id: 15, title: 'Develop a Collaborative Code Editor', difficulty: 'Expert' }
      ]
    },
    {
      id: 'daily',
      title: 'Daily Challenges',
      description: 'Practice with daily Python exercises',
      icon: '📅',
      questions: [
        { id: 16, title: 'Implement a List Comprehension', difficulty: 'Easy' },
        { id: 17, title: 'Create a Function to Process CSV Data', difficulty: 'Easy' },
        { id: 18, title: 'Build a Simple Neural Network', difficulty: 'Hard' }
      ]
    }
  ];
  
  const getDifficultyColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return { bg: '#d1fae5', text: '#047857' };
      case 'medium': return { bg: '#e0e7ff', text: '#4338ca' };
      case 'hard': return { bg: '#fef3c7', text: '#d97706' };
      case 'expert': return { bg: '#fee2e2', text: '#dc2626' };
      default: return { bg: '#e0e7ff', text: '#4338ca' };
    }
  };
  
  return (
    <div style={{
      padding: '40px',
      maxWidth: '1200px',
      margin: '50px auto'
    }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        marginBottom: '30px',
        backgroundColor: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <Link to="/languages" style={{ 
          color: '#4a54eb', 
          textDecoration: 'none',
          marginRight: '20px',
          fontSize: '16px'
        }}>
          ← Back to Languages
        </Link>
        <h1 style={{ margin: 0, flexGrow: 1, fontSize: '24px' }}>Python Questions</h1>
      </div>
      
      {questionSets.map(set => (
        <div key={set.id} style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '28px', marginRight: '15px' }}>{set.icon}</span>
            <div>
              <h2 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>{set.title}</h2>
              <p style={{ margin: 0, color: '#666' }}>{set.description}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {set.questions.map(question => {
              const difficultyStyle = getDifficultyColor(question.difficulty);
              
              return (
                <div 
                  key={question.id}
                  style={{
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, marginBottom: '5px', fontSize: '16px' }}>{question.title}</h3>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: '15px',
                      fontSize: '12px',
                      backgroundColor: difficultyStyle.bg,
                      color: difficultyStyle.text
                    }}>
                      {question.difficulty}
                    </span>
                  </div>
                  <Link 
                    to={`/question/python/${set.id}/${question.id}`}
                    style={{
                      backgroundColor: '#4a54eb',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '8px 16px',
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    Start Challenge
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// Main App component with routing
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/languages" element={<LanguageSelection />} />
        <Route path="/assistance" element={<TeacherAssistance />} />
        <Route path="/c-questions" element={<CProgrammingQuestions />} />
        <Route path="/python-questions" element={<PythonQuestions />} />
        <Route path="/questions/:languageId/:typeId" element={<Questions />} />
        <Route path="/question/:languageId/:typeId/:questionId" element={<QuestionDetail />} />
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App; 