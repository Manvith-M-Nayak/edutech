import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Get user ID from local storage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    if (parsedUser) setUserId(parsedUser.id);
  }, []);

  // Fetch questions that haven't been completed by the user
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Include userId as query parameter if available
        const url = userId 
          ? `${process.env.REACT_APP_BACKEND_URL}/api/questions?userId=${userId}`
          : `${process.env.REACT_APP_BACKEND_URL}/api/questions`;
          
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }

        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [userId]); // Re-fetch when userId changes

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return { bg: "#d1fae5", text: "#047857" };
      case "medium":
        return { bg: "#e0e7ff", text: "#4338ca" };
      case "hard":
        return { bg: "#fef3c7", text: "#d97706" };
      case "expert":
        return { bg: "#fee2e2", text: "#dc2626" };
      default:
        return { bg: "#e0e7ff", text: "#4338ca" };
    }
  };

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "800px",
        margin: "50px auto",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ color: "#4a54eb", textAlign: "center" }}>Available Questions</h1>
      
      <p style={{ marginBottom: "20px", color: "#666", textAlign: "center" }}>
        Select a question to begin:
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {questions.length > 0 ? (
          questions.map((question) => {
            const difficultyStyle = getDifficultyColor(question.difficulty);

            return (
              <div
                key={question._id}
                style={{
                  padding: "20px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
                }}
              >
                <div>
                  <h3 style={{ margin: 0, marginBottom: "5px" }}>{question.title}</h3>
                  <p style={{ margin: 0, color: "#555" }}>Points: {question.points}</p>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: "15px",
                      fontSize: "12px",
                      backgroundColor: difficultyStyle.bg,
                      color: difficultyStyle.text,
                    }}
                  >
                    {question.difficulty}
                  </span>
                </div>
                <Link
                  to={`/question/${question._id}`}
                  style={{
                    backgroundColor: "#4a54eb",
                    color: "white",
                    textDecoration: "none",
                    padding: "8px 16px",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  Solve Challenge
                </Link>
              </div>
            );
          })
        ) : (
          <p style={{ textAlign: "center", color: "#999" }}>
            {userId ? "You've completed all available questions!" : "No questions available."}
          </p>
        )}
      </div>
    </div>
  );
};

export default Questions;