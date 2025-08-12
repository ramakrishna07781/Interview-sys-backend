import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './InterviewSelection.css';

function SkillAssessmentSelection() {
    const [scheduledAssessments, setScheduledAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            alert('Please login first to access the system.');
            navigate('/login');
            return;
        }
        fetchScheduledAssessments();
    }, []);

    const fetchScheduledAssessments = async () => {
        try {
            const username = localStorage.getItem('username');
            // Use the new endpoint to fetch all roles for which the user is enabled for skill assessment
            const response = await axios.get(`http://localhost:5000/get-user-skill-assessments?username=${encodeURIComponent(username)}`);
            setScheduledAssessments(response.data || []);
        } catch (error) {
            setScheduledAssessments([]);
        } finally {
            setLoading(false);
        }
    };

    const startAssessment = (assessment) => {
        navigate(`/skill-assessment?role=${encodeURIComponent(assessment.role)}`);
    };

    const cancelAssessment = async (assessment) => {
        const username = localStorage.getItem('username');
        await axios.post('http://localhost:5000/cancel-skill-assessment', { username, role: assessment.role });
        fetchScheduledAssessments();
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <div className="loader"></div>
                <div className="loader-text">Loading your skill assessments...</div>
            </div>
        );
    }

    return (
        <div className="dropdown-content" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0002', maxWidth: 500, margin: '3rem auto', padding: '2.5rem 2rem', color: '#232327' }}>
            <button className="back-button" onClick={() => navigate('/')} style={{ position: 'absolute', top: 20, left: 20, padding: '8px 18px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 8px #0002' }}>← Back</button>
            <h1 style={{ color: '#2196F3', marginBottom: 24, fontWeight: 700, fontSize: 32, letterSpacing: 1 }}>Your Scheduled Skill Assessments</h1>
            {scheduledAssessments.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: 40, color: '#232327' }}>
                    <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No assessments" style={{ width: 120, marginBottom: 16, opacity: 0.7 }} />
                    <p style={{ color: '#888', fontSize: 20, marginBottom: 16 }}>
                        <strong>No scheduled skill assessments found!</strong><br />
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
                    {scheduledAssessments.map((assessment, index) => (
                        <div key={index} style={{ marginBottom: 16 }}>
                            <button
                                onClick={() => startAssessment(assessment)}
                                style={{
                                    display: 'block',
                                    padding: '18px 20px',
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
                                    marginBottom: 8
                                }}
                                onMouseOver={e => e.currentTarget.style.background = '#e3f0fa'}
                                onMouseOut={e => e.currentTarget.style.background = '#f7f8f8'}
                            >
                                <strong>{assessment.role}</strong>
                            </button>
                            <button
                                onClick={() => cancelAssessment(assessment)}
                                style={{
                                    background: '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 18px',
                                    borderRadius: '6px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    marginTop: 4
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SkillAssessmentSelection;
