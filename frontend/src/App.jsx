// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import InterviewRoom from './pages/InterviewRoom';
import Report from './pages/Report';

function App() {
  return (
    <Router>
      <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '5px' }}>🎙️ AI Mock Interview Platform</h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginTop: 0, fontSize: '14px' }}>Enterprise Tier Architecture</p>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interview/:id" element={<InterviewRoom />} />
          <Route path="/report/:id" element={<Report />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;