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