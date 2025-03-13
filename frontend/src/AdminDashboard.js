import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        title: '', description: '', difficulty: '', category: '', exampleInput: '', exampleOutput: ''
    });

    const token = localStorage.getItem('authToken'); // ✅ Get authentication token

    // Function to fetch all questions
    const fetchQuestions = () => {
        if (!token) {
            console.error("No token found. Please log in.");
            return;
        }

        fetch('http://localhost:5000/admin/questions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // ✅ Send token
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log("API Response:", data); // ✅ Debugging Step
            if (Array.isArray(data)) {
                setQuestions(data);
            } else {
                console.error("Invalid response format:", data);
            }
        })
        .catch(err => console.error('Error fetching questions:', err));
    };

    // Fetch questions when component loads
    useEffect(() => {
        fetchQuestions();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
    };

    // Handle form submission to add a question
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!token) {
            alert("No authentication token found. Please log in again.");
            return;
        }

        fetch('http://localhost:5000/admin/questions', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // ✅ Ensure admin authentication
            },
            body: JSON.stringify(newQuestion)
        })
        .then(res => res.json())
        .then(data => {
            console.log("Response:", data); // ✅ Debugging
            if (data.message === "Question added successfully") {
                setQuestions([...questions, data.question]); // ✅ Add new question to the list
                alert("Question added successfully!");
                setNewQuestion({ title: '', description: '', difficulty: '', category: '', exampleInput: '', exampleOutput: '' });
            } else {
                alert("Failed to add question: " + data.message);
            }
        })
        .catch(err => console.error('Error adding question:', err));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Admin Dashboard - Manage Questions</h2>
            <form onSubmit={handleSubmit}>
                <input name="title" placeholder="Title" value={newQuestion.title} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={newQuestion.description} onChange={handleChange} required />
                <select name="difficulty" value={newQuestion.difficulty} onChange={handleChange} required>
                    <option value="">Select Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
                <input name="category" placeholder="Category" value={newQuestion.category} onChange={handleChange} required />
                <textarea name="exampleInput" placeholder="Example Input" value={newQuestion.exampleInput} onChange={handleChange} required />
                <textarea name="exampleOutput" placeholder="Example Output" value={newQuestion.exampleOutput} onChange={handleChange} required />
                <button type="submit">Add Question</button>
            </form>

            <h3>Existing Questions</h3>
            <ul>
                {questions.length > 0 ? (
                    questions.map(q => (
                        <li key={q._id}>
                            {q.title} - {q.difficulty}
                            <button onClick={() => console.log('Edit Logic Here')}>Edit</button>
                            <button onClick={() => console.log('Delete Logic Here')}>Delete</button>
                        </li>
                    ))
                ) : (
                    <p>No questions available.</p>
                )}
            </ul>
        </div>
    );
};

export default AdminDashboard;
