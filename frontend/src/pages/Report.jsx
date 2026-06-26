// src/pages/Report.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Report() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/interview/report/${id}`);
        if (res.data.success) {
          setReport(res.data.report);
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      }
      setLoading(false);
    };

    fetchReport();
  }, [id]);

  if (loading) return <h3 style={{ textAlign: 'center', marginTop: '50px' }}>🔄 AI is analyzing your performance history and generating scorecard...</h3>;
  if (error) return <h3 style={{ textAlign: 'center', color: '#ef4444' }}>❌ Error: {error}</h3>;

  return (
    <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#10b981', textAlign: 'center' }}>🎉 Interview Evaluation Report</h2>
      <hr style={{ border: '0', borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />
      
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', letterSpacing: '1px' }}>OVERALL PERFORMANCE SCORE</span>
        <h1 style={{ fontSize: '56px', margin: '5px 0', color: '#0f172a' }}>
          {report.overallScore} <span style={{ fontSize: '24px', color: '#94a3b8' }}>/ 10</span>
        </h1>
      </div>

      <h4>💡 Gemini Interview Feedback Summary:</h4>
      <p style={{ background: '#f8fafc', padding: '16px', borderRadius: '6px', borderLeft: '4px solid #2563eb', lineHeight: '1.6', color: '#334155' }}>
        {report.summaryFeedback}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '25px' }}>
        <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
          <h5 style={{ color: '#16a34a', margin: '0 0 10px 0', fontSize: '15px' }}>✅ Key Strengths:</h5>
          <ul style={{ paddingLeft: '20px', margin: 0, color: '#14532d' }}>
            {report.strengths?.map((s, i) => <li key={i} style={{ marginBottom: '6px' }}>{s}</li>)}
          </ul>
        </div>
        
        <div style={{ background: '#fef2f2', padding: '15px', borderRadius: '6px', border: '1px solid #fecaca' }}>
          <h5 style={{ color: '#dc2626', margin: '0 0 10px 0', fontSize: '15px' }}>❌ Critical Areas to Improve:</h5>
          <ul style={{ paddingLeft: '20px', margin: 0, color: '#7f1d1d' }}>
            {report.weaknesses?.map((w, i) => <li key={i} style={{ marginBottom: '6px' }}>{w}</li>)}
          </ul>
        </div>
      </div>

      <button onClick={() => navigate('/')} style={{ width: '100%', marginTop: '30px', padding: '14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
        Take Another Mock Interview
      </button>
    </div>
  );
}

export default Report;