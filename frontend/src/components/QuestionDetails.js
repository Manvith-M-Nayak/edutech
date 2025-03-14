import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./QuestionDetails.css"; // Import CSS file

const QuestionDetails = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solution, setSolution] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("C"); // Default language
  const [output, setOutput] = useState(""); // Stores output or errors
  const [exampleResults, setExampleResults] = useState([]); // Stores example test case results
  //const [hiddenResults, setHiddenResults] = useState(null); // Stores hidden test case results

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

  const handleRun = async () => {
    setOutput("Running example test cases...");
    setExampleResults([]);

    try {
      const response = await fetch("http://localhost:5000/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: solution,
          language: selectedLanguage,
          inputs: [question.exampleInput1, question.exampleInput2],
          expectedOutputs: [question.exampleOutput1, question.exampleOutput2]
        }),
      });

      const result = await response.json();
      setOutput(result.message || result.output || "No output");
      setExampleResults(result.exampleResults || []);
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    }
  };

  const handleSubmit = async () => {
    setOutput("Running all test cases...");
    setExampleResults([]);
    //setHiddenResults(null);

    try {
      const response = await fetch("http://localhost:5000/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: solution,
          language: selectedLanguage,
          exampleInputs: [question.exampleInput1, question.exampleInput2],
          expectedExampleOutputs: [question.exampleOutput1, question.exampleOutput2],
          hiddenInputs: [question.hiddenInput1, question.hiddenInput2, question.hiddenInput3],
          expectedHiddenOutputs: [question.hiddenOutput1, question.hiddenOutput2, question.hiddenOutput3]
        }),
      });

      const result = await response.json();
      setOutput(result.message || result.output || "No output");
      setExampleResults(result.exampleResults || []);
      //setHiddenResults(result.hiddenResults);
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    }
  };

  if (loading) return <p>Loading question...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="question-container">
      <Link to="/" className="back-link">← Back to Questions</Link>

      <h1 className="question-title">{question.title}</h1>
      <p className="question-description">{question.description}</p>

      <div className="example-test-cases">
        <h3>Example Test Cases:</h3>
        {question && [1, 2].map((index) => (
          <div key={index} className="example-case">
            <p><strong>Input {index}:</strong> {question[`exampleInput${index}`]}</p>
            <p><strong>Expected Output {index}:</strong> {question[`exampleOutput${index}`]}</p>
            {exampleResults.length > 0 && exampleResults[index - 1] && (
              <>
                <p><strong>Actual Output:</strong> {exampleResults[index - 1].output}</p>
                <p className={exampleResults[index - 1].passed ? "test-pass" : "test-fail"}>
                  {exampleResults[index - 1].passed ? "✅ Passed" : "❌ Failed"}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

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

      <textarea
        className="solution-input"
        value={solution}
        onChange={(e) => setSolution(e.target.value)}
        placeholder={`Write your ${selectedLanguage} solution here...`}
      />

      <button className="run-button" onClick={handleRun}>Run Code</button>
      <button className="submit-button" onClick={handleSubmit}>Submit Code</button>

      <div className="output-container">
        <h3>Output:</h3>
        <pre className="output-box">{output}</pre>
            
        {/* {hiddenResults === false && (
          <p className="hidden-results">❌ Hidden test cases failed. Please retry.</p>
        )}
        {hiddenResults === true && (
          <p className="success-message">✅ All test cases passed!</p>
        )} */}
      </div>
    </div>
  );
};

export default QuestionDetails;
