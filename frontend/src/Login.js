import axios from 'axios';
import './App.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
      // Store user session
      localStorage.setItem('username', username);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('resumeText', response.data.resume_text || '');
      localStorage.setItem('sessionId', response.data.session_id || '');
      navigate('/'); // Redirect to home after login
    } catch (error) {
      console.error('Login error', error);
      alert('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="back-button" onClick={() => navigate(-1)} style={{ position: 'absolute', top: 20, left: 20, padding: '8px 18px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 8px #0002' }}>← Back</button>
      <div className="form-container">
        <p className="title">Welcome back</p>
        <form className="form" onSubmit={handleSubmit}>
          <input type="email" className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Email" />
          <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <p className="page-link">
            <span className="page-link-label">Forgot Password?</span>
          </p>
          <button className="form-btn" type='submit' disabled={loading}>{loading ? 'Logging in...' : 'Log in'}</button>
        </form>
        <p className="sign-up-label">
          Don't have an account?<span className="sign-up-link"><Link to='/register'>Sign up</Link></span>
        </p>
      </div>
    </>
  );
}
export default Login;