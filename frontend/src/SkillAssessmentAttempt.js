import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import MCQAssessment from './MCQAssessment';

function SkillAssessmentAttempt() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [mcqQuestions, setMcqQuestions] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const role = params.get('role');
    const username = localStorage.getItem('username');

    useEffect(() => {
        if (!username) {
            navigate('/login');
            return;
        }
        // Check if user is shortlisted for this role
        axios.get(`http://localhost:5000/get-scheduled-skill-assessments?username=${username}`)
            .then(res => {
                const found = res.data.find(a => a.role === role);
                if (!found) {
                    setError('You are not enabled for this skill assessment.');
                } else {
                    // Fetch MCQ questions from backend
                    axios.post('http://localhost:5000/get-skill-assessment-questions', { username, role })
                        .then(res => {
                            // If backend returns MCQ format, use it; else fallback to open-ended
                            if (res.data.mcq_questions) {
                                setMcqQuestions(res.data.mcq_questions);
                            } else {
                                setQuestions(res.data.questions || []);
                                setAnswers(Array(res.data.questions.length).fill(''));
                            }
                        });
                }
            });
    }, [role, username, navigate]);

    const handleChange = (idx, value) => {
        const newAnswers = [...answers];
        newAnswers[idx] = value;
        setAnswers(newAnswers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            // Evaluate each answer
            const scores = [];
            const feedbacks = [];
            for (let i = 0; i < questions.length; i++) {
                const res = await axios.post('http://localhost:5000/evaluate-answer', {
                    question: questions[i],
                    answer: answers[i],
                    role,
                    job_desc: { role }
                });
                scores.push(res.data.score);
                feedbacks.push(res.data.feedback || '');
            }
            // Submit assessment
            const submitRes = await axios.post('http://localhost:5000/submit-skill-assessment', {
                username,
                role,
                questions,
                answers,
                scores,
                feedbacks
            });
            // Calculate percent score
            const totalScore = scores.reduce((a, b) => a + b, 0);
            const maxScore = scores.length * 10;
            const percent = (totalScore / maxScore) * 100;
            // Navigate to result page with score and per-question details
            navigate('/skill-assessment-result', { state: { score: percent, questions: submitRes.data.questions } });
        } catch (err) {
            setError('Error submitting assessment. Please try again.');
        }
        setSubmitting(false);
    };

    // MCQ submission handler
    const handleMCQSubmit = async (selectedOptions) => {
        setSubmitting(true);
        setError('');
        try {
            // Evaluate MCQ answers
            const userAnswers = selectedOptions.map((optIdx, i) =>
                mcqQuestions[i].options[optIdx] || ''
            );
            const correctAnswers = mcqQuestions.map(q => q.correct_answer);
            let correctCount = 0;
            const scores = [];
            const feedbacks = [];
            for (let i = 0; i < mcqQuestions.length; i++) {
                const isCorrect = userAnswers[i] === correctAnswers[i];
                scores.push(isCorrect ? 10 : 0);
                feedbacks.push(isCorrect ? 'Correct' : 'Incorrect');
                if (isCorrect) correctCount++;
            }
            const percent = (correctCount / mcqQuestions.length) * 100;
            // Submit to backend for record
            const submitRes = await axios.post('http://localhost:5000/submit-skill-assessment', {
                username,
                role,
                questions: mcqQuestions.map(q => q.question),
                answers: userAnswers,
                scores,
                feedbacks
            });
            // Navigate to result page with score and per-question details
            navigate('/skill-assessment-result', { state: { score: percent, questions: submitRes.data.questions } });
        } catch (err) {
            setError('Error submitting assessment. Please try again.');
        }
        setSubmitting(false);
    };

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</div>;
    }
    if (mcqQuestions) {
        return <MCQAssessment questions={mcqQuestions} onSubmit={handleMCQSubmit} submitting={submitting} />;
    }
    if (!questions.length) {
        return <div style={{ textAlign: 'center', marginTop: 40 }}>Loading assessment...</div>;
    }
    return (
        <div style={{ maxWidth: 700, margin: '2rem auto', background: '#fff', padding: 32, borderRadius: 12, color: '#232327' }}>
            <h2 style={{ color: '#2196F3', marginBottom: 24 }}>Skill Assessment for {role}</h2>
            <form onSubmit={handleSubmit}>
                {questions.map((q, idx) => (
                    <div key={idx} style={{ marginBottom: 24 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>Q{idx + 1}: {q}</div>
                        <textarea
                            value={answers[idx]}
                            onChange={e => handleChange(idx, e.target.value)}
                            rows={3}
                            style={{ width: '100%', borderRadius: 6, border: '1.5px solid #2196F3', padding: 10, fontSize: 16 }}
                            required
                        />
                    </div>
                ))}
                <button type="submit" disabled={submitting} style={{ background: '#4CAF50', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 8, fontSize: 20, fontWeight: 600, cursor: 'pointer', marginTop: 16 }}>
                    {submitting ? 'Submitting...' : 'Submit Assessment'}
                </button>
            </form>
        </div>
    );
}

export default SkillAssessmentAttempt;
