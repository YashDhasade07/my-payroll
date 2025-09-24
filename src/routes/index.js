import express from 'express';
import authRouter from './auth.js';
import userRouter from './user.js';
import appointmentRouter from './appointment.js';

const router = express.Router();

// Manual route registration - Windows-friendly
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/appointments', appointmentRouter);

export default router;
