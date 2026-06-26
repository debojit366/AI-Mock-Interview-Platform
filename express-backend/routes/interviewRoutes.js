// express-backend/routes/interviewRoutes.js
import express from 'express';
import multer from 'multer';
import { startInterviewSession,handleUserAnswer,getInterviewReport } from '../controllers/interviewController.js';

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // Max 5MB file

router.post('/setup',upload.single('resume'), startInterviewSession);
router.post('/answer', handleUserAnswer);
router.get('/report/:interviewId', getInterviewReport);
export default router;