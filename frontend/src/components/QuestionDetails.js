import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./QuestionDetails.css"; // Import CSS file

const QuestionDetails = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solution, setSolution] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("C"); // Default language is C

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/questions/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch question details");
        }
        const data = await response.json();
        setQuestion(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/questions/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solution, language: selectedLanguage }),
      });

      const result = await response.json();
      alert(result.message);
    } catch (err) {
      console.error("Error submitting solution:", err);
    }
  };

  if (loading) return <p>Loading question...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="question-container">
      <Link to="/" className="back-link">← Back to Questions</Link>

      <h1 className="question-title">{question.title}</h1>
      <p className="question-description">{question.description}</p>

      <div className="dropdown-container">
        <label htmlFor="language-select">Select Language: </label>
        <select
          id="language-select"
          className="language-dropdown"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="C">C</option>
          <option value="Python">Python</option>
        </select>
      </div>

      <div className="question-example">
        <p><strong>Example Input:</strong> {question.exampleInput}</p>
        <p><strong>Example Output:</strong> {question.exampleOutput}</p>
      </div>

      <textarea
        className="solution-input"
        value={solution}
        onChange={(e) => setSolution(e.target.value)}
        placeholder={`Write your ${selectedLanguage} solution here...`}
      />

      <button className="submit-button" onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default QuestionDetails;
