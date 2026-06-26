// src/pages/InterviewRoom.jsx
import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function InterviewRoom() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(location.state?.firstQuestion || "Loading question...");
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      return alert("write your answer!");
    }
    setLoading(true);

    try {
      if (questionCount >= 5) {
        navigate(`/report/${id}`);
        return;
      }

      const res = await axios.post('http://localhost:5000/api/interview/answer', { 
        interviewId: id, 
        userAnswer 
      });

      if (res.data.success) {
        setCurrentQuestion(res.data.nextQuestion); 
        setUserAnswer(''); 
        setQuestionCount(prev => prev + 1); 
      }
    } catch (err) {
      alert("Error submitting answer: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      {/* Top Bar Indicators */}
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '10px', fontSize: '14px', fontWeight: '500' }}>
        <span>📝 Written Interview Mode</span>
        <span style={{ color: '#2563eb' }}>Question: {questionCount} / 5</span>
      </div>

      {/* AI Question Box */}
      <h4 style={{ color: '#2563eb', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>🤖</span> AI Interviewer:
      </h4>
      <p style={{ fontSize: '17px', fontWeight: '500', color: '#0f172a', background: '#fff', padding: '16px', borderRadius: '6px', border: '1px solid #edf2f7', lineHeight: '1.6', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)' }}>
        {currentQuestion}
      </p>
      
      {/* Typing Answer Box */}
      <div style={{ marginTop: '24px' }}>
        <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px', color: '#334155', fontSize: '14px' }}>
          Type Your Answer Below:
        </label>
        <textarea 
          value={userAnswer} 
          onChange={(e) => setUserAnswer(e.target.value)} 
          placeholder="write your answer here" 
          style={{ 
            width: '100%', 
            height: '150px', 
            padding: '14px', 
            borderRadius: '8px', 
            border: '1px solid #cbd5e1', 
            fontSize: '15px', 
            boxSizing: 'border-box', 
            backgroundColor: '#fff', 
            resize: 'vertical',
            lineHeight: '1.5',
            outline: 'none',
            fontFamily: 'inherit'
          }} 
          disabled={loading}
        />
      </div>

      {/* Action Button */}
      <button 
        onClick={submitAnswer} 
        disabled={loading} 
        style={{ 
          width: '100%', 
          marginTop: '20px', 
          padding: '14px', 
          backgroundColor: loading ? '#94a3b8' : '#0f172a', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '6px', 
          fontWeight: '600', 
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          transition: 'background-color 0.2s'
        }}
      >
        {loading ? "AI is reviewing & generating next question..." : "Submit Answer & Next Question ➡️"}
      </button>
    </div>
  );
}

export default InterviewRoom;