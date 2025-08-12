import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Homepage from "./HomePage";
import Login from "./Login";
import Registration from "./Registration";
import ResumeGenerator from './ResumeGenerator';
import InterviewSelection from './InterviewSelection';
import InterviewInterface from './InterviewInterface';
import ResultsPage from './ResultsPage';
import TextExtraction from './text_extraction';
import InterviewInstructions from './InterviewInstructions';
import AdminDashboard from './AdminDashboard';
import AdminJobDesc from './AdminJobDesc';
import AdminResults from './AdminResults';
import AdminApplicants from './AdminApplicants';
import SkillAssessmentSelection from './SkillAssessmentSelection';
import AdminSkillAssessments from './AdminSkillAssessments';
import JobsPage from './JobsPage';
import SkillAssessmentAttempt from './SkillAssessmentAttempt';
import SkillAssessmentResult from './SkillAssessmentResult';

function PrivateRoute({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  React.useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login', { replace: true, state: { from: location } });
    }
  }, [location, navigate]);
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        {/* Protect all other routes */}
        <Route path="/resume" element={<ResumeGenerator />} />
        <Route path="/interview-selection" element={<PrivateRoute><InterviewSelection /></PrivateRoute>} />
        <Route path="/interview" exact element={<PrivateRoute><InterviewInterface /></PrivateRoute>} />
        <Route path="/results" element={<PrivateRoute><ResultsPage /></PrivateRoute>} />
        <Route path="/text_extraction" element={<PrivateRoute><TextExtraction /></PrivateRoute>} />
        <Route path="/instructions" element={<PrivateRoute><InterviewInstructions /></PrivateRoute>} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/jobs" element={<AdminJobDesc />} />
        <Route path="/admin/results" element={<AdminResults />} />
        <Route path="/admin-applicants" element={<AdminApplicants />} />
        <Route path="/skill-assessments" element={<SkillAssessmentSelection />} />
        <Route path="/admin-skill-assessments" element={<AdminSkillAssessments />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/skill-assessment" element={<SkillAssessmentAttempt />} />
        <Route path="/skill-assessment-result" element={<SkillAssessmentResult />} />
      </Routes>
    </Router>
  );
}

export default App;
