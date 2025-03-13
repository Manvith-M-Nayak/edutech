import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LanguageSelection.css';

const LanguageSelection = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [showQuestionTypes, setShowQuestionTypes] = useState(false);

  const languages = [
    {
      id: 'c',
      name: 'C Programming',
      image: '/images/c-logo.svg',
      description: 'Learn system programming with C'
    },
    {
      id: 'python',
      name: 'Python',
      image: '/images/python-logo.svg',
      description: 'Master Python programming'
    }
  ];

  const questionTypes = [
    {
      id: 'starred',
      name: 'Starred Questions',
      icon: '⭐',
      description: 'Curated questions marked as important'
    },
    {
      id: 'team',
      name: 'Team Based Questions',
      icon: '👥',
      description: 'Collaborate with others on problems'
    },
    {
      id: 'daily',
      name: 'Daily Challenges',
      icon: '📅',
      description: 'New challenges every day'
    }
  ];

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setTimeout(() => setShowQuestionTypes(true), 500);
  };

  const handleQuestionTypeSelect = (type) => {
    navigate(`/questions/${selectedLanguage.id}/${type.id}`);
  };

  return (
    <div className="language-container">
      <nav className="language-nav">
        <button onClick={() => navigate('/home')} className="back-button">
          ← Back to Home
        </button>
        <h1>Choose Your Path</h1>
      </nav>

      <div className="language-content">
        {!showQuestionTypes ? (
          <div className="language-grid">
            {languages.map(lang => (
              <div
                key={lang.id}
                className="language-card"
                onClick={() => handleLanguageSelect(lang)}
              >
                <img 
                  src={lang.image} 
                  alt={lang.name} 
                  className="language-image"
                  onError={(e) => {
                    // If SVG fails, try PNG as fallback
                    e.target.onerror = null;
                    e.target.src = `${lang.image.replace('.svg', '.png')}`;
                  }}
                />
                <h2>{lang.name}</h2>
                <p>{lang.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="question-types-container">
            <h2>Choose Question Type for {selectedLanguage.name}</h2>
            <div className="question-types-grid">
              {questionTypes.map(type => (
                <div
                  key={type.id}
                  className="question-type-card"
                  onClick={() => handleQuestionTypeSelect(type)}
                >
                  <span className="question-type-icon">{type.icon}</span>
                  <h3>{type.name}</h3>
                  <p>{type.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelection; 