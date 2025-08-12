import React, { useState } from 'react';
import axios from 'axios';
import './ResumeForm.css';
import { useNavigate } from 'react-router-dom';

function ResumeForm({ onResumeReady }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    urls: '',
    summary: '',
    skills: [],
    achievements: '',
    certifications: [''],
    education: [{ degree: '', college: '', year: '' }],
    experience: [{ role: '', company: '', duration: '', summary: '' }],
  });
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [rephrased, setRephrased] = useState({ summary: '' });
  const [loadingAI, setLoadingAI] = useState(false);

  // Dynamic handlers for education/experience/certifications
  const handleAdd = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], field === 'education' ? { degree: '', college: '', year: '' } : field === 'experience' ? { role: '', company: '', duration: '', summary: '' } : '']
    }));
  };
  const handleRemove = (field, idx) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx)
    }));
  };
  const handleDynamicChange = (field, idx, subfield, value) => {
    setFormData((prev) => {
      const arr = [...prev[field]];
      if (typeof arr[idx] === 'object') arr[idx][subfield] = value;
      else arr[idx] = value;
      return { ...prev, [field]: arr };
    });
  };

  // AI rephrase handler
  const handleAIRephrase = async (field, value) => {
    setLoadingAI(true);
    try {
      const res = await axios.post('http://localhost:5000/ai-rephrase', { field, value });
      setRephrased((prev) => ({ ...prev, [field]: res.data.rephrased }));
      if (res.data.suggested_skills) setSuggestedSkills(res.data.suggested_skills);
    } catch (e) {
      setRephrased((prev) => ({ ...prev, [field]: value }));
    }
    setLoadingAI(false);
  };

  // Add skill from AI suggestion
  const addSkill = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };
  // Remove skill
  const removeSkill = (skill) => {
    setFormData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  // Handle normal input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle skills input (comma separated)
  const handleSkillsInput = (e) => {
    setFormData((prev) => ({ ...prev, skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }));
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    const resumeObj = {
      ...formData,
      summary: rephrased.summary || formData.summary,
    };
    if (typeof onResumeReady === 'function') onResumeReady(resumeObj);
  };

  return (
    <div className="resume-builder-bg">
      <button
        type="button"
        className="back-btn"
        onClick={() => navigate('/')}
        style={{ margin: '24px 0 0 24px', background: '#fff', color: '#2196F3', border: '1.5px solid #2196F3', borderRadius: 8, padding: '8px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}
      >
        ← Back to Home
      </button>
      <form className="resume-form-advanced" onSubmit={handleGenerate}>
        <h1 className="resume-title">AI Resume Builder</h1>
        <div className="resume-row">
          <div className="resume-col">
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
            <label>Email</label>
            <input name="email" value={formData.email} onChange={handleChange} required />
            <label>Phone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} required />
            <label>URLs (LinkedIn, GitHub, etc.)</label>
            <input name="urls" value={formData.urls} onChange={handleChange} placeholder="Comma separated" />
          </div>
          <div className="resume-col">
            <label>Professional Summary</label>
            <textarea name="summary" value={formData.summary} onChange={handleChange} onBlur={e => handleAIRephrase('summary', e.target.value)} />
            {loadingAI && <div className="ai-loading">AI is rephrasing...</div>}
            {rephrased.summary && <div className="ai-suggestion"><b>AI Suggestion:</b> {rephrased.summary}</div>}
            <label>Skills</label>
            <input name="skillsInput" value={formData.skills.join(', ')} onChange={handleSkillsInput} placeholder="Comma separated" />
            <div className="skills-chips">
              {formData.skills.map((skill, idx) => (
                <span className="chip" key={idx} onClick={() => removeSkill(skill)}>{skill} ×</span>
              ))}
              {suggestedSkills.map((skill, idx) => (
                <span className="chip chip-suggested" key={skill} onClick={() => addSkill(skill)}>{skill} +</span>
              ))}
            </div>
            <label>Achievements</label>
            <textarea name="achievements" value={formData.achievements} onChange={handleChange} placeholder="Comma separated or one per line" />
          </div>
        </div>
        <div className="resume-row">
          <div className="resume-col">
            <label>Education</label>
            {formData.education.map((edu, idx) => (
              <div className="dynamic-section" key={idx}>
                <input placeholder="Degree" value={edu.degree} onChange={e => handleDynamicChange('education', idx, 'degree', e.target.value)} />
                <input placeholder="College" value={edu.college} onChange={e => handleDynamicChange('education', idx, 'college', e.target.value)} />
                <input placeholder="Year" value={edu.year} onChange={e => handleDynamicChange('education', idx, 'year', e.target.value)} />
                <button type="button" className="remove-btn" onClick={() => handleRemove('education', idx)} disabled={formData.education.length === 1}>
                  <span role="img" aria-label="Delete">🗑️</span>
                </button>
                {idx === formData.education.length - 1 && <button type="button" className="add-btn" onClick={() => handleAdd('education')}><span role="img" aria-label="Add">➕</span></button>}
              </div>
            ))}
          </div>
          <div className="resume-col">
            <label>Experience</label>
            {formData.experience.map((exp, idx) => (
              <div className="dynamic-section" key={idx}>
                <input placeholder="Role" value={exp.role} onChange={e => handleDynamicChange('experience', idx, 'role', e.target.value)} />
                <input placeholder="Company" value={exp.company} onChange={e => handleDynamicChange('experience', idx, 'company', e.target.value)} />
                <input placeholder="Duration" value={exp.duration} onChange={e => handleDynamicChange('experience', idx, 'duration', e.target.value)} />
                <textarea placeholder="Summary" value={exp.summary} onChange={e => handleDynamicChange('experience', idx, 'summary', e.target.value)} />
                <button type="button" className="remove-btn" onClick={() => handleRemove('experience', idx)} disabled={formData.experience.length === 1}>
                  <span role="img" aria-label="Delete">🗑️</span>
                </button>
                {idx === formData.experience.length - 1 && <button type="button" className="add-btn" onClick={() => handleAdd('experience')}><span role="img" aria-label="Add">➕</span></button>}
              </div>
            ))}
          </div>
          <div className="resume-col">
            <label>Certifications</label>
            {formData.certifications.map((cert, idx) => (
              <div className="dynamic-section" key={idx}>
                <input placeholder="Certification" value={cert} onChange={e => handleDynamicChange('certifications', idx, null, e.target.value)} />
                <button type="button" className="remove-btn" onClick={() => handleRemove('certifications', idx)} disabled={formData.certifications.length === 1}>
                  <span role="img" aria-label="Delete">🗑️</span>
                </button>
                {idx === formData.certifications.length - 1 && <button type="button" className="add-btn" onClick={() => handleAdd('certifications')}><span role="img" aria-label="Add">➕</span></button>}
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button className="regbutton" type="submit" style={{ fontSize: 20, padding: '12px 40px', borderRadius: 8, background: '#2196F3', color: '#fff', fontWeight: 600, border: 'none', boxShadow: '0 2px 8px #0001' }}>
            Generate Resume
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResumeForm;
