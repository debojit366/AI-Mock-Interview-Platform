// express-backend/routes/interviewRoutes.js
import express from 'express';
import { startInterviewSession,handleUserAnswer } from '../controllers/interviewController.js';

const router = express.Router();

// Production route syntax
router.post('/setup', startInterviewSession);
router.post('/answer', handleUserAnswer);
export default router;