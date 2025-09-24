import BlockedUserRepository from '../repositories/blockedUser.repository.js';
import UserRepository from '../repositories/user.repository.js';
import ApplicationError from '../middleware/applicationError.js';

export default class BlockingController {
    constructor() {
        this.blockedUserRepository = new BlockedUserRepository();
        this.userRepository = new UserRepository();
    }

    // Get current user's blocked list
    async getMyBlockedUsers(req, res, next) {
        try {
            const userId = req.userId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const result = await this.blockedUserRepository.getBlockedUsers(userId, page, limit);

            res.status(200).json({
                success: true,
                message: 'Blocked users retrieved successfully',
                data: result.blockedUsers,
                pagination: {
                    currentPage: page,
                    totalPages: result.totalPages,
                    totalBlocked: result.totalBlocked,
                    limit: limit,
                    hasNext: page < result.totalPages,
                    hasPrev: page > 1
                }
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while retrieving blocked users', 500));
        }
    }

    // Block a user
    async blockUser(req, res, next) {
        try {
            const blockerId = req.userId;
            const { userId, reason } = req.body;

            if (!userId) {
                throw new ApplicationError('User ID is required', 400);
            }

            // Check if trying to block themselves
            if (blockerId === userId) {
                throw new ApplicationError('You cannot block yourself', 400);
            }

            // Check if target user exists
            const targetUser = await this.userRepository.findById(userId);
            if (!targetUser) {
                throw new ApplicationError('User not found', 404);
            }

            // Check if user is already blocked
            const existingBlock = await this.blockedUserRepository.isBlocked(blockerId, userId);
            if (existingBlock) {
                throw new ApplicationError(`${targetUser.firstName} ${targetUser.lastName} is already blocked`, 400);
            }

            // Create block record
            const blockData = {
                blocker: blockerId,
                blocked: userId,
                reason: reason || null
            };

            const blockRecord = await this.blockedUserRepository.create(blockData);

            res.status(201).json({
                success: true,
                message: `${targetUser.firstName} ${targetUser.lastName} has been blocked successfully`,
                data: {
                    blockId: blockRecord._id,
                    blockedUser: {
                        _id: targetUser._id,
                        name: `${targetUser.firstName} ${targetUser.lastName}`,
                        email: targetUser.email,
                        role: targetUser.role
                    },
                    reason: blockRecord.reason,
                    blockedAt: blockRecord.createdAt
                }
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while blocking user', 500));
        }
    }

    // Unblock a user
    async unblockUser(req, res, next) {
        try {
            const blockerId = req.userId;
            const blockedUserId = req.params.userId;

            if (!blockedUserId) {
                throw new ApplicationError('User ID is required', 400);
            }

            // Check if target user exists
            const targetUser = await this.userRepository.findById(blockedUserId);
            if (!targetUser) {
                throw new ApplicationError('User not found', 404);
            }

            // Check if user is actually blocked
            const blockRecord = await this.blockedUserRepository.findBlockRecord(blockerId, blockedUserId);
            if (!blockRecord) {
                throw new ApplicationError(`${targetUser.firstName} ${targetUser.lastName} is not blocked`, 400);
            }

            // Remove block record
            await this.blockedUserRepository.unblock(blockerId, blockedUserId);

            res.status(200).json({
                success: true,
                message: `${targetUser.firstName} ${targetUser.lastName} has been unblocked successfully`,
                data: {
                    unblockedUser: {
                        _id: targetUser._id,
                        name: `${targetUser.firstName} ${targetUser.lastName}`,
                        email: targetUser.email,
                        role: targetUser.role
                    },
                    unblockedAt: new Date()
                }
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while unblocking user', 500));
        }
    }

    // Check if specific user is blocked
    async checkIfUserBlocked(req, res, next) {
        try {
            const currentUserId = req.userId;
            const targetUserId = req.params.userId;

            if (!targetUserId) {
                throw new ApplicationError('User ID is required', 400);
            }

            // Check if target user exists
            const targetUser = await this.userRepository.findById(targetUserId);
            if (!targetUser) {
                throw new ApplicationError('User not found', 404);
            }

            // Check blocking status in both directions
            const currentUserBlockedTarget = await this.blockedUserRepository.isBlocked(currentUserId, targetUserId);
            const targetBlockedCurrentUser = await this.blockedUserRepository.isBlocked(targetUserId, currentUserId);

            const blockStatus = {
                user: {
                    _id: targetUser._id,
                    name: `${targetUser.firstName} ${targetUser.lastName}`,
                    email: targetUser.email,
                    role: targetUser.role
                },
                blocked: {
                    byYou: currentUserBlockedTarget,
                    byThem: targetBlockedCurrentUser,
                    canScheduleAppointment: !currentUserBlockedTarget && !targetBlockedCurrentUser
                }
            };

            res.status(200).json({
                success: true,
                message: 'Block status retrieved successfully',
                data: blockStatus
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while checking block status', 500));
        }
    }

    // Get users who blocked current user
    async getUsersWhoBlockedMe(req, res, next) {
        try {
            const userId = req.userId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const result = await this.blockedUserRepository.getUsersWhoBlockedUser(userId, page, limit);

            res.status(200).json({
                success: true,
                message: 'Users who blocked you retrieved successfully',
                data: result.blockers,
                pagination: {
                    currentPage: page,
                    totalPages: result.totalPages,
                    totalBlockers: result.totalBlockers,
                    limit: limit,
                    hasNext: page < result.totalPages,
                    hasPrev: page > 1
                }
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while retrieving users who blocked you', 500));
        }
    }
}
