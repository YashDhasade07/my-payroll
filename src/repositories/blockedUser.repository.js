import BlockedUser from '../models/BlockedUser.js';
import ApplicationError from '../middleware/applicationError.js';

export default class BlockedUserRepository {
    
    async isBlocked(blockerId, blockedId) {
        try {
            const blockRecord = await BlockedUser.findOne({
                blocker: blockerId,
                blocked: blockedId
            }).lean();
            
            return !!blockRecord;
        } catch (error) {
            throw new ApplicationError('Error checking blocked status', 500);
        }
    }

    async create(blockData) {
        try {
            const blockRecord = new BlockedUser(blockData);
            return await blockRecord.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new ApplicationError('User is already blocked', 400);
            }
            if (error.name === 'ValidationError') {
                throw new ApplicationError(error.message, 400);
            }
            throw new ApplicationError('Error blocking user', 500);
        }
    }

    async getBlockedUsers(blockerId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;

            const blockedRecords = await BlockedUser.find({ blocker: blockerId })
                .populate('blocked', 'firstName lastName email role department')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const totalBlocked = await BlockedUser.countDocuments({ blocker: blockerId });
            const totalPages = Math.ceil(totalBlocked / limit);

            const blockedUsers = blockedRecords.map(record => ({
                blockId: record._id,
                user: {
                    _id: record.blocked._id,
                    name: `${record.blocked.firstName} ${record.blocked.lastName}`,
                    email: record.blocked.email,
                    role: record.blocked.role,
                    department: record.blocked.department
                },
                reason: record.reason,
                blockedAt: record.createdAt
            }));

            return {
                blockedUsers,
                totalBlocked,
                totalPages,
                currentPage: page
            };
        } catch (error) {
            throw new ApplicationError('Error retrieving blocked users', 500);
        }
    }

    async getUsersWhoBlockedUser(blockedUserId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;

            const blockRecords = await BlockedUser.find({ blocked: blockedUserId })
                .populate('blocker', 'firstName lastName email role department')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const totalBlockers = await BlockedUser.countDocuments({ blocked: blockedUserId });
            const totalPages = Math.ceil(totalBlockers / limit);

            const blockers = blockRecords.map(record => ({
                blockId: record._id,
                user: {
                    _id: record.blocker._id,
                    name: `${record.blocker.firstName} ${record.blocker.lastName}`,
                    email: record.blocker.email,
                    role: record.blocker.role,
                    department: record.blocker.department
                },
                reason: record.reason,
                blockedAt: record.createdAt
            }));

            return {
                blockers,
                totalBlockers,
                totalPages,
                currentPage: page
            };
        } catch (error) {
            throw new ApplicationError('Error retrieving users who blocked user', 500);
        }
    }

    async findBlockRecord(blockerId, blockedId) {
        try {
            return await BlockedUser.findOne({
                blocker: blockerId,
                blocked: blockedId
            }).lean();
        } catch (error) {
            throw new ApplicationError('Error finding block record', 500);
        }
    }

    async unblock(blockerId, blockedId) {
        try {
            const result = await BlockedUser.findOneAndDelete({
                blocker: blockerId,
                blocked: blockedId
            });

            if (!result) {
                throw new ApplicationError('Block record not found', 404);
            }

            return result;
        } catch (error) {
            if (error instanceof ApplicationError) {
                throw error;
            }
            throw new ApplicationError('Error unblocking user', 500);
        }
    }

    async getBlockingStats(userId) {
        try {
            const blockedCount = await BlockedUser.countDocuments({ blocker: userId });
            const blockedByCount = await BlockedUser.countDocuments({ blocked: userId });

            return {
                usersBlocked: blockedCount,
                blockedByUsers: blockedByCount
            };
        } catch (error) {
            throw new ApplicationError('Error getting blocking statistics', 500);
        }
    }

    async clearAllBlocksForUser(userId) {
        try {
            await BlockedUser.deleteMany({
                $or: [
                    { blocker: userId },
                    { blocked: userId }
                ]
            });
        } catch (error) {
            throw new ApplicationError('Error clearing blocks for user', 500);
        }
    }
}
