import jwt from 'jsonwebtoken';
import TokenRepository from '../repositories/token.repository.js';
import ApplicationError from './applicationError.js';

const tokenRepository = new TokenRepository();

const jwtAuth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.replace('Bearer ', '');

        // Check if token exists in database
        const tokenDoc = await tokenRepository.findByToken(token);
        if (!tokenDoc) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Add user info to request
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        req.userRole = decoded.role;
        req.token = token;

        next();
    } catch (error) {
        console.log(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Something went wrong with authentication'
        });
    }
};

export default jwtAuth;
