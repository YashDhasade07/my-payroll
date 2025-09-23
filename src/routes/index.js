import express from 'express';
import authRouter from './auth.js';
import userRouter from './user.js';

const router = express.Router();

// Manual route registration - Windows-friendly
router.use('/auth', authRouter);
router.use('/users', userRouter);

export default router;
