import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import AuthRepository from '../repositories/auth.repository.js';
import TokenRepository from '../repositories/token.repository.js';
import PasswordResetRepository from '../repositories/passwordReset.repository.js';
import ApplicationError from '../middleware/applicationError.js';

export default class AuthController {
    constructor() {
        this.authRepository = new AuthRepository();
        this.tokenRepository = new TokenRepository();
        this.passwordResetRepository = new PasswordResetRepository();
    }

    async register(req, res, next) {
        try {
            const { firstName, lastName, email, password, role, phone, department } = req.body;

            const existingUser = await this.authRepository.findByEmail(email);
            if (existingUser) {
                throw new ApplicationError('User with this email already exists', 400);
            }

            // const hashedPassword = await bcrypt.hash(password, 12);

            const user = await this.authRepository.create({
                firstName,
                lastName,
                email,
                password,
                role,
                phone,
                department
            });

            const { password: _, ...userResponse } = user.toObject();

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: userResponse
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong during registration', 500));
        }
    }


    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new ApplicationError('Email and password are required', 400);
            }

            const user = await this.authRepository.findByEmailWithPassword(email);
            if (!user) {
                throw new ApplicationError('Invalid credentials', 401);
            }
            
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                throw new ApplicationError('Invalid credentials', 401);
            }
           
            const token = jwt.sign(
                { 
                    userId: user._id, 
                    email: user.email, 
                    role: user.role 
                }, 
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '12h' }
            );

            
            await this.tokenRepository.add(token, user._id);

            const { password: _, ...userResponse } = user.toObject();

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: userResponse,
                    token
                }
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong during login', 500));
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;

            if (!email) {
                throw new ApplicationError('Email is required', 400);
            }

            const user = await this.authRepository.findByEmail(email);
            if (!user) {
                // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
                // Don't reveal if user exists or not for security
                return res.status(200).json({
                    success: true,
                    message: 'If account exists, password reset link has been sent to email'
                });
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
            
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

            await this.passwordResetRepository.deleteByUserId(user._id);


            await this.passwordResetRepository.create({
                userId: user._id,
                token: resetTokenHash,
                expiresAt
            });

            res.status(200).json({
                success: true,
                message: 'Password reset link sent to email',
                // For development only
                resetToken: resetToken
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong during password reset request', 500));
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { token, newPassword } = req.body;

            if (!token || !newPassword) {
                throw new ApplicationError('Token and new password are required', 400);
            }

            if (newPassword.length < 8) {
                throw new ApplicationError('Password must be at least 8 characters long', 400);
            }

            const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

            const resetRecord = await this.passwordResetRepository.findValidToken(resetTokenHash);
            if (!resetRecord) {
                throw new ApplicationError('Invalid or expired reset token', 400);
            }

            const hashedPassword = await bcrypt.hash(newPassword, 12);

            await this.authRepository.updatePassword(resetRecord.userId, hashedPassword);

            await this.passwordResetRepository.deleteByUserId(resetRecord.userId);

            await this.tokenRepository.deleteAllForUser(resetRecord.userId);

            res.status(200).json({
                success: true,
                message: 'Password reset successful. Please login with new password.'
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong during password reset', 500));
        }
    }

    async logout(req, res, next) {
        try {
            const token = req.headers['authorization']
            
            if (!token) {
                throw new ApplicationError('Token is required', 400);
            }

            await this.tokenRepository.delete(token);

            res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong during logout', 500));
        }
    }
}
