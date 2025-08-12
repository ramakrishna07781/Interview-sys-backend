// Filename: Resume.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ResumeForm.css';
const Resume = React.forwardRef((props, ref) => {
    const { data } = props;
    const navigate = useNavigate();
    return (
        <div>
            <button className="back-button" onClick={() => navigate(-1)} style={{ position: 'absolute', top: 20, left: 20, padding: '8px 18px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 8px #0002' }}>← Back</button>
            <div className="container" ref={ref}>
                <div className="name">
                    <h1 className='heading'>{data.name}</h1>
                    <p>{data.phone} · {data.email}</p>
                    <p>@reallygreatsite 123 Anywhere St., Any City, ST 12345</p>
                </div>
                <div className="about">
                    <h2 className='heading'>Professional Summary</h2>
                    <p>{data.summary}</p>
                </div>
                <div className="skills">
                    <h2 className='heading'>Skills</h2>
                    <ul>
                        {Array.isArray(data.skills) && data.skills.length > 0 ? (
                            data.skills.map((skill, idx) => <li key={idx}>{skill}</li>)
                        ) : (
                            <li>No skills listed</li>
                        )}
                    </ul>
                </div>
                <div className="education">
                    <h2 className='heading'>Education</h2>
                    {Array.isArray(data.education) && data.education.length > 0 ? (
                        data.education.map((edu, idx) => (
                            <div className="degree-title" key={idx}>
                                <h4>{edu.degree}</h4>
                                <p>{edu.college}, {edu.year}</p>
                            </div>
                        ))
                    ) : (
                        <p>No education details</p>
                    )}
                </div>
                <div className="experience">
                    <h2 className='heading'>Experience</h2>
                    {Array.isArray(data.experience) && data.experience.length > 0 ? (
                        data.experience.map((exp, idx) => (
                            <div className="exp-item" key={idx}>
                                <h4>{exp.role} at {exp.company}</h4>
                                <p><i>{exp.duration}</i></p>
                                <p>{exp.summary}</p>
                            </div>
                        ))
                    ) : (
                        <p>No experience listed</p>
                    )}
                </div>
                <div className="certifications">
                    <h2 className='heading'>Certifications</h2>
                    <ul>
                        {Array.isArray(data.certifications) && data.certifications.length > 0 ? (
                            data.certifications.map((cert, idx) => <li key={idx}>{cert}</li>)
                        ) : (
                            <li>No certifications listed</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
});


export default Resume;