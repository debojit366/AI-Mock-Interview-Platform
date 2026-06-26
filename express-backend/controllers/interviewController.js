// express-backend/controllers/interviewController.js
import Interview from '../models/Interview.js';
import axios from 'axios';

export const startInterviewSession = async (req, res) => {
  const { role, experience, companyType } = req.body;

  try {
    // 1. Python Server connectivity pipeline check
    const aiResponse = await axios.post(`${process.env.PYTHON_SERVICE_URL}/ai/generate-question`, {
      role,
      experience,
      company: companyType,
      history: "" // New entry, so empty string
    });

    const firstQuestion = aiResponse.data.question;

    // 2. Production schema document creation
    const newInterview = new Interview({
      role,
      experience,
      companyType,
      currentQuestion: firstQuestion,
      conversation: [{ question: firstQuestion }] // Direct tracking initiation
    });

    await newInterview.save();

    res.status(201).json({ 
      success: true,
      interviewId: newInterview._id, 
      question: firstQuestion 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: "Microservice Network Breakdown: " + error.message 
    });
  }
};


export const handleUserAnswer = async (req, res) => {
  const { interviewId, userAnswer } = req.body;

  try {
    
    const session = await Interview.findById(interviewId);
    if (!session) {
      return res.status(404).json({ success: false, error: "Session not found!" });
    }

    const currentRoundIndex = session.conversation.length - 1;
    session.conversation[currentRoundIndex].userAnswer = userAnswer;

    let fullHistoryText = "";
    session.conversation.forEach((round) => {
      fullHistoryText += `Interviewer: ${round.question}\nCandidate: ${round.userAnswer}\n\n`;
    });

    const aiResponse = await axios.post(`${process.env.PYTHON_SERVICE_URL}/ai/generate-question`, {
      role: session.role,
      experience: session.experience,
      company: session.companyType,
      history: fullHistoryText 
    });

    const nextQuestion = aiResponse.data.question;

    session.conversation.push({ question: nextQuestion });
    session.currentQuestion = nextQuestion;

    await session.save();

    res.status(200).json({
      success: true,
      nextQuestion: nextQuestion
    });

  } catch (error) {
    res.status(500).json({ success: false, error: "Pipeline breakdown on answer process: " + error.message });
  }
};




export const getInterviewReport = async (req, res) => {
  const { interviewId } = req.params;

  try {
    const session = await Interview.findById(interviewId);
    if (!session) {
      return res.status(404).json({ success: false, error: "Session not found!" });
    }

    if (session.status === 'completed' && session.finalEvaluation.summaryFeedback) {
      return res.status(200).json({ success: true, report: session.finalEvaluation });
    }

    let fullHistoryText = "";
    session.conversation.forEach((round) => {
      fullHistoryText += `Interviewer: ${round.question}\nCandidate: ${round.userAnswer}\n\n`;
    });

    const aiResponse = await axios.post(`${process.env.PYTHON_SERVICE_URL}/ai/generate-report`, {
      history: fullHistoryText
    });

    session.finalEvaluation = {
      overallScore: aiResponse.data.overallScore,
      summaryFeedback: aiResponse.data.summaryFeedback,
      strengths: aiResponse.data.strengths,
      weaknesses: aiResponse.data.weaknesses
    };
    session.status = 'completed';
    await session.save();

    res.status(200).json({
      success: true,
      report: session.finalEvaluation
    });

  } catch (error) {
    res.status(500).json({ success: false, error: "AI Evaluation Failed: " + error.message });
  }
};