import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', background: '#232327', padding: 32, borderRadius: 12, color: '#fff' }}>
      <h1 style={{ color: '#4CAF50' }}>Admin Dashboard</h1>
      <ul style={{ listStyle: 'none', padding: 0, fontSize: 18 }}>
        <li style={{ margin: '1rem 0' }}>
          <Link to="/admin/jobs" style={{ color: '#00C49F', textDecoration: 'none' }}>Manage Job Descriptions</Link>
        </li>
        <li style={{ margin: '1rem 0' }}>
          <Link to="/admin/results" style={{ color: '#00C49F', textDecoration: 'none' }}>View Candidate Results</Link>
        </li>
        <li style={{ margin: '1rem 0' }}>
          <Link to="/admin-applicants" style={{ color: '#00C49F', textDecoration: 'none' }}>Manage Applicants & Schedule Interviews</Link>
        </li>
        <li style={{ margin: '1rem 0' }}>
          <Link to="/admin-skill-assessments" style={{ color: '#00C49F', textDecoration: 'none' }}>Manage Skill Assessments</Link>
        </li>
      </ul>
    </div>
  );
}

export default AdminDashboard;