import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Registration() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeText, setResumeText] = useState('');
    const navigate = useNavigate();

    // If already logged in, redirect to interview selection
    React.useEffect(() => {
        if (localStorage.getItem('isLoggedIn')) {
            navigate('/interview-selection');
        }
    }, [navigate]);

    const handleResumeUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setResumeFile(file);
            // Extract text from PDF
            const formData = new FormData();
            formData.append('file', file);
            try {
                const response = await axios.post('http://localhost:5000/extract-text', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setResumeText(response.data.text);
                alert('Resume uploaded and processed successfully!');
            } catch (error) {
                console.error('Error extracting text:', error);
                alert('Failed to process resume. Please try again.');
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        if (!resumeText) {
            alert("Please upload your resume first!");
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/register', {
                username,
                password,
                resume_text: resumeText
            });
            alert(response.data.message);
            navigate('/login');
        } catch (error) {
            console.error('Registration error', error);
            alert('Failed to register');
        }
    };

    return (
        <div>
            <button className="back-button" onClick={() => navigate(-1)} style={{ position: 'absolute', top: 20, left: 20, padding: '8px 18px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 8px #0002' }}>← Back</button>
            <div className="form-container">
                <center><p className="regtitle">Register</p></center>
                <center><p className="message">Fill in your details and upload your resume to register.</p></center>
                <form onSubmit={handleSubmit} className="form" encType="multipart/form-data">
                    <input
                        type="email"
                        className="input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        className="input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <input
                        type="password"
                        className="input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                    />
                    <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                        <label htmlFor="resume-upload" style={{ color: '#333', fontWeight: 500, display: 'block', marginBottom: 4 }}>Upload Resume (PDF):</label>
                        <input
                            id="resume-upload"
                            name="resume-upload"
                            type="file"
                            accept="application/pdf,.pdf"
                            onChange={handleResumeUpload}
                            style={{
                                display: 'none'
                            }}
                        />
                        <label htmlFor="resume-upload" style={{
                            display: 'inline-block',
                            background: '#4CAF50',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '10px 20px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            marginTop: 2
                        }}>
                            Choose File
                        </label>
                        {resumeFile && (
                            <span style={{ marginLeft: 10, color: '#333' }}>{resumeFile.name}</span>
                        )}
                    </div>
                    {resumeText && (
                        <div style={{ marginBottom: '1rem', maxHeight: '200px', overflow: 'auto', background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                            <strong>Extracted Resume Text (first 500 chars):</strong>
                            <p style={{ fontSize: '12px', color: '#666' }}>
                                {resumeText.substring(0, 500)}...
                            </p>
                        </div>
                    )}
                    <button className="regbutton" type='submit'>
                        Register
                        <svg fill="currentColor" viewBox="0 0 24 24" className="icon">
                            <path
                                clipRule="evenodd"
                                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                                fillRule="evenodd"
                            ></path>
                        </svg>
                    </button>
                </form>
                <p className="sign-up-label">
                    Already have an account?<span className="sign-up-link"><Link to='/login'>Sign In</Link></span>
                </p>
            </div>
        </div>
    );
}
export default Registration;