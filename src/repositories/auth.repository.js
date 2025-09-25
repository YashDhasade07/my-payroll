import User from '../models/User.js';
import ApplicationError from '../middleware/applicationError.js';

export default class AuthRepository {
    
    async create(userData) {
        try {
            const user = new User(userData);
            return await user.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new ApplicationError('User with this email already exists', 400);
            }
            throw new ApplicationError('Error creating user', 500);
        }
    }

    async findByEmail(email) {
        try {
            return await User.findOne({ email }).select('-password');
        } catch (error) {
            throw new ApplicationError('Error finding user', 500);
        }
    }

    async findByEmailWithPassword(email) {
        try {
            return await User.findByEmailWithPassword(email);
        } catch (error) {
            throw new ApplicationError('Error finding user', 500);
        }
    }

    async findById(userId) {
        try {
            return await User.findById(userId).select('-password');
        } catch (error) {
            throw new ApplicationError('Error finding user', 500);
        }
    }

    async updatePassword(userId, hashedPassword) {
        try {
            return await User.findByIdAndUpdate(
                userId, 
                { password: hashedPassword }, 
                { new: true }
            ).select('-password');
        } catch (error) {
            throw new ApplicationError('Error updating password', 500);
        }
    }
}
