import jwt from 'jsonwebtoken';
import TokenRepository from '../repositories/token.repository.js';
import redisService from '../services/redis.service.js';
import ApplicationError from './applicationError.js';

const tokenRepository = new TokenRepository();

const jwtAuth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // const token = authHeader.replace('Bearer ', '');
        let tokenData = await redisService.getToken(token);
        // Check if token exists in database
        // const tokenDoc = await tokenRepository.findByToken(token);
        if (tokenData) {
            // Verify JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            
            // Add user info to request
            req.userId = decoded.userId;
            req.userEmail = decoded.email;
            req.userRole = decoded.role;
            req.token = token;
    
           return next();
        }

        const tokenDoc = await tokenRepository.findByToken(token);
        if (!tokenDoc) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }


        //Cache in Redis for future requests
        let cacheResult = await redisService.storeToken(
            token, 
            tokenDoc.userId.toString(), 
            3600 // 1 hour
        );

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
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
