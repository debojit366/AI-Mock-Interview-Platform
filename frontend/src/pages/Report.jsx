// src/pages/Report.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Report() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setReport({
        score: 8.5,
        feedback: "Your JavaScript fundamentals are solid, but you should dive deeper into system design and software architecture concepts.",
        strengths: ["React Lifecycle Hooks", "Fast API connection logic"],
        weaknesses: ["MongoDB transaction isolation knowledge"]
      });
      setLoading(false);
    }, 2000);
  }, [id]);

  if (loading) return <h3 style={{ textAlign: 'center' }}>🔄 AI is analyzing your performance and generating scorecard...</h3>;

  return (
    <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#10b981', textAlign: 'center' }}>🎉 Interview Completed!</h2>
      <hr />
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <span style={{ fontSize: '14px', color: '#64748b' }}>OVERALL SCORE</span>
        <h1 style={{ fontSize: '48px', margin: '5px 0', color: '#0f172a' }}>{report.score} <span style={{ fontSize: '20px', color: '#94a3b8' }}>/ 10</span></h1>
      </div>

      <h4>💡 Detailed Feedback:</h4>
      <p style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #2563eb', lineHeight: '1.6' }}>{report.feedback}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '6px' }}>
          <h5 style={{ color: '#16a34a', margin: '0 0 10px 0' }}>✅ Strengths:</h5>
          <ul>{report.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
        <div style={{ background: '#fef2f2', padding: '15px', borderRadius: '6px' }}>
          <h5 style={{ color: '#dc2626', margin: '0 0 10px 0' }}>❌ Areas to Improve:</h5>
          <ul>{report.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul>
        </div>
      </div>

      <button onClick={() => navigate('/')} style={{ width: '100%', marginTop: '30px', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
        Take Another Mock Interview
      </button>
    </div>
  );
}

export default Report;