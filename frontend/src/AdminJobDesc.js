import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminJobDesc() {
  const [form, setForm] = useState({
    role: '',
    title: '',
    skills: '',
    eligibility: '',
    location: '',
    duration: '',
    level: '',
    addons: '',
    num_questions: 5,
    enable_skill_assessment: true
  });
  const [jobRoles, setJobRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobRoles();
  }, []);

  const fetchJobRoles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-all-job-desc');
      setJobRoles(response.data);
    } catch (error) {
      setJobRoles([]);
    }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/add-job-desc', form);
    alert('Job description added!');
    setForm({
      role: '',
      title: '',
      skills: '',
      eligibility: '',
      location: '',
      duration: '',
      level: '',
      addons: '',
      num_questions: 5,
      enable_skill_assessment: true
    });
    fetchJobRoles();
  };

  const handleToggleSkillAssessment = async (role, currentValue) => {
    await axios.post('http://localhost:5000/update-job-skill-assessment', { role, enable_skill_assessment: !currentValue });
    fetchJobRoles();
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', background: '#232327', padding: 24, borderRadius: 12, color: '#fff' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 16, background: '#222', color: '#FFD600', border: 'none', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, boxShadow: '0 2px 8px #0002' }}>
        ← Back
      </button>
      <h2 style={{ color: '#4CAF50' }}>Add Job Description</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input name="role" placeholder="Role" value={form.role} onChange={handleChange} required />
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} required />
        <input name="eligibility" placeholder="Eligibility" value={form.eligibility} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
        <input name="duration" placeholder="Duration (minutes)" value={form.duration} onChange={handleChange} required />
        <input name="level" placeholder="Level" value={form.level} onChange={handleChange} required />
        <input name="addons" placeholder="Addons" value={form.addons} onChange={handleChange} />
        <input name="num_questions" type="number" placeholder="Number of Questions" value={form.num_questions} onChange={handleChange} min={1} required />
        <div style={{ marginTop: 16 }}>
          <label style={{ color: '#fff', marginRight: 8 }}>Enable Skill Assessment:</label>
          <input
            name="enable_skill_assessment"
            type="checkbox"
            checked={form.enable_skill_assessment}
            onChange={e => setForm({ ...form, enable_skill_assessment: e.target.checked })}
            style={{ transform: 'scale(1.5)', cursor: 'pointer' }}
          />
        </div>
        <button type="submit" style={{ marginTop: 16, background: '#4CAF50', color: '#fff', padding: '10px 24px', border: 'none', borderRadius: 6 }}>Add Job Description</button>
      </form>
      <h2 style={{ color: '#FFD600', marginTop: 32 }}>Manage Existing Jobs</h2>
      <table style={{ width: '100%', background: '#18181b', color: '#fff', borderRadius: 8, marginTop: 16 }}>
        <thead>
          <tr>
            <th>Role</th>
            <th>Title</th>
            <th>Skill Assessment</th>
            <th>Schedule Interview</th>
          </tr>
        </thead>
        <tbody>
          {jobRoles.map(job => (
            <tr key={job.role}>
              <td>{job.role}</td>
              <td>{job.title}</td>
              <td>
                <button
                  style={{ background: job.enable_skill_assessment === true || job.enable_skill_assessment === 'yes' ? '#4CAF50' : '#888', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer' }}
                  onClick={() => handleToggleSkillAssessment(job.role, job.enable_skill_assessment === true || job.enable_skill_assessment === 'yes')}
                >
                  {job.enable_skill_assessment === true || job.enable_skill_assessment === 'yes' ? 'Enabled' : 'Disabled'}
                </button>
              </td>
              <td>
                <button
                  style={{ background: '#00C49F', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer' }}
                  onClick={() => navigate(`/admin-applicants?role=${encodeURIComponent(job.role)}`)}
                >
                  Schedule Interview
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminJobDesc;