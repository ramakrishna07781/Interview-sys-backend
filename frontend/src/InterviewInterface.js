import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Video from 'twilio-video';
import { BsCameraVideo, BsMic, BsCameraVideoOff, BsMicMute, BsFillPersonFill } from 'react-icons/bs';
import { FaCheckCircle } from 'react-icons/fa';
import './mock.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function InterviewInterface() {
  const query = useQuery();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState({});
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const localVideoRef = useRef();
  const [videoTrack, setVideoTrack] = useState(null);
  const [audioTrack, setAudioTrack] = useState(null);
  const recognitionRef = useRef(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const sessionId = localStorage.getItem('sessionId');

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      // Fetch questions for the selected role
      const role = query.get('role');
      const username = localStorage.getItem('username');
      const response = await axios.post('http://localhost:5000/get_questions', { username, role });
      if (response.data && response.data.questions) {
        // eslint-disable-next-line no-console
        console.log('Questions:', response.data.questions);
        setQuestions(response.data.questions);
      } else {
        setQuestions([]);
      }
      setLoading(false);
    };
    fetchQuestions();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    const handleVideoToggle = async () => {
      if (isVideoEnabled) {
        const track = await Video.createLocalVideoTrack();
        setVideoTrack(track);
        localVideoRef.current.appendChild(track.attach());
      } else if (videoTrack) {
        videoTrack.stop();
        localVideoRef.current.innerHTML = '';
        setVideoTrack(null);
      }
    };
    handleVideoToggle();
    // eslint-disable-next-line
  }, [isVideoEnabled]);
  useEffect(() => {
    const handleAudioToggle = async () => {
      if (isAudioEnabled) {
        const track = await Video.createLocalAudioTrack();
        setAudioTrack(track);
      } else if (audioTrack) {
        audioTrack.stop();
        setAudioTrack(null);
      }
    };
    handleAudioToggle();
    // eslint-disable-next-line
  }, [isAudioEnabled]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setCurrentAnswer(currentAnswer => currentAnswer + event.results[i][0].transcript);
          }
        }
      };
      recognitionRef.current = recognition;
    } else {
      console.log('Speech recognition not available.');
    }
  }, []);

  useEffect(() => {
    if (isAudioEnabled) {
      recognitionRef.current?.start();
    } else {
      recognitionRef.current?.stop();
    }
  }, [isAudioEnabled]);

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const handleNext = async () => {
    const question = questions[currentQuestionIndex];
    setAnswers({ ...answers, [question]: currentAnswer });
    await axios.post('http://localhost:5000/log-question', {
      session_id: sessionId,
      question,
      answer: currentAnswer
    });
    setCurrentAnswer('');
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const question = questions[currentQuestionIndex];
    setAnswers({ ...answers, [question]: currentAnswer });
    await axios.post('http://localhost:5000/log-question', {
      session_id: sessionId,
      question,
      answer: currentAnswer
    });
    const username = localStorage.getItem('username');
    const role = query.get('role');
    // Prepare answers and scores arrays for backend
    const answersArr = questions.map(q => answers[q] || (q === question ? currentAnswer : ''));
    // For now, send empty scores array (or you can collect scores if available)
    const scoresArr = [];
    await axios.post('http://localhost:5000/submit-interview', {
      username,
      role,
      questions,
      answers: answersArr,
      scores: scoresArr
    });
    navigate('/results');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#18191a' }}>
        <div className="loader"></div>
        <div className="loader-text">Generating your personalized interview questions...</div>
      </div>
    );
  }

  if (submitting) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#18191a' }}>
        <div className="loader"></div>
        <div className="loader-text">Evaluating your interview... Please wait.</div>
      </div>
    );
  }

  // Progress bar
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="interview-advanced-layout" style={{ display: 'flex', height: '100vh', background: '#18191a' }}>
      <button className="back-button" onClick={() => navigate(-1)} style={{ position: 'absolute', top: 20, left: 20, padding: '8px 18px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 8px #0002' }}>← Back</button>
      {/* Left: Question */}
      <div className="interview-left-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#232327', color: '#fff', borderRight: '1px solid #333' }}>
        <div style={{ width: '90%', margin: '2rem 0' }}>
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontWeight: 600, fontSize: 18, color: '#4CAF50' }}>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <div style={{ height: 8, background: '#333', borderRadius: 4, marginTop: 8 }}>
              <div style={{ width: `${progress}%`, height: '100%', background: '#4CAF50', borderRadius: 4, transition: 'width 0.3s' }}></div>
            </div>
          </div>
          <div style={{ fontSize: 22, minHeight: 80, marginBottom: 24 }}>{questions[currentQuestionIndex]}</div>
        </div>
      </div>
      {/* Center: Video */}
      <div className="interview-center-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#18191a' }}>
        <div style={{ background: '#232327', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px #0002', marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 220, height: 160, background: '#111', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, position: 'relative', overflow: 'hidden' }}>
            <div ref={localVideoRef} style={{ width: '100%', height: '100%', objectFit: 'cover', overflow: 'hidden' }}></div>
            {!isVideoEnabled && <BsFillPersonFill size={80} color="#444" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} />}
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <button onClick={toggleVideo} style={{ background: isVideoEnabled ? '#4CAF50' : '#333', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 18, cursor: 'pointer', overflow: 'hidden' }}>
              {isVideoEnabled ? <BsCameraVideo /> : <BsCameraVideoOff />} {isVideoEnabled ? 'Video On' : 'Video Off'}
            </button>
            <button onClick={toggleAudio} style={{ background: isAudioEnabled ? '#4CAF50' : '#333', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 18, cursor: 'pointer' }}>
              {isAudioEnabled ? <BsMic /> : <BsMicMute />} {isAudioEnabled ? 'Mic On' : 'Mic Off'}
            </button>
          </div>
        </div>
        <button onClick={() => setShowConfirmation(true)} style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontSize: 18, fontWeight: 600, marginTop: 16, cursor: 'pointer' }}>End Interview</button>
      </div>
      {/* Right: Answer */}
      <div className="interview-right-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#232327', color: '#fff', borderLeft: '1px solid #333' }}>
        <div style={{ width: '90%', margin: '2rem 0' }}>
          <textarea
            className="answer-box"
            value={currentAnswer}
            onChange={e => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer or use voice..."
            style={{ width: '100%', minHeight: 120, fontSize: 18, borderRadius: 8, border: '1px solid #4CAF50', padding: 16, background: '#18191a', color: '#fff', marginBottom: 24 }}
          />
          <div className="interview-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
            <button className="next-btn" onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1 || !currentAnswer} style={{ background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontSize: 18, fontWeight: 600, boxShadow: 'none', cursor: currentQuestionIndex === questions.length - 1 || !currentAnswer ? 'not-allowed' : 'pointer' }}>Next</button>
            <button className="end-btn" onClick={handleSubmit} disabled={currentQuestionIndex !== questions.length - 1 || !currentAnswer} style={{ background: '#2196F3', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: 'none', cursor: currentQuestionIndex !== questions.length - 1 || !currentAnswer ? 'not-allowed' : 'pointer' }}>
              <FaCheckCircle /> Submit Interview
            </button>
          </div>
        </div>
      </div>
      {showConfirmation && (
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', borderRadius: '8px', zIndex: 1000 }}>
          <h2>Confirm End Interview</h2>
          <p>Are you sure you want to end the interview?</p>
          <button onClick={handleSubmit}>Yes, End It</button>
          <button onClick={() => setShowConfirmation(false)}>No, Go Back</button>
        </div>
      )}
    </div>
  );
}
export default InterviewInterface;
