import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        title: '', description: '', difficulty: '', category: '',
        exampleInput1: '', exampleInput2: '', exampleOutput1: '', exampleOutput2: '',
        hiddenInput1: '', hiddenInput2: '', hiddenInput3: '',
        hiddenOutput1: '', hiddenOutput2: '', hiddenOutput3: '',
        points: 1
    });
    const [editingQuestionId, setEditingQuestionId] = useState(null);

    const token = localStorage.getItem('authToken');

    const fetchQuestions = () => {
        if (!token) {
            console.error("No token found. Please log in.");
            return;
        }

        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/questions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setQuestions(data);
            } else {
                console.error("Invalid response format:", data);
            }
        })
        .catch(err => console.error('Error fetching questions:', err));
    };

    useEffect(() => {
        fetchQuestions();
    });

    const handleChange = (e) => {
        setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!token) {
            alert("No authentication token found. Please log in again.");
            return;
        }

        const url = editingQuestionId 
            ? `${process.env.REACT_APP_BACKEND_URL}/api/admin/questions/${editingQuestionId}`
            : `${process.env.REACT_APP_BACKEND_URL}/api/admin/questions`;

        const method = editingQuestionId ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newQuestion)
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            setNewQuestion({ title: '', description: '', difficulty: '', category: '',
                exampleInput1: '', exampleInput2: '', exampleOutput1: '', exampleOutput2: '',
                hiddenInput1: '', hiddenInput2: '', hiddenInput3: '',
                hiddenOutput1: '', hiddenOutput2: '', hiddenOutput3: '',
                points: 1
            });
            setEditingQuestionId(null);
            fetchQuestions();
        })
        .catch(err => console.error('Error:', err));
    };

    const handleEdit = (question) => {
        setNewQuestion(question);
        setEditingQuestionId(question._id);
    };

    const handleCancelEdit = () => {
        setNewQuestion({ title: '', description: '', difficulty: '', category: '',
            exampleInput1: '', exampleInput2: '', exampleOutput1: '', exampleOutput2: '',
            hiddenInput1: '', hiddenInput2: '', hiddenInput3: '',
            hiddenOutput1: '', hiddenOutput2: '', hiddenOutput3: '',
            points: 1
        });
        setEditingQuestionId(null);
    };

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this question?")) {
            return;
        }

        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/questions/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            fetchQuestions();
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
                <input name="exampleInput1" placeholder="Example Input 1" value={newQuestion.exampleInput1} onChange={handleChange} required />
                <input name="exampleOutput1" placeholder="Example Output 1" value={newQuestion.exampleOutput1} onChange={handleChange} required />
                <input name="exampleInput2" placeholder="Example Input 2" value={newQuestion.exampleInput2} onChange={handleChange} required />
                <input name="exampleOutput2" placeholder="Example Output 2" value={newQuestion.exampleOutput2} onChange={handleChange} required />
                <input name="hiddenInput1" placeholder="Hidden Input 1" value={newQuestion.hiddenInput1} onChange={handleChange} required />
                <input name="hiddenOutput1" placeholder="Hidden Output 1" value={newQuestion.hiddenOutput1} onChange={handleChange} required />
                <input name="hiddenInput2" placeholder="Hidden Input 2" value={newQuestion.hiddenInput2} onChange={handleChange} required />
                <input name="hiddenOutput2" placeholder="Hidden Output 2" value={newQuestion.hiddenOutput2} onChange={handleChange} required />
                <input name="hiddenInput3" placeholder="Hidden Input 3" value={newQuestion.hiddenInput3} onChange={handleChange} required />
                <input name="hiddenOutput3" placeholder="Hidden Output 3" value={newQuestion.hiddenOutput3} onChange={handleChange} required />
                <input name="points" placeholder='Points' value={newQuestion.points} onChange={handleChange} required />
                <button type="submit">{editingQuestionId ? "Update Question" : "Add Question"}</button>
                {editingQuestionId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
            </form>
            <h3>Existing Questions</h3>
            <ul>
                {questions.map(q => (
                    <li key={q._id}>{q.title} - {q.difficulty}
                        <button onClick={() => handleEdit(q)}>Edit</button>
                        <button onClick={() => handleDelete(q._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;