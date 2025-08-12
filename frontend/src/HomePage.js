import React from "react";
import Navbar from "./components/Navbar";
import ResumeBuilder from "./components/ResumeBuilder";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import JobsSection from "./JobsSection";
import ScheduledInterviews from "./ScheduledInterviews";
import { useNavigate, Link } from 'react-router-dom';

function Homepage() {
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleStartInterview = (role) => {
    window.location.href = `/interview?role=${encodeURIComponent(role)}`;
  };

  return (
    <>
      <Navbar />
      <Hero />
      {/* Show only a few jobs on the homepage */}
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <JobsSection username={username} limit={3} />
        <div style={{ textAlign: 'right', margin: '8px 0 24px 0' }}>
          <Link to="/jobs">
            <button style={{ background: '#00C49F', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
              See All Jobs
            </button>
          </Link>
        </div>
      </div>
      <ScheduledInterviews username={username} onStartInterview={handleStartInterview} />
      {/* <button
        onClick={() => navigate('/skill-assessments')}
        style={{
          background: '#673ab7',
          color: 'white',
          border: 'none',
          padding: '14px 32px',
          borderRadius: '8px',
          fontSize: '20px',
          fontWeight: 600,
          cursor: 'pointer',
          margin: '16px 0',
          boxShadow: '0 2px 8px #0001'
        }}
      >
        Skill Assessment
      </button> */}
      <Footer />
    </>
  );
}
export default Homepage;