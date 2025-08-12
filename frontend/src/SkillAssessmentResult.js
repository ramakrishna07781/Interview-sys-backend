import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

export default function SkillAssessmentResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const { score = 0, questions = [] } = location.state || {};

    // Guard: if score is not a number, show error
    if (typeof score !== 'number' || isNaN(score)) {
        return (
            <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>
                Invalid score data. Please retake the assessment.<br />
                <button onClick={() => navigate('/skill-assessments')} style={{ background: '#2196F3', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 8, fontSize: 18, fontWeight: 600, cursor: 'pointer', marginTop: 16 }}>
                    Back to Skill Assessments
                </button>
            </div>
        );
    }

    const passed = score >= 80;

    const data = {
        labels: ['Correct', 'Incorrect'],
        datasets: [
            {
                data: [score, 100 - score],
                backgroundColor: [passed ? '#4CAF50' : '#f44336', '#e0e0e0'],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false,
            },
        },
        cutout: '70%',
    };

    return (
        <div style={{ maxWidth: 600, margin: '3rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0002', padding: '2.5rem 2rem', textAlign: 'center', color: '#232327' }}>
            <h2 style={{ color: passed ? '#4CAF50' : '#f44336', fontWeight: 700, fontSize: 32, marginBottom: 16 }}>
                {passed ? 'Congratulations! You passed the skill assessment.' : 'Try again. You did not pass.'}
            </h2>
            <div style={{ width: 220, margin: '0 auto 24px' }}>
                <Pie data={data} options={options} />
                <div style={{
                    position: 'relative',
                    top: '-140px',
                    fontSize: 32,
                    fontWeight: 700,
                    color: passed ? '#4CAF50' : '#f44336',
                    textShadow: '0 2px 8px #0001',
                }}>{score}%</div>
            </div>
            <div style={{ fontSize: 20, marginBottom: 24, color: passed ? '#388e3c' : '#b71c1c' }}>
                {passed ? 'Great job! You are eligible for the next round.' : 'You need at least 80% to pass.'}
            </div>
            {Array.isArray(questions) && questions.length > 0 && (
                <div style={{ margin: '32px 0', textAlign: 'left' }}>
                    <h3 style={{ color: '#2196F3', fontWeight: 700, marginBottom: 12 }}>Question-wise Review</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f9f9f9', borderRadius: 8 }}>
                            <thead>
                                <tr style={{ background: '#e3f2fd' }}>
                                    <th style={{ padding: 8, border: '1px solid #ddd' }}>#</th>
                                    <th style={{ padding: 8, border: '1px solid #ddd' }}>Question</th>
                                    <th style={{ padding: 8, border: '1px solid #ddd' }}>Your Answer</th>
                                    <th style={{ padding: 8, border: '1px solid #ddd' }}>Score</th>
                                    <th style={{ padding: 8, border: '1px solid #ddd' }}>Feedback</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions.map((q, i) => (
                                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f1f8e9' }}>
                                        <td style={{ padding: 8, border: '1px solid #ddd', fontWeight: 600 }}>{i + 1}</td>
                                        <td style={{ padding: 8, border: '1px solid #ddd' }}>{q.question}</td>
                                        <td style={{ padding: 8, border: '1px solid #ddd' }}>{q.answer}</td>
                                        <td style={{ padding: 8, border: '1px solid #ddd', color: q.score >= 7 ? '#4CAF50' : q.score > 0 ? '#FFC107' : '#F44336', fontWeight: 700 }}>{q.score}</td>
                                        <td style={{ padding: 8, border: '1px solid #ddd', color: '#2196F3' }}>{q.feedback}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <button onClick={() => navigate('/skill-assessments')} style={{ background: '#2196F3', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 8, fontSize: 18, fontWeight: 600, cursor: 'pointer' }}>
                Back to Skill Assessments
            </button>
        </div>
    );
}
