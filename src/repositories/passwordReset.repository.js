import PasswordReset from '../models/PasswordReset.js';
import ApplicationError from '../middleware/applicationError.js';

export default class PasswordResetRepository {
    
    async create(resetData) {
        try {
            const resetToken = new PasswordReset(resetData);
            return await resetToken.save();
        } catch (error) {
            throw new ApplicationError('Error creating reset token', 500);
        }
    }

    async findValidToken(token) {
        try {
            return await PasswordReset.findOne({
                token,
                expiresAt: { $gt: new Date() }
            });
        } catch (error) {
            throw new ApplicationError('Error finding reset token', 500);
        }
    }

    async deleteByUserId(userId) {
        try {
            return await PasswordReset.deleteMany({ userId });
        } catch (error) {
            throw new ApplicationError('Error deleting reset tokens', 500);
        }
    }

    async deleteExpiredTokens() {
        try {
            return await PasswordReset.deleteMany({ expiresAt: { $lt: new Date() } });
        } catch (error) {
            throw new ApplicationError('Error deleting expired tokens', 500);
        }
    }
}
