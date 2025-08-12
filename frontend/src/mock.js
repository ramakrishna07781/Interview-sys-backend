import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GrPrevious, GrNext } from 'react-icons/gr';
import { BsCameraVideo, BsMic } from 'react-icons/bs';
import './mock.css'

export default function Tab() {
    const initialQuestions =
    {
        "MCQ_Questions": {
         "testname": "Technical",
         "questions": [
          {
           "question": "What is the full form of RAM?",
           "category": "CSE",
           "options": [
            "Random Access Memory",
            "Read Access Memory",
            "Random Access Machine",
            "Read Access Machine"
           ],
           "correct_answer": "Random Access Memory"
          },
          {
           "question": "What is the full form of CPU?",
           "category": "CSE",
           "options": [
            "Central Processing Unit",
            "Central Processing Unit",
            "Central Processing Unit",
            "Central Processing Unit"
           ],
           "correct_answer": "Central Processing Unit"
          },
          {
           "question": "What is the full form of GPU?",
           "category": "CSE",
           "options": [
            "Graphics Processing Unit",
            "Graphic Processing Unit",
            "Graphics Processing Unit",
            "Graphics Processing Unit"
           ],
           "correct_answer": "Graphics Processing Unit"
          },
          {
           "question": "What is the full form of SSD?",
           "category": "CSE",
           "options": [
            "Solid State Drive",
            "Solid State Drive",
            "Solid State Drive",
            "Solid State Drive"
           ],
           "correct_answer": "Solid State Drive"
          },
          {
           "question": "What is the full form of HDD?",
           "category": "CSE",
           "options": [
            "Hard Disk Drive",
            "Hard Disk Drive",
            "Hard Disk Drive",
            "Hard Disk Drive"
           ],
           "correct_answer": "Hard Disk Drive"
          },
          {
           "question": "What is the full form of OS?",
           "category": "CSE",
           "options": [
            "Operating System",
            "Operating System",
            "Operating System",
            "Operating System"
           ],
           "correct_answer": "Operating System"
          },
          {
           "question": "What is the full form of IDE?",
           "category": "CSE",
           "options": [
            "Integrated Development Environment",
            "Integrated Development Environment",
            "Integrated Development Environment",
            "Integrated Development Environment"
           ],
           "correct_answer": "Integrated Development Environment"
          },
          {
           "question": "What is the full form of IDE?",
           "category": "CSE",
           "options": [
            "Integrated Development Environment",
            "Integrated Development Environment",
            "Integrated Development Environment",
            "Integrated Development Environment"
           ],
           "correct_answer": "Integrated Development Environment"
          },
          {
           "question": "What is the full form of JDK?",
           "category": "CSE",
           "options": [
            "Java Development Kit",
            "Java Development Kit",
            "Java Development Kit",
            "Java Development Kit"
           ],
           "correct_answer": "Java Development Kit"
          },
          {
           "question": "What is the full form of JRE?",
           "category": "CSE",
           "options": [
            "Java Runtime Environment",
            "Java Runtime Environment",
            "Java Runtime Environment",
            "Java Runtime Environment"
           ],
           "correct_answer": "Java Runtime Environment"
          },
          {
           "question": "What is the full form of JVM?",
           "category": "CSE",
           "options": [
            "Java Virtual Machine",
            "Java Virtual Machine",
            "Java Virtual Machine",
            "Java Virtual Machine"
           ],
           "correct_answer": "Java Virtual Machine"
          },
          {
           "question": "What is the full form of API?",
           "category": "CSE",
           "options": [
            "Application Programming Interface",
            "Application Programming Interface",
            "Application Programming Interface",
            "Application Programming Interface"
           ],
           "correct_answer": "Application Programming Interface"
          },
          {
           "question": "What is the full form of CLI?",
           "category": "CSE",
           "options": [
            "Command Line Interface",
            "Command Line Interface",
            "Command Line Interface",
            "Command Line Interface"
           ],
           "correct_answer": "Command Line Interface"
          },
          {
           "question": "What is the full form of GUI?",
           "category": "CSE",
           "options": [
            "Graphical User Interface",
            "Graphical User Interface",
            "Graphical User Interface",
            "Graphical User Interface"
           ],
           "correct_answer": "Graphical User Interface"
          },
          {
           "question": "What is the full form of WWW?",
           "category": "CSE",
           "options": [
            "World Wide Web",
            "World Wide Web",
            "World Wide Web",
            "World Wide Web"
           ],
           "correct_answer": "World Wide Web"
          }
         ]
        }
       }

       const questions = initialQuestions.MCQ_Questions.questions;

       const [currentQuestion, setCurrentQuestion] = useState(1);
       const [answeredQuestions, setAnsweredQuestions] = useState([]);
       const [selectedOption, setSelectedOption] = useState(null);
   
   
       const handlePrev = () => {
           setCurrentQuestion((prevQuestion) => Math.max(1, prevQuestion - 1));
           setSelectedOption(null);
       };
   
       const handleNext = () => {
           setCurrentQuestion((prevQuestion) => Math.min(questions.length, prevQuestion + 1));
           setSelectedOption(null);
       };
   
       const handleQuestionClick = (questionId) => {
           setCurrentQuestion(questionId);
           setSelectedOption(null);
       };
   
       const handleAnswerClick = (optionIndex) => {
           setSelectedOptions((prevSelectedOptions) => {
               const updatedOptions = [...prevSelectedOptions];
               updatedOptions[currentQuestion - 1] = optionIndex;
               return updatedOptions;
           });
           setAnsweredQuestions((prevAnswers) => [...prevAnswers, currentQuestion]);
       };
   
       const [selectedOptions, setSelectedOptions] = useState(Array.from({ length: questions.length }, () => null));
   
       const handleClear = () => {
           setSelectedOptions((opt) => {
               const options = [...opt];
               options[currentQuestion - 1] = null;
               return options;
           });
           setAnsweredQuestions((prevAnswers) => prevAnswers.filter(answer => answer !== currentQuestion));
       }
   
       const isQuestionAnswered = (questionId) => {
           return answeredQuestions.includes(questionId);
       };

      
   
       return (
        <>
        <div className='complete'>
        <div className="left-panel">

            {/* <div className='tabs'>
                <Link to='/maths'>Maths</Link>
                <Link to='/physics'>Physics</Link>
                <Link to='/chemistry'>Chemistry</Link>
            </div> */}

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
                <button onClick={handlePrev} disabled={currentQuestion === 1}>
                    <GrPrevious />
                </button>
                <button onClick={handleClear} disabled={currentQuestion === questions.length}>
                    Clear Response
                </button>
                <button onClick={handleNext} disabled={currentQuestion === questions.length}>
                    <GrNext />
                </button>
            </div>
        </div>

        <div className="right-panel">
            <h3>Questions</h3>
            <div className="question-buttons">
                {questions.map((q,index) => (
                    <button
                        key={index}
                        onClick={() => handleQuestionClick(index+1)}
                        className={`question-button ${currentQuestion === index+1 ? 'focused' : ''} ${isQuestionAnswered(index+1) ? 'answered' : ''}`}>
                        {index+1}
                    </button>
                ))}
            </div>
        </div>
    </div>
    </>
       )
   }
   