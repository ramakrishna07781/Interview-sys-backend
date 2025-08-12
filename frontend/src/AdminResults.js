import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminResults() {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/get-all-results').then(res => setResults(res.data));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', background: '#232327', padding: 24, borderRadius: 12, color: '#fff' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 16, background: '#222', color: '#FFD600', border: 'none', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, boxShadow: '0 2px 8px #0002' }}>← Back</button>
      <h2 style={{ color: '#4CAF50' }}>Candidate Results</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
        <thead>
          <tr style={{ background: '#18181c' }}>
            <th style={{ padding: 8 }}>Candidate</th>
            <th style={{ padding: 8 }}>Role</th>
            <th style={{ padding: 8 }}>Total Score</th>
            <th style={{ padding: 8 }}>Average Score</th>
            <th style={{ padding: 8 }}>Recommendation</th>
            <th style={{ padding: 8 }}>Evaluation</th>
            <th style={{ padding: 8 }}>Questions</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i} style={{ background: i % 2 ? '#232327' : '#202024' }}>
              <td style={{ padding: 8 }}>{r.username || 'unknown'}</td>
              <td style={{ padding: 8 }}>{r.role || '-'}</td>
              <td style={{ padding: 8 }}>{r.total_score || '-'}</td>
              <td style={{ padding: 8 }}>{r.average_score || '-'}</td>
              <td style={{ padding: 8 }}>{r.recommendation || '-'}</td>
              <td style={{ padding: 8, maxWidth: 300, whiteSpace: 'pre-wrap' }}>{r.evaluation || '-'}</td>
              <td style={{ padding: 8 }}>{r.questions_count || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminResults;