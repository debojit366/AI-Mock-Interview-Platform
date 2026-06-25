import mongoose from 'mongoose';

const QAHistorySchema = new mongoose.Schema({
  question: { type: String, required: true },
  userAnswer: { type: String, default: "" },         // Speech-to-text input
  feedback: { type: String, default: "" },           // Real-time micro-feedback (if any)
  score: { type: Number, min: 0, max: 10, default: 0 }, // Rating for this answer
  timestamp: { type: Date, default: Date.now }
});

const InterviewSchema = new mongoose.Schema({
  role: { 
    type: String, 
    required: [true, 'Target role is required'],
    trim: true 
  },
  experience: { 
    type: String, 
    required: true,
    enum: ['Fresher', 'Intermediate', 'Senior'] // Strict data validation
  },
  companyType: { 
    type: String, 
    required: true,
    trim: true 
  },
  // Complete list of questions asked and answers given in this session
  conversation: [QAHistorySchema], 
  
  currentQuestion: { type: String }, 
  status: { 
    type: String, 
    enum: ['ongoing', 'completed', 'failed'], 
    default: 'ongoing' 
  },
  
  finalEvaluation: {
    overallScore: { type: Number, min: 0, max: 10, default: 0 },
    summaryFeedback: { type: String, default: "" },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }]
  }
}, {
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

const Interview = mongoose.model('Interview', InterviewSchema);
export default Interview;