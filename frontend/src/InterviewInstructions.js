import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function InterviewInstructions() {
  const [jobDetails, setJobDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const role = urlParams.get('role');

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
      return;
    }
    if (!role) {
      navigate('/interview-selection', { replace: true });
      return;
    }
    // Fetch job details
    axios.get(`http://localhost:5000/get-job-desc?role=${encodeURIComponent(role)}`)
      .then(res => setJobDetails(res.data))
      .catch(() => setJobDetails({}))
      .finally(() => setLoading(false));
  }, [role, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => c > 0 ? c - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStart = async () => {
    const username = localStorage.getItem('username');
    const resumeText = localStorage.getItem('resumeText');
    const sessionId = localStorage.getItem('sessionId');
    if (!username || !resumeText || !sessionId) {
      alert('User session expired. Please login again.');
      navigate('/login');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/get_questions', {
        username,
        role,
        resume_text: resumeText
      });
      localStorage.setItem('questions', JSON.stringify(response.data.questions || []));
      localStorage.setItem('jobDetails', JSON.stringify(jobDetails));
      localStorage.setItem('minQuestions', response.data.min_questions || 5);
      localStorage.setItem('maxQuestions', response.data.max_questions || 15);
      localStorage.setItem('currentQuestionIndex', '0');
      localStorage.setItem('answers', JSON.stringify([]));
      localStorage.setItem('scores', JSON.stringify([]));
      navigate(`/interview?role=${encodeURIComponent(role)}`);
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div className="loader"></div>
        <div className="loader-text">Loading interview instructions and job details...</div>
      </div>
    );
  }

  return (
    <div className="instructions-container" style={{ maxWidth: 600, margin: '3rem auto', padding: '2.5rem 2rem', background: '#fff', borderRadius: 16, color: '#232327', boxShadow: '0 4px 24px #0002', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ color: '#2196F3', textAlign: 'center', fontWeight: 700, fontSize: 32, letterSpacing: 1, marginBottom: 24 }}>Interview Instructions</h1>
      <div style={{ background: '#f7f8f8', padding: '1.5rem', borderRadius: 10, marginBottom: '1.5rem', width: '100%', color: '#232327' }}>
        <h2 style={{ color: '#2196F3', marginBottom: '1rem', fontWeight: 600, fontSize: 22 }}>Role: {jobDetails.role || role}</h2>
        <ul style={{ listStyle: 'none', padding: 0, fontSize: 17 }}>
          <li style={{ marginBottom: '0.5rem' }}><strong>Position:</strong> {jobDetails.title || 'N/A'}</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Duration:</strong> {jobDetails.duration || '30'} minutes</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Difficulty Level:</strong> {jobDetails.level || 'Medium'}</li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Questions:</strong> {jobDetails.min_questions || 5} - {jobDetails.max_questions || 15} questions
          </li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Required Skills:</strong> {jobDetails.skills || 'N/A'}</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Location:</strong> {jobDetails.location || 'N/A'}</li>
        </ul>
      </div>
      <div style={{ background: '#f7f8f8', padding: '1.5rem', borderRadius: 10, marginBottom: '1.5rem', width: '100%', color: '#232327' }}>
        <h3 style={{ color: '#2196F3', marginBottom: '1rem', fontWeight: 600, fontSize: 19 }}>Interview Guidelines:</h3>
        <ul style={{ paddingLeft: '1.5rem', fontSize: 16 }}>
          <li>Answer each question honestly and to the best of your ability</li>
          <li>You can type your responses in the text area provided</li>
          <li>Do not refresh the page during the interview</li>
          <li>The interview will start with {jobDetails.min_questions || 5} questions</li>
          <li>Based on your responses, you may receive up to {jobDetails.max_questions || 15} questions</li>
          <li>Each answer will be evaluated by AI for scoring</li>
          <li>Take your time to provide thoughtful answers</li>
        </ul>
      </div>
      <div style={{ textAlign: 'center', width: '100%' }}>
        <p style={{ color: '#2196F3', marginBottom: '1rem', fontSize: 17 }}>
          Questions will be loaded based on your resume and the job requirements
        </p>
        <button
          style={{
            background: countdown > 0 || loading ? '#666' : '#2196F3',
            color: '#fff',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 600,
            cursor: countdown > 0 || loading ? 'not-allowed' : 'pointer',
            minWidth: '200px',
            marginBottom: 12,
            boxShadow: '0 2px 8px #0001'
          }}
          onClick={handleStart}
          disabled={countdown > 0 || loading}
        >
          {countdown > 0 ? `Start Interview (${countdown})` : loading ? 'Loading...' : 'Start Interview'}
        </button>
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={() => navigate('/interview-selection')}
            style={{
              background: 'transparent',
              color: '#2196F3',
              border: '1.5px solid #2196F3',
              padding: '10px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginRight: '10px',
              fontWeight: 600,
              fontSize: 16
            }}
          >
            Back to Role Selection
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            style={{
              background: '#f44336',
              color: 'white',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 16
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default InterviewInstructions;