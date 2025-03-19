import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import './SubmittedQuestions.css'; // Import the CSS file

const SubmittedQuestions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [questions, setQuestions] = useState({});
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSubmission, setExpandedSubmission] = useState(null);
  const [filters, setFilters] = useState({
    questionId: '',
    userId: '',
    passed: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem('authToken');
        
        const questionsResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const questionsMap = {};
        questionsResponse.data.forEach(question => {
          questionsMap[question._id] = question;
        });
        setQuestions(questionsMap);
        
        const usersResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const usersMap = {};
        usersResponse.data.forEach(user => {
          usersMap[user._id] = user;
        });
        setUsers(usersMap);
        
        const submissionsResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submissions`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        setSubmissions(submissionsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err.response ? err.response.data : err.message);
        setError(err.response ? err.response.data.message || err.response.data.error : err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredSubmissions = submissions.filter(submission => {
    return (
      (filters.questionId === '' || submission.questionId === filters.questionId) &&
      (filters.userId === '' || submission.userId === filters.userId) &&
      (filters.passed === '' || 
        (filters.passed === 'passed' && submission.points > 0) || 
        (filters.passed === 'failed' && submission.points === 0))
    );
  });

  const toggleSubmissionCode = (submissionId) => {
    setExpandedSubmission(prev => (prev === submissionId ? null : submissionId));
  };

  if (loading) return <div className="loading-message">Loading submissions data...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="container">
      <h1>Question Submissions Dashboard</h1>
      
      {/* Filters */}
      <div className="filters-container">
        <div>
          <label>Filter by Question:</label>
          <select 
            name="questionId" 
            value={filters.questionId}
            onChange={handleFilterChange}
          >
            <option value="">All Questions</option>
            {Object.values(questions).map(question => (
              <option key={question._id} value={question._id}>
                {question.title}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label>Filter by User:</label>
          <select 
            name="userId" 
            value={filters.userId}
            onChange={handleFilterChange}
          >
            <option value="">All Users</option>
            {Object.values(users).map(user => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label>Filter by Status:</label>
          <select 
            name="passed" 
            value={filters.passed}
            onChange={handleFilterChange}
          >
            <option value="">All Submissions</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>
      
      {/* Submissions Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Question</th>
              <th>User</th>
              <th>Submitted</th>
              <th>Language</th>
              <th>Points</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map(submission => {
                const question = questions[submission.questionId] || { title: 'Unknown Question' };
                const user = users[submission.userId] || { username: 'Unknown User' };
                const passed = submission.points > 0;
                
                return (
                  <React.Fragment key={submission._id}>
                    <tr>
                      <td>{question.title}</td>
                      <td>{user.username}</td>
                      <td>{format(new Date(submission.submittedAt), 'MMM d, yyyy HH:mm')}</td>
                      <td>{submission.language || 'Not specified'}</td>
                      <td>{submission.points}</td>
                      <td>
                        <span className={`status-badge ${passed ? 'passed' : 'failed'}`}>
                          {passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => toggleSubmissionCode(submission._id)}>
                          {expandedSubmission === submission._id ? 'Hide Code' : 'View Code'}
                        </button>
                      </td>
                    </tr>
                    {expandedSubmission === submission._id && (
                      <tr>
                        <td colSpan="7">
                          <div className="code-container">
                            <pre>{submission.submission}</pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="no-submissions">
                  No submissions found matching the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmittedQuestions;
