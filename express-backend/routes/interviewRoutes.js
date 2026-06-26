// express-backend/routes/interviewRoutes.js
import express from 'express';
import { startInterviewSession,handleUserAnswer,getInterviewReport } from '../controllers/interviewController.js';

const router = express.Router();

// Production route syntax
router.post('/setup', startInterviewSession);
router.post('/answer', handleUserAnswer);
router.get('/report/:interviewId', getInterviewReport);
export default router;