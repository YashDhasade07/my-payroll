import express from 'express';
import authRouter from './auth.js';
import userRouter from './user.js';
import appointmentRouter from './appointment.js';
import bulkUploadRouter from './bulkUpload.js';

const router = express.Router();

// Manual route registration - Windows-friendly
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/appointments', appointmentRouter);
router.use('/bulk-upload', bulkUploadRouter);

export default router;
