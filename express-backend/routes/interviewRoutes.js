// express-backend/routes/interviewRoutes.js
import express from 'express';
import { startInterviewSession } from '../controllers/interviewController.js';

const router = express.Router();

// Production route syntax
router.post('/setup', startInterviewSession);

export default router;