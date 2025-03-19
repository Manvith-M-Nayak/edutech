import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./QuestionDetails.css";

const QuestionDetails = () => {
  const { id: questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");
  const [output, setOutput] = useState("");
  const [exampleResults, setExampleResults] = useState([]);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    if (parsedUser) setUserId(parsedUser.id);
  }, []);

  useEffect(() => {
    if (!questionId) {
      setError("Invalid question ID");
      setLoading(false);
      return;
    }

    const fetchQuestion = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions/${questionId}`);
        if (!response.ok) throw new Error("Failed to fetch question");
        const data = await response.json();
        setQuestion(data);
        
        // Check if user has already completed this question
        if (userId) {
          const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setHasSubmitted(userData.completedQuestions.includes(questionId));
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId, userId]);

  const handleRun = async () => {
    if (!question || !code.trim()) {
      setOutput("Please write some code first.");
      return;
    }

    setOutput("Running example test cases...");
    setExampleResults([]);
    setSubmissionMessage("");
    setIsExecuting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          inputs: [question.exampleInput1, question.exampleInput2],
          expectedOutputs: [question.exampleOutput1, question.exampleOutput2],
          userId: userId || "temp" // Fallback for testing without login
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.output || "Failed to run code");
      }

      const data = await response.json();
      setOutput(data.message);
      setExampleResults(data.exampleResults || []);
    } catch (err) {
      setOutput(`Error running code: ${err.message}`);
      console.error("Error running code:", err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleTerminate = async () => {
    if (!userId && !localStorage.getItem("tempUserId")) {
      setOutput("Error: Cannot identify process to terminate.");
      return;
    }

    try {
      const userIdToUse = userId || localStorage.getItem("tempUserId") || "temp";
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/terminate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userIdToUse
        }),
      });

      const data = await response.json();
      setOutput(data.message);
      setIsExecuting(false);
    } catch (err) {
      console.error("Error terminating code:", err);
      setOutput(`Error terminating code: ${err.message}`);
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      setOutput("Error: User not logged in.");
      return;
    }

    if (!code.trim()) {
      setOutput("Please write some code first.");
      return;
    }

    try {
      setOutput("Submitting code...");
      setExampleResults([]);
      setSubmissionMessage("");
      setIsExecuting(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          questionId,
          code,
          language
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Submission failed");

      setOutput(data.message);
      setExampleResults(data.exampleResults || []);
      
      if (data.passedAllTests) {
        setHasSubmitted(true);
        setSubmissionMessage("✅ Submission successful! Progress updated.");
      } else {
        setSubmissionMessage("❌ Submission failed. Try again.");
      }
    } catch (err) {
      console.error("Error submitting:", err);
      setOutput(`Error submitting code: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Generate and store a temporary user ID for non-logged in users
  useEffect(() => {
    if (!userId) {
      const tempId = localStorage.getItem("tempUserId");
      if (!tempId) {
        const newTempId = "temp" + Date.now();
        localStorage.setItem("tempUserId", newTempId);
      }
    }
  }, [userId]);

  if (loading) return <p>Loading question details...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="question-details-container">
      {question ? (
        <>
          
          <div className="question-info-section">
            <h2 className="question-title">{question.title}</h2>
            
            <div className="question-metadata">
              <p className="question-description"><strong>Description:</strong> {question.description}</p>
              <p><strong>Difficulty:</strong> {question.difficulty}</p>
              <p><strong>Category:</strong> {question.category}</p>
              <p><strong>Points:</strong> {question.points}</p>
            </div>
            
            <div className="test-cases">
              <h3>Example Test Cases</h3>
              <div className="test-case">
                <p><strong>Input:</strong> {question.exampleInput1}</p>
                <p><strong>Expected Output:</strong> {question.exampleOutput1}</p>
              </div>
              <div className="test-case">
                <p><strong>Input:</strong> {question.exampleInput2}</p>
                <p><strong>Expected Output:</strong> {question.exampleOutput2}</p>
              </div>
            </div>
            
            {exampleResults.length > 0 && (
              <div className="output-section">
                <h3>Test Case Results:</h3>
                <ul className="results-list">
                  {exampleResults.map((result, index) => (
                    <li key={index} className={`result-item ${result.passed ? 'passed' : 'failed'}`}>
                      <p><strong>Input:</strong> {result.input}</p>
                      <p><strong>Your Output:</strong> {result.output}</p>
                      <p><strong>Expected Output:</strong> {result.expected}</p>
                      <p className={`result-status ${result.passed ? 'status-passed' : 'status-failed'}`}>
                        {result.passed ? "✅ Passed" : "❌ Failed"}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="code-editor-section">
            <div className="language-selector">
              <label htmlFor="language-select">Select Language:</label>
              <select 
                id="language-select"
                className="language-select"
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="Python">Python</option>
                <option value="C">C</option>
              </select>
            </div>
            
            <textarea
              className="code-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your code here..."
              spellCheck="false"
            />
            
            <div className="button-group">
              <button 
                className={`btn btn-run ${isExecuting ? 'disabled' : ''}`}
                onClick={handleRun} 
                disabled={isExecuting}
              >
                {isExecuting ? "Running..." : "Run Code"}
              </button>
              
              {isExecuting && (
                <button 
                  className="btn btn-terminate"
                  onClick={handleTerminate}
                >
                  Terminate Execution
                </button>
              )}
              
              <button 
                className={`btn btn-submit ${(hasSubmitted || isExecuting) ? 'disabled' : ''}`}
                onClick={handleSubmit} 
                disabled={hasSubmitted || isExecuting} 
              >
                {hasSubmitted ? "Already Submitted" : "Submit Code"}
              </button>
            </div>
            
            {output && (
              <div className="output-section">
                <h3>Output:</h3>
                <div className="output-text">{output}</div>
              </div>
            )}
            
            {submissionMessage && (
              <div className={`submission-message ${submissionMessage.includes("✅") ? "submission-success" : "submission-failed"}`}>
                {submissionMessage}
              </div>
            )}
          </div>
        </>
      ) : (
        <p>Question not found.</p>
      )}
    </div>
  );
};

export default QuestionDetails;