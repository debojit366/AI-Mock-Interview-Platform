// src/pages/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [formData, setFormData] = useState({ role: 'MERN Developer', experience: 'Fresher', companyType: 'Google' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/interview/setup', formData);
      if (res.data.success) {
        navigate(`/interview/${res.data.interviewId}`, { state: { firstQuestion: res.data.question } });
      }
    } catch (err) {
      alert("Backend connection error: " + err.message);
    }
    setLoading(false);
  };

  const selectStyle = { width: '100%', padding: '10px', marginBottom: '18px', borderRadius: '6px', border: '1px solid #cbd5e1' };

  return (
    <div style={{ background: '#ffffff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
      <h3 style={{ marginTop: 0, color: '#0f172a' }}>Configure Your Session</h3>
      
      <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>Select Target Role:</label>
      <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={selectStyle}>
        <option value="MERN Developer">MERN Developer</option>
        <option value="Frontend Developer (React)">Frontend Developer (React)</option>
        <option value="Backend Developer (Node.js)">Backend Developer (Node.js)</option>
      </select>

      <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>Select Experience Level:</label>
      <select value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} style={selectStyle}>
        <option value="Fresher">Fresher</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Senior">Senior</option>
      </select>

      <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>Target Company:</label>
      <input type="text" value={formData.companyType} onChange={(e) => setFormData({...formData, companyType: e.target.value})} style={selectStyle} />

      <button onClick={startInterview} disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
        {loading ? "Initializing AI Interviewer..." : "🚀 Start Interview"}
      </button>
    </div>
  );
}

export default Home;