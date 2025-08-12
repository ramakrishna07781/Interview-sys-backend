import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Radar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import './ResultsPage.css';

function ResultsPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      alert('Please login first.');
      navigate('/login');
      return;
    }
    fetch(`/get-results?username=${encodeURIComponent(username)}`)
      .then(async res => {
        let data;
        try {
          data = await res.json();
        } catch (e) {
          throw new Error('Invalid JSON from backend');
        }
        if (!res.ok || data.error) {
          throw new Error(data.error || 'Unknown error');
        }
        setResult(data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        setResult({ error: err.message });
        // Also log error for debugging
        console.error('Error loading results:', err);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div className="loader"></div>
        <div className="loader-text">Loading your interview results...</div>
      </div>
    );
  }

  if (!result || result.error) {
    return (
      <div style={{ color: '#fff', textAlign: 'center', marginTop: 80 }}>
        Unable to load results. Please try again later.<br />
        {result && result.error && (
          <div style={{ color: '#FF5252', marginTop: 16 }}>
            Error: {result.error}
          </div>
        )}
      </div>
    );
  }

  const questions = Array.isArray(result.questions) ? result.questions : [];
  const scores = questions.map(q => (typeof q.score === 'number' ? q.score : 0));
  const skillLabels = questions.map((q, i) => `Q${i + 1}`);
  const avgScore = result.average_score || 0;
  const totalScore = result.total_score || 0;
  const recommendation = result.recommendation || '';
  const evaluation = result.evaluation || '';
  const specificFeedback = result.specific_feedback || '';

  // Radar chart for skill/knowledge/experience (dummy data, replace with real if available)
  const radarData = {
    labels: ['Technical Skills', 'Domain Knowledge', 'Experience', 'Communication', 'Problem Solving'],
    datasets: [
      {
        label: 'AI Evaluation',
        // The data is all 0 because the total score is 0.
        data: [0, 0, 0, 0, 0],
        backgroundColor: 'rgba(33, 150, 243, 0.3)',
        borderColor: '#2196F3',
        pointBackgroundColor: '#4CAF50',
        borderWidth: 2,
      },
    ],
  };

  // Bar chart for per-question scores
  const barData = {
    labels: skillLabels,
    datasets: [
      {
        label: 'Score',
        data: scores,
        backgroundColor: scores.map(s => s >= 7 ? '#4CAF50' : s > 0 ? '#FFC107' : '#F44336'),
        borderRadius: 8,
      },
    ],
  };

  // Doughnut chart for attempted vs not attempted
  const attempted = scores.filter(s => s > 0).length;
  const notAttempted = questions.length - attempted;
  const doughnutData = {
    labels: ['Attempted', 'Not Attempted'],
    datasets: [
      {
        data: [attempted, notAttempted],
        backgroundColor: ['#00C49F', '#F44336'],
        borderWidth: 0,
      },
    ],
  };

  function cleanEvaluationText(evaluationText) {
    if (typeof evaluationText !== 'string') return JSON.stringify(evaluationText) || '';
    // Split the text by double newlines to get paragraphs
    const paragraphs = evaluationText.split('\n\n').filter(p => p.trim() !== '');
    // Replace '*' with a more readable list format if necessary
    const formattedParagraphs = paragraphs.map(p => {
      // For list items that start with a bullet point
      if (p.includes('\n   ')) {
        return (
          <ul key={p.substring(0, 10)}>
            {p.split('\n   ').map((line, index) => {
              if (index === 0) return <h3 key={index}>{line.trim()}</h3>;
              return <li key={index}>{line.trim().replace(/\* /g, '')}</li>;
            })}
          </ul>
        );
      }
      return <p key={p.substring(0, 10)}>{p.trim()}</p>;
    });
    return formattedParagraphs;
  }

  // A dedicated component for the detailed feedback to make the code cleaner.
  const SpecificFeedback = ({ feedbackText }) => {
    if (!feedbackText) return null;
    const sections = feedbackText.split('\n   ').slice(1);
    const mainHeader = feedbackText.split('\n')[0];
    return (
      <div className="results-section">
        <h2 style={{ color: '#FFD600', marginBottom: 16, fontWeight: 700, letterSpacing: 0.5 }}>{mainHeader}</h2>
        <div className="feedback-list">
          {sections.map((section, index) => {
            const lines = section.split('\n').filter(line => line.trim() !== '');
            const sectionTitle = lines[0].replace(/:$/, '').trim();
            const items = lines.slice(1).map(item => item.trim().replace(/^- /g, '').replace(/^- /g, ''));
            return (
              <div key={index} className="feedback-card">
                <h3>{sectionTitle}</h3>
                <ul>
                  {items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="results-root">
      <h1 className="results-title">Interview Results</h1>
      <div className="results-section summary-box">
        <div className="recommendation-pill">
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>{recommendation}</span>
        </div>
        <div className="score-display">
          <div className="score-text">Total Score:</div>
          <div className="score-value">{totalScore}<span className="score-out-of">/10</span></div>
        </div>
      </div>
      <div className="results-section">
        <h2 style={{ color: '#00FFD0', margin: 0, fontWeight: 700, letterSpacing: 0.5 }}>Final AI Summary</h2>
        <div className="results-summary">{cleanEvaluationText(evaluation)}</div>
      </div>
      {questions.length === 0 ? (
        <div className="results-section no-charts-section">
          <div style={{ color: '#fff', textAlign: 'center', margin: '24px 0' }}>
            <p>
              **No charts to display** because no questions were answered.
            </p>
            <p>
              **Recommendation:** The interview could not proceed due to a fundamental lack of response. Please review the specific feedback below to prepare for future interviews.
            </p>
          </div>
        </div>
      ) : (
        <div className="results-charts">
          <div className="results-chart-box">
            <h3 style={{ color: '#00FFD0' }}>Skill/Knowledge Analysis</h3>
            <Radar data={radarData} options={{ scales: { r: { angleLines: { color: '#333' }, grid: { color: '#333' }, pointLabels: { color: '#fff' }, ticks: { color: '#fff', stepSize: 2 } } }, plugins: { legend: { labels: { color: '#fff' } } }, responsive: true, }} />
          </div>
          <div className="results-chart-box">
            <h3 style={{ color: '#FFD600' }}>Per-Question Scores</h3>
            <Bar data={barData} options={{ plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#fff' } }, y: { min: 0, max: 10, ticks: { color: '#fff', stepSize: 1 } } }, responsive: true, }} />
          </div>
          <div className="results-chart-box">
            <h3 style={{ color: '#FF4081' }}>Attempted vs Not Attempted</h3>
            <Doughnut data={doughnutData} options={{ plugins: { legend: { labels: { color: '#fff', font: { size: 16 } } } }, responsive: true, }} />
          </div>
        </div>
      )}
      <SpecificFeedback feedbackText={specificFeedback} />
      <div className="results-feedback">
        <h2 style={{ color: '#FFD600', marginBottom: 12, fontWeight: 700, letterSpacing: 0.5 }}>AI Feedback & Recommendation</h2>
        <div style={{ fontSize: '1.1rem', color: '#B2FF59', fontWeight: 600 }}>{recommendation === 'Highly Recommended' ? 'Congratulations! You are highly suitable for this position.' : recommendation === 'Recommended' ? 'You are suitable for this position, but some skill development is suggested.' : 'You need to develop your skills further for this position.'}</div>
        <div style={{ marginTop: 12, color: '#00FFD0', whiteSpace: 'pre-wrap', fontWeight: 500 }}>{cleanEvaluationText(evaluation)}</div>
      </div>
      {questions.length > 0 && (
        <div className="results-section">
          <h2 style={{ color: '#00FFD0', marginBottom: 12, fontWeight: 700, letterSpacing: 0.5 }}>Per-Question Review</h2>
          <div className="results-table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Question</th>
                  <th>Your Answer</th>
                  <th>Score</th>
                  <th>AI Feedback</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td style={{ minWidth: 180 }}>{q.question}</td>
                    <td style={{ minWidth: 180 }}>{q.answer}</td>
                    <td style={{ fontWeight: 700 }}>{q.score}</td>
                    <td style={{ minWidth: 220 }}>{q.feedback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <center>
        <button className="results-back-btn" onClick={() => navigate('/interview-selection')}>Back to Role Selection</button>
      </center>
    </div>
  );
}

export default ResultsPage;