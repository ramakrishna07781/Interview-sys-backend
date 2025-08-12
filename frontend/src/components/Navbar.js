import React from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('resumeText');
        navigate('/'); // Always redirect to home
    };

    return (
        <nav className='navbar'>

            <div className='logo'>
                <h1>edu.<span className="ai">AI</span></h1>
            </div>

            <div className='menu'>
                <Link to='/jobs'>Jobs</Link>
                <Link to='/skill-assessments'>Skill Assessment</Link>
                <Link to='/resume'>AI Resume</Link>
                <Link to='/instructions?interviewType=technical'>
                    <button className="button">AI Interview</button>
                </Link>
                {/* 
                <div className="paste-button">
                    <button className="button">Resources</button>

                    <div className="dropdown-content">
                        <Link to='/text_extraction'> <span id="middle">Image to Text Extraction</span></Link>
                    </div>

                </div> */}

                {!isLoggedIn ? (
                    <Link to='/login'>
                        <button className="button" style={{ marginLeft: 10, background: '#4CAF50', color: '#fff' }}>Sign In</button>
                    </Link>
                ) : (
                    <button className="button" style={{ marginLeft: 10, background: 'red', color: '#fff' }} onClick={handleLogout}>Logout</button>
                )}
            </div>
        </nav>
    );
}
