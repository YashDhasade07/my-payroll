import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import jwtAuth from '../middleware/jwt.middleware.js';

const authRouter = express.Router();
let authController = new AuthController();

// Authentication routes
authRouter.post('/register', (req, res, next) => {
    authController.register(req, res, next);
});

authRouter.post('/login', (req, res, next) => {
    authController.login(req, res, next);
});

authRouter.post('/forgot-password', (req, res, next) => {
    authController.forgotPassword(req, res, next);
});

authRouter.post('/reset-password', (req, res, next) => {
    authController.resetPassword(req, res, next);
});

authRouter.post('/logout', jwtAuth, (req, res, next) => {
    authController.logout(req, res, next);
});

export default authRouter;
