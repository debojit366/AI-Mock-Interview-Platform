import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({ role: 'MERN Developer', experience: 'Fresher', companyType: 'Google' });
  const [interviewId, setInterviewId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/interview/setup', formData);
      setInterviewId(res.data.interviewId);
      setCurrentQuestion(res.data.question);
    } catch (err) {
      alert("Backend connection failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🎙️ AI Mock Interview Platform</h2>
      <hr /><br />

      {!interviewId ? (
        <div>
          <h3>Interview Configuration</h3>
          <label>Target Role: </label>
          <input 
            type="text" 
            value={formData.role} 
            onChange={(e) => setFormData({...formData, role: e.target.value})} 
            style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
          />
          
          <label>Target Company: </label>
          <input 
            type="text" 
            value={formData.companyType} 
            onChange={(e) => setFormData({...formData, companyType: e.target.value})} 
            style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
          />

          <button onClick={startInterview} disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            {loading ? "Generating First Question..." : "Start Interview"}
          </button>
        </div>
      ) : (
        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '8px' }}>
          <h4>🤖 AI Interviewer:</h4>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#18181b' }}>{currentQuestion}</p>
          
          <br />
          <div style={{ border: '2px dashed #cbd5e1', padding: '20px', textAlign: 'center', borderRadius: '6px' }}>
            
            <p style={{ color: '#64748b' }}>Mic Integration & Text-to-Speech logic comes here</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;