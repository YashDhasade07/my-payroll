import Token from '../models/Token.js';
import ApplicationError from '../middleware/applicationError.js';

export default class TokenRepository {
    
    async add(token, userId) {
        try {
            const tokenDoc = new Token({
                token,
                userId,
                expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000) 
            });
            return await tokenDoc.save();
        } catch (error) {
            throw new ApplicationError('Error saving token', 500);
        }
    }

    async findByToken(token) {
        try {
            return await Token.findOne({ 
                token, 
                expiresAt: { $gt: new Date() } 
            }).populate('userId');
        } catch (error) {
            throw new ApplicationError('Error finding token', 500);
        }
    }

    async delete(token) {
        try {
            return await Token.findOneAndDelete({ token });
        } catch (error) {
            throw new ApplicationError('Error deleting token', 500);
        }
    }

    async deleteAllForUser(userId) {
        try {
            return await Token.deleteMany({ userId });
        } catch (error) {
            throw new ApplicationError('Error deleting user tokens', 500);
        }
    }

    async deleteExpiredTokens() {
        try {
            return await Token.deleteMany({ expiresAt: { $lt: new Date() } });
        } catch (error) {
            throw new ApplicationError('Error deleting expired tokens', 500);
        }
    }
}
