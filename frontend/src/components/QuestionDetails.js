import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
        const response = await fetch(`http://localhost:5000/api/questions/${questionId}`);
        if (!response.ok) throw new Error("Failed to fetch question");
        const data = await response.json();
        setQuestion(data);
        
        // Check if user has already completed this question
        if (userId) {
          const userResponse = await fetch(`http://localhost:5000/api/users/${userId}`);
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
      const response = await fetch("http://localhost:5000/api/run", {
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
      const response = await fetch("http://localhost:5000/api/terminate", {
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
      
      const response = await fetch("http://localhost:5000/api/submit", {
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
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      {question ? (
        <div>
          <h2>{question.title}</h2>
          <p><strong>Description:</strong> {question.description}</p>
          <p><strong>Difficulty:</strong> {question.difficulty}</p>
          <p><strong>Category:</strong> {question.category}</p>
          <p><strong>Points:</strong> {question.points}</p>

          <h3>Example Test Cases</h3>
          <div style={{ backgroundColor: "#f5f5f5", padding: "10px", borderRadius: "4px", marginBottom: "15px" }}>
            <pre>Input: {question.exampleInput1} → Expected Output: {question.exampleOutput1}</pre>
            <pre>Input: {question.exampleInput2} → Expected Output: {question.exampleOutput2}</pre>
          </div>

          <h3>Your Code</h3>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your code here..."
            rows={10}
            cols={70}
            style={{ width: "100%", fontFamily: "monospace", padding: "10px" }}
          />

          <div style={{ marginTop: "15px" }}>
            <h3>Select Language</h3>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              style={{ padding: "5px", marginBottom: "15px" }}
            >
              <option value="Python">Python</option>
              <option value="C">C</option>
            </select>
          </div>

          <div style={{ marginTop: "20px", marginBottom: "20px" }}>
            <button 
              onClick={handleRun} 
              disabled={isExecuting}
              style={{ 
                marginRight: "10px", 
                padding: "8px 16px",
                backgroundColor: isExecuting ? "#cccccc" : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: isExecuting ? "not-allowed" : "pointer"
              }}
            >
              {isExecuting ? "Running..." : "Run Code"}
            </button>
            
            {isExecuting && (
              <button 
                onClick={handleTerminate}
                style={{ 
                  marginRight: "10px", 
                  padding: "8px 16px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Terminate Execution
              </button>
            )}
            
            <button 
              onClick={handleSubmit} 
              disabled={hasSubmitted || isExecuting} 
              style={{ 
                cursor: (hasSubmitted || isExecuting) ? "not-allowed" : "pointer",
                padding: "8px 16px",
                backgroundColor: (hasSubmitted || isExecuting) ? "#cccccc" : "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px"
              }}
            >
              {hasSubmitted ? "Already Submitted" : "Submit Code"}
            </button>
          </div>

          {output && (
            <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
              <h3>Output:</h3>
              <p>{output}</p>
            </div>
          )}

          {exampleResults.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h3>Test Case Results:</h3>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {exampleResults.map((result, index) => (
                  <li key={index} style={{ 
                    marginBottom: "15px", 
                    padding: "10px", 
                    border: `1px solid ${result.passed ? "#4CAF50" : "#f44336"}`,
                    borderRadius: "4px"
                  }}>
                    <p><strong>Input:</strong> {result.input}</p>
                    <p><strong>Your Output:</strong> {result.output}</p>
                    <p><strong>Expected Output:</strong> {result.expected}</p>
                    <p style={{ 
                      color: result.passed ? "#4CAF50" : "#f44336",
                      fontWeight: "bold" 
                    }}>
                      {result.passed ? "✅ Passed" : "❌ Failed"}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {submissionMessage && (
            <div style={{ 
              marginTop: "20px", 
              padding: "10px", 
              backgroundColor: submissionMessage.includes("✅") ? "#e8f5e9" : "#ffebee",
              borderRadius: "4px",
              fontWeight: "bold"
            }}>
              {submissionMessage}
            </div>
          )}
        </div>
      ) : (
        <p>Question not found.</p>
      )}
    </div>
  );
};

export default QuestionDetails;