import React, { useState } from 'react';
import './mock.css';

export default function MCQAssessment({ questions, onSubmit, submitting }) {
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState(Array.from({ length: questions.length }, () => null));

    const handlePrev = () => {
        setCurrentQuestion((prevQuestion) => Math.max(1, prevQuestion - 1));
    };

    const handleNext = () => {
        setCurrentQuestion((prevQuestion) => Math.min(questions.length, prevQuestion + 1));
    };

    const handleQuestionClick = (questionId) => {
        setCurrentQuestion(questionId);
    };

    const handleAnswerClick = (optionIndex) => {
        setSelectedOptions((prevSelectedOptions) => {
            const updatedOptions = [...prevSelectedOptions];
            updatedOptions[currentQuestion - 1] = optionIndex;
            return updatedOptions;
        });
        setAnsweredQuestions((prevAnswers) => {
            if (!prevAnswers.includes(currentQuestion)) {
                return [...prevAnswers, currentQuestion];
            }
            return prevAnswers;
        });
    };

    const handleClear = () => {
        setSelectedOptions((opt) => {
            const options = [...opt];
            options[currentQuestion - 1] = null;
            return options;
        });
        setAnsweredQuestions((prevAnswers) => prevAnswers.filter(answer => answer !== currentQuestion));
    };

    const isQuestionAnswered = (questionId) => {
        return answeredQuestions.includes(questionId);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(selectedOptions);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='complete'>
                <div className="left-panel">
                    <h2>{currentQuestion}. {questions[currentQuestion - 1].question}</h2>
                    <ul>
                        {questions[currentQuestion - 1].options.map((option, index) => (
                            <li
                                key={index}
                                onClick={() => handleAnswerClick(index)}
                                className={`option ${selectedOptions[currentQuestion - 1] === index ? 'selected' : ''}`}>
                                {String.fromCharCode(65 + index)}. {option}
                            </li>
                        ))}
                    </ul>
                    <div className="buttons">
                        <button type="button" onClick={handlePrev} disabled={currentQuestion === 1}>
                            Prev
                        </button>
                        <button type="button" onClick={handleClear}>
                            Clear Response
                        </button>
                        <button type="button" onClick={handleNext} disabled={currentQuestion === questions.length}>
                            Next
                        </button>
                    </div>
                </div>
                <div className="right-panel">
                    <h3>Questions</h3>
                    <div className="question-buttons">
                        {questions.map((q, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleQuestionClick(index + 1)}
                                className={`question-button ${currentQuestion === index + 1 ? 'focused' : ''} ${isQuestionAnswered(index + 1) ? 'answered' : ''}`}>
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
                <button type="submit" disabled={submitting} style={{ background: '#4CAF50', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 8, fontSize: 20, fontWeight: 600, cursor: 'pointer' }}>
                    {submitting ? 'Submitting...' : 'Submit Assessment'}
                </button>
            </div>
        </form>
    );
}
