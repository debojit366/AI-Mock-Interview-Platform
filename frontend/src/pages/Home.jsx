import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [role, setRole] = useState('MERN Developer');
  const [experience, setExperience] = useState('Fresher');
  const [companyType, setCompanyType] = useState('Google');
  const [resumeFile, setResumeFile] = useState(null); // <--- File state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const startInterview = async () => {
    setLoading(true);
    
    // 🚨 MULTIPART FORMDATA ENGINE
    const formData = new FormData();
    formData.append('role', role);
    formData.append('experience', experience);
    formData.append('companyType', companyType);
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    try {
      const res = await axios.post('http://localhost:5000/api/interview/setup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success) {
        navigate(`/interview/${res.data.interviewId}`, { state: { firstQuestion: res.data.question } });
      }
    } catch (err) {
      alert("Error parsing file or connecting server: " + err.message);
    }
    setLoading(false);
  };

  const selectStyle = { width: '100%', padding: '10px', marginBottom: '18px', borderRadius: '6px', border: '1px solid #cbd5e1' };

  return (
    <div style={{ background: '#ffffff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', maxWidth: '500px', margin: '40px auto' }}>
      <h3 style={{ marginTop: 0, color: '#0f172a', textAlign: 'center' }}>📄 PDF Resume Mock Session</h3>
      
      <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>Select Target Role:</label>
      <select value={role} onChange={(e) => setRole(e.target.value)} style={selectStyle}>
        <option value="MERN Developer">MERN Developer</option>
        <option value="Frontend Developer (React)">Frontend Developer (React)</option>
        <option value="Electrical Engineer Profile">Electrical Engineer Profile</option>
      </select>

      <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>Experience Level:</label>
      <select value={experience} onChange={(e) => setExperience(e.target.value)} style={selectStyle}>
        <option value="Fresher">Fresher</option>
        <option value="Intermediate">Intermediate</option>
      </select>

      <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>Target Company Type:</label>
      <select value={companyType} onChange={(e) => setCompanyType(e.target.value)} style={selectStyle}>
        <option value="FAANG">FAANG (Google/Amazon)</option>
        <option value="Startup">Startup</option>
      </select>

      {/* 🚨 FILE UPLOAD FIELD */}
      <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>
        Upload Resume PDF <span style={{ color: '#64748b', fontWeight: 'normal', fontSize: '13px' }}>(Optional)</span>
      </label>
      <input 
        type="file" 
        accept=".pdf" 
        onChange={(e) => setResumeFile(e.target.files[0])} 
        style={{ ...selectStyle, padding: '8px', background: '#f8fafc' }}
      />

      <button onClick={startInterview} disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginTop: '10px' }}>
        {loading ? "Reading PDF & Initializing AI..." : "🚀 Upload & Start Interview"}
      </button>
    </div>
  );
}

export default Home;