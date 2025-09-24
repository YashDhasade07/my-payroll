import express from 'express';
import authRouter from './auth.js';
import userRouter from './user.js';
import appointmentRouter from './appointment.js';
import bulkUploadRouter from './bulkUpload.js';
import reportRouter from './report.js';

const router = express.Router();

// Manual route registration - Windows-friendly
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/appointments', appointmentRouter);
router.use('/bulk-upload', bulkUploadRouter);
router.use('/reports', reportRouter);

export default router;
