import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './InterviewSelection.css';

function InterviewSelection() {
  const [scheduledInterviews, setScheduledInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      alert('Please login first to access the interview system.');
      navigate('/login');
      return;
    }
    fetchScheduledInterviews();
    // eslint-disable-next-line
  }, []);

  const fetchScheduledInterviews = async () => {
    try {
      const username = localStorage.getItem('username');
      const response = await axios.get(`http://localhost:5000/get-scheduled-interviews?username=${username}`);
      setScheduledInterviews(response.data);
    } catch (error) {
      setScheduledInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async (interview) => {
    const username = localStorage.getItem('username');
    const response = await axios.post('http://localhost:5000/start-session', { username, role: interview.role });
    localStorage.setItem('sessionId', response.data.session_id);
    navigate(`/instructions?role=${encodeURIComponent(interview.role)}`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div className="loader"></div>
        <div className="loader-text">Loading your interviews...</div>
      </div>
    );
  }

  return (
    <div className="dropdown-content" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0002', maxWidth: 500, margin: '3rem auto', padding: '2.5rem 2rem', color: '#232327' }}>
      <button className="back-button" onClick={() => navigate('/')} style={{ position: 'absolute', top: 20, left: 20, padding: '8px 18px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 8px #0002' }}>← Back</button>
      <h1 style={{ color: '#2196F3', marginBottom: 24, fontWeight: 700, fontSize: 32, letterSpacing: 1 }}>Your Scheduled Interviews</h1>
      {scheduledInterviews.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 40, color: '#232327' }}>
          <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No interviews" style={{ width: 120, marginBottom: 16, opacity: 0.7 }} />
          <p style={{ color: '#888', fontSize: 20, marginBottom: 16 }}>
            <strong>No scheduled interviews found!</strong><br />
            Please check back later or contact support.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#2196F3',
              color: 'white',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 8
            }}
          >
            Back to Menu
          </button>
        </div>
      ) : (
        <div style={{ width: '100%', marginTop: 16 }}>
          {scheduledInterviews.map((interview, index) => (
            <button
              key={index}
              onClick={() => startInterview(interview)}
              style={{
                display: 'block',
                padding: '18px 20px',
                margin: '16px 0',
                background: '#f7f8f8',
                color: '#232327',
                textDecoration: 'none',
                borderRadius: '10px',
                border: '1.5px solid #2196F3',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                fontSize: 18,
                fontWeight: 500,
                boxShadow: '0 2px 8px #0001',
                transition: 'background 0.2s, border 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#e3f0fa'}
              onMouseOut={e => e.currentTarget.style.background = '#f7f8f8'}
            >
              <strong>{interview.role}</strong>
              {interview.title && (
                <><br /><small style={{ color: '#555', fontSize: 15 }}>{interview.title}</small></>
              )}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => {
          localStorage.clear();
          navigate('/login');
        }}
        style={{
          marginTop: '30px',
          background: '#f44336',
          color: 'white',
          border: 'none',
          padding: '12px 32px',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 8px #0001'
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default InterviewSelection;
