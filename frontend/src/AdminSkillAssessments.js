import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminSkillAssessments() {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [applicants, setApplicants] = useState([]);
    const [roleStatus, setRoleStatus] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        const res = await axios.get('http://localhost:5000/get-all-job-desc');
        setRoles(res.data);
    };

    const fetchApplicants = async (role) => {
        setSelectedRole(role);
        // Get applicants
        const res = await axios.get(`http://localhost:5000/get-skill-assessment-applicants-with-resume?role=${role}`);
        setApplicants(res.data);
        // Get role status
        const roleObj = roles.find(r => r.role === role);
        setRoleStatus(roleObj ? (roleObj.enable_skill_assessment === true || roleObj.enable_skill_assessment === 'yes') : null);
    };

    const handleToggleSkillAssessment = async () => {
        if (!selectedRole) return;
        await axios.post('http://localhost:5000/update-job-skill-assessment', { role: selectedRole, enable_skill_assessment: !roleStatus });
        setRoleStatus(!roleStatus);
        fetchRoles(); // Refresh roles
    };

    const handleSchedule = async (username) => {
        await axios.post('http://localhost:5000/shortlist-skill-assessment', { username, role: selectedRole });
        // Optimistically update local state so button changes immediately
        setApplicants(prev => prev.map(a => a.username === username ? { ...a, status: 'shortlisted' } : a));
        // Optionally, you can still refetch to ensure backend sync:
        // fetchApplicants(selectedRole);
    };

    const handleCancel = async (username) => {
        await axios.post('http://localhost:5000/cancel-skill-assessment', { username, role: selectedRole });
        fetchApplicants(selectedRole);
    };

    return (
        <div style={{ maxWidth: 900, margin: '2rem auto', background: '#232327', padding: 24, borderRadius: 12, color: '#fff' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: 16, background: '#222', color: '#FFD600', border: 'none', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, boxShadow: '0 2px 8px #0002' }}>← Back</button>
            <h2 style={{ color: '#4CAF50' }}>Manage Skill Assessments</h2>
            <div style={{ marginBottom: 24 }}>
                <label style={{ marginRight: 8 }}>Select Role:</label>
                <select value={selectedRole} onChange={e => fetchApplicants(e.target.value)}>
                    <option value="">-- Select --</option>
                    {roles.map((role, idx) => (
                        <option key={idx} value={role.role}>{role.role}</option>
                    ))}
                </select>
            </div>
            {selectedRole && (
                <div style={{ marginBottom: 16 }}>
                    <span style={{ marginRight: 12 }}>Skill Assessment: </span>
                    <span style={{ color: roleStatus ? '#4CAF50' : '#f44336', fontWeight: 600 }}>
                        {roleStatus ? 'Enabled for this Role' : 'Disabled for this Role'}
                    </span>
                </div>
            )}
            {selectedRole && (
                <table style={{ width: '100%', background: '#2a2a2e', borderRadius: 8, color: '#fff' }}>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Status</th>
                            <th>Resume</th>
                            <th>Score</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applicants.map((a, idx) => (
                            <tr key={idx}>
                                <td>{a.username}</td>
                                <td>{a.status === 'shortlisted' ? 'Enabled' : a.status === 'applied' ? 'Disabled' : a.status}</td>
                                <td style={{ maxWidth: 300, whiteSpace: 'pre-wrap', fontSize: 13 }}>{a.resume_text}</td>
                                <td>{a.score || '-'}</td>
                                <td>
                                    {a.status !== 'shortlisted' && (
                                        <button onClick={() => handleSchedule(a.username)} style={{ background: '#4CAF50', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 6, marginRight: 8 }}>Enable</button>
                                    )}
                                    {a.status === 'shortlisted' && (
                                        <button disabled style={{ background: '#00C49F', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 6 }}>Enabled</button>
                                    )}
                                    {a.status === 'shortlisted' && (
                                        <button onClick={() => handleCancel(a.username)} style={{ background: '#f44336', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 6, marginLeft: 8 }}>Cancel</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminSkillAssessments;
