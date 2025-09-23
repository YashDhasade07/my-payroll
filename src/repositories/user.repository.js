import User from '../models/User.js';
import ApplicationError from '../middleware/applicationError.js';

export default class UserRepository {
    
    async getAllWithPagination(page, limit, filters = {}) {
        try {
            const skip = (page - 1) * limit;
            
            const users = await User.find(filters)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const totalUsers = await User.countDocuments(filters);
            const totalPages = Math.ceil(totalUsers / limit);

            return {
                users,
                totalUsers,
                totalPages,
                currentPage: page
            };
        } catch (error) {
            throw new ApplicationError('Error retrieving users', 500);
        }
    }

    async findById(userId) {
        try {
            return await User.findById(userId).select('-password').lean();
        } catch (error) {
            throw new ApplicationError('Error finding user', 500);
        }
    }

    async updateById(userId, updateData) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: updateData },
                { new: true, runValidators: true }
            ).select('-password').lean();

            if (!updatedUser) {
                throw new ApplicationError('User not found', 404);
            }

            return updatedUser;
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new ApplicationError(error.message, 400);
            }
            if (error instanceof ApplicationError) {
                throw error;
            }
            throw new ApplicationError('Error updating user', 500);
        }
    }

    async deleteById(userId) {
        try {
            const deletedUser = await User.findByIdAndDelete(userId);
            if (!deletedUser) {
                throw new ApplicationError('User not found', 404);
            }
            return deletedUser;
        } catch (error) {
            if (error instanceof ApplicationError) {
                throw error;
            }
            throw new ApplicationError('Error deleting user', 500);
        }
    }

    async findByEmail(email) {
        try {
            return await User.findOne({ email }).select('-password').lean();
        } catch (error) {
            throw new ApplicationError('Error finding user by email', 500);
        }
    }

    async findByRole(role, page = 1, limit = 10, search = '') {
        try {
            const filters = { role };
            if (search) {
                filters.$or = [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }

            return await this.getAllWithPagination(page, limit, filters);
        } catch (error) {
            throw new ApplicationError('Error finding users by role', 500);
        }
    }

    async getUserStats() {
        try {
            const stats = await User.aggregate([
                {
                    $group: {
                        _id: '$role',
                        count: { $sum: 1 }
                    }
                }
            ]);

            const totalUsers = await User.countDocuments();
            
            return {
                totalUsers,
                stats
            };
        } catch (error) {
            throw new ApplicationError('Error getting user statistics', 500);
        }
    }
}
