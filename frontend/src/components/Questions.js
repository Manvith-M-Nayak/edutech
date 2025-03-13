import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Questions.css';

const Questions = () => {
  const { languageId, typeId } = useParams();
  const navigate = useNavigate();
  
  // Map to display proper names
  const languages = {
    c: 'C Programming',
    python: 'Python'
  };
  
  const questionTypes = {
    starred: 'Starred Questions',
    team: 'Team Based Questions',
    daily: 'Daily Challenges'
  };
  
  // Mock data for questions based on language and type
  const mockQuestions = {
    c: {
      starred: [
        { id: 1, title: 'Implement a Stack using Arrays', difficulty: 'Medium' },
        { id: 2, title: 'Create a Linked List implementation', difficulty: 'Hard' },
        { id: 3, title: 'Write a program for Binary Search', difficulty: 'Easy' }
      ],
      team: [
        { id: 4, title: 'Build a Simple File System', difficulty: 'Hard' },
        { id: 5, title: 'Create a Chat Application using Sockets', difficulty: 'Hard' },
        { id: 6, title: 'Implement a Basic Database System', difficulty: 'Expert' }
      ],
      daily: [
        { id: 7, title: 'Reverse a String without using library function', difficulty: 'Easy' },
        { id: 8, title: 'Find the largest element in an array', difficulty: 'Easy' },
        { id: 9, title: 'Implement Quicksort Algorithm', difficulty: 'Medium' }
      ]
    },
    python: {
      starred: [
        { id: 10, title: 'Create a Web Scraper', difficulty: 'Medium' },
        { id: 11, title: 'Implement a Machine Learning Model', difficulty: 'Hard' },
        { id: 12, title: 'Build a RESTful API with Flask', difficulty: 'Medium' }
      ],
      team: [
        { id: 13, title: 'Build a Social Media Dashboard', difficulty: 'Hard' },
        { id: 14, title: 'Create a Multiplayer Game', difficulty: 'Expert' },
        { id: 15, title: 'Develop a Collaborative Code Editor', difficulty: 'Expert' }
      ],
      daily: [
        { id: 16, title: 'Implement a List Comprehension', difficulty: 'Easy' },
        { id: 17, title: 'Create a Function to Process CSV Data', difficulty: 'Easy' },
        { id: 18, title: 'Build a Simple Neural Network', difficulty: 'Hard' }
      ]
    }
  };
  
  const questions = mockQuestions[languageId]?.[typeId] || [];

  const handleStartChallenge = (questionId) => {
    navigate(`/question/${languageId}/${typeId}/${questionId}`);
  };

  return (
    <div className="questions-container">
      <nav className="questions-nav">
        <button onClick={() => navigate('/languages')} className="back-button">
          ← Back to Languages
        </button>
        <h1>{questionTypes[typeId]} - {languages[languageId]}</h1>
      </nav>
      
      <div className="questions-content">
        <div className="questions-header">
          <p>Select a question to begin:</p>
        </div>
        
        <div className="questions-list">
          {questions.map(question => (
            <div key={question.id} className="question-item">
              <div className="question-info">
                <h3>{question.title}</h3>
                <span className={`difficulty ${question.difficulty.toLowerCase()}`}>
                  {question.difficulty}
                </span>
              </div>
              <button 
                className="start-button"
                onClick={() => handleStartChallenge(question.id)}
              >
                Start Challenge
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Questions; 