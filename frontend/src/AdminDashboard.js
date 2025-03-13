import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        title: '', description: '', difficulty: '', category: '', exampleInput: '', exampleOutput: '', points: 1
    });
    const [editingQuestionId, setEditingQuestionId] = useState(null); // ✅ Track the question being edited

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
    });

    // Handle input changes
    const handleChange = (e) => {
        setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
    };

    // Handle form submission to add or update a question
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!token) {
            alert("No authentication token found. Please log in again.");
            return;
        }

        const url = editingQuestionId 
            ? `http://localhost:5000/admin/questions/${editingQuestionId}`  // ✅ Update endpoint for editing
            : 'http://localhost:5000/admin/questions';  // ✅ Add endpoint

        const method = editingQuestionId ? 'PUT' : 'POST'; // ✅ Use PUT if editing

        fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // ✅ Ensure admin authentication
            },
            body: JSON.stringify(newQuestion)
        })
        .then(res => res.json())
        .then(data => {
            console.log("Response:", data); // ✅ Debugging
            if (data.message.includes("successfully")) {
                alert(data.message);
                setNewQuestion({ title: '', description: '', difficulty: '', category: '', exampleInput: '', exampleOutput: '', points: 1 });
                setEditingQuestionId(null); // ✅ Reset edit mode
                fetchQuestions(); // ✅ Refresh list
            } else {
                alert("Failed: " + data.message);
            }
        })
        .catch(err => console.error('Error:', err));
    };

    // Handle edit button click
    const handleEdit = (question) => {
        setNewQuestion(question);
        setEditingQuestionId(question._id);
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setNewQuestion({ title: '', description: '', difficulty: '', category: '', exampleInput: '', exampleOutput: '', points: 1 });
        setEditingQuestionId(null);
    };

    // ✅ Delete a question
    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this question?")) {
            return;
        }

        fetch(`http://localhost:5000/admin/questions/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // ✅ Ensure admin authentication
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log("Delete Response:", data);
            alert(data.message);
            fetchQuestions(); // ✅ Refresh list after deletion
        })
        .catch(err => console.error('Error deleting question:', err));
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
                <input name="points" placeholder='points' value={newQuestion.points} onChange={handleChange} required />
                <button type="submit">{editingQuestionId ? "Update Question" : "Add Question"}</button>
                {editingQuestionId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
            </form>

            <h3>Existing Questions</h3>
            <ul>
                {questions.length > 0 ? (
                    questions.map(q => (
                        <li key={q._id}>
                            {q.title} - {q.difficulty}
                            <button onClick={() => handleEdit(q)}>Edit</button>
                            <button onClick={() => handleDelete(q._id)}>Delete</button>
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
