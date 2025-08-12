import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminApplicants() {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/get-all-job-desc").then(res => setRoles(res.data));
    }, []);

    const fetchApplicants = (role) => {
        setSelectedRole(role);
        axios.get(`http://localhost:5000/get-job-applicants-with-resume?role=${encodeURIComponent(role)}`)
            .then(res => setApplicants(res.data));
    };

    const handleShortlist = (username) => {
        axios.post("http://localhost:5000/shortlist-applicant", { username, role: selectedRole })
            .then(() => fetchApplicants(selectedRole));
    };

    const handleCancel = (username) => {
        axios.post("http://localhost:5000/cancel-scheduled-interview", { username, role: selectedRole })
            .then(() => fetchApplicants(selectedRole));
    };

    return (
        <div style={{ maxWidth: 900, margin: '2rem auto', background: '#232327', padding: 24, borderRadius: 12, color: '#fff' }}>
            <h2 style={{ color: '#FFD600' }}>Applicants by Job Role</h2>
            <div style={{ marginBottom: 16 }}>
                <select onChange={e => fetchApplicants(e.target.value)} value={selectedRole}>
                    <option value="">Select Role</option>
                    {roles.map((r, i) => <option key={i} value={r.role}>{r.title} ({r.role})</option>)}
                </select>
            </div>
            {selectedRole && (
                <table style={{ width: '100%', background: '#2a2a2e', borderRadius: 8, color: '#fff' }}>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Status</th>
                            <th>Resume</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applicants.map((a, idx) => (
                            <tr key={idx}>
                                <td>{a.username}</td>
                                <td>{a.status}</td>
                                <td style={{ maxWidth: 300, whiteSpace: 'pre-wrap', fontSize: 13 }}>{a.resume_text || 'No resume'}</td>
                                <td>
                                    {a.status !== 'shortlisted' ? (
                                        <button style={{ background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', marginRight: 8 }} onClick={() => handleShortlist(a.username)}>Schedule Interview</button>
                                    ) : (
                                        <button style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px' }} onClick={() => handleCancel(a.username)}>Cancel</button>
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

export default AdminApplicants;
