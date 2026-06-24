// express-backend/server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Stack Connected!"))
  .catch(err => console.error(err));

// Schema
const InterviewSchema = new mongoose.Schema({
  role: String,
  experience: String,
  companyType: String,
  history: { type: String, default: "" },
  currentQuestion: String,
  createdAt: { type: Date, default: Date.now }
});
const Interview = mongoose.model('Interview', InterviewSchema);

// API Endpoint: Setup Interview
app.post('/api/interview/setup', async (req, res) => {
  const { role, experience, companyType } = req.body;
  try {
    // 1. Python Microservice ko call karo pehla sawal nikalne ke liye
    const aiResponse = await axios.post(`${process.env.PYTHON_SERVICE_URL}/ai/generate-question`, {
      role,
      experience,
      company: companyType,
      history: "" // Pehla sawal hai toh history empty hogi
    });

    const firstQuestion = aiResponse.data.question;

    // 2. MongoDB me temporary session state create karo
    const newInterview = new Interview({
      role, experience, companyType,
      currentQuestion: firstQuestion
    });
    await newInterview.save();

    res.json({ interviewId: newInterview._id, question: firstQuestion });
  } catch (error) {
    res.status(500).json({ error: "Express-Python pipeline failed: " + error.message });
  }
});

app.listen(process.env.PORT, () => console.log(`Express Hub active on Port ${process.env.PORT}`));