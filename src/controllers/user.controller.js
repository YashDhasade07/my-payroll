import UserRepository from '../repositories/user.repository.js';
import TokenRepository from '../repositories/token.repository.js';
import ApplicationError from '../middleware/applicationError.js';

export default class UserController {
    constructor() {
        this.userRepository = new UserRepository();
        this.tokenRepository = new TokenRepository();
    }

    // Get all users with pagination
    async getAllUsers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const role = req.query.role || '';
            const department = req.query.department || '';

            const filters = {};
            if (search) {
                filters.$or = [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }
            if (role) filters.role = role;
            if (department) filters.department = { $regex: department, $options: 'i' };

            const result = await this.userRepository.getAllWithPagination(page, limit, filters);

            res.status(200).json({
                success: true,
                message: 'Users retrieved successfully',
                data: result.users,
                pagination: {
                    currentPage: page,
                    totalPages: result.totalPages,
                    totalUsers: result.totalUsers,
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
            next(new ApplicationError('Something went wrong while retrieving users', 500));
        }
    }

    // Get user by ID
    async getUserById(req, res, next) {
        try {
            const userId = req.params.id;

            if (!userId) {
                throw new ApplicationError('User ID is required', 400);
            }

            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new ApplicationError('User not found', 404);
            }

            res.status(200).json({
                success: true,
                message: 'User retrieved successfully',
                data: user
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while retrieving user', 500));
        }
    }

    // Update user by ID
    async updateUserById(req, res, next) {
        try {
            const userId = req.params.id;
            const currentUserId = req.userId;
            const currentUserRole = req.userRole;

            if (!userId) {
                throw new ApplicationError('User ID is required', 400);
            }

            // Check permissions: users can only update their own profile, managers can update anyone
            if (currentUserRole !== 'Manager' && userId !== currentUserId) {
                throw new ApplicationError('You can only update your own profile', 403);
            }

            const { firstName, lastName, phone, department } = req.body;

            // Don't allow role changes through this endpoint for security
            const updateData = {
                firstName,
                lastName,
                phone,
                department
            };

            // Remove undefined values
            Object.keys(updateData).forEach(key => 
                updateData[key] === undefined && delete updateData[key]
            );

            if (Object.keys(updateData).length === 0) {
                throw new ApplicationError('No valid fields to update', 400);
            }

            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new ApplicationError('User not found', 404);
            }

            const updatedUser = await this.userRepository.updateById(userId, updateData);

            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: updatedUser
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while updating user', 500));
        }
    }

    // Delete user by ID (Manager only)
    async deleteUserById(req, res, next) {
        try {
            const userId = req.params.id;
            const currentUserRole = req.userRole;
            const currentUserId = req.userId;

            if (!userId) {
                throw new ApplicationError('User ID is required', 400);
            }

            // Only managers can delete users
            if (currentUserRole !== 'Manager') {
                throw new ApplicationError('Only managers can delete users', 403);
            }

            // Prevent managers from deleting themselves
            if (userId === currentUserId) {
                throw new ApplicationError('You cannot delete your own account', 400);
            }

            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new ApplicationError('User not found', 404);
            }

            // Delete user and all their tokens
            await this.userRepository.deleteById(userId);
            await this.tokenRepository.deleteAllForUser(userId);

            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while deleting user', 500));
        }
    }

    // Get current user profile
    async getCurrentUserProfile(req, res, next) {
        try {
            const userId = req.userId;

            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new ApplicationError('User not found', 404);
            }

            res.status(200).json({
                success: true,
                message: 'Profile retrieved successfully',
                data: user
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while retrieving profile', 500));
        }
    }

    // Update current user profile
    async updateCurrentUserProfile(req, res, next) {
        try {
            const userId = req.userId;
            const { firstName, lastName, phone, department } = req.body;

            // Don't allow email or role changes through this endpoint
            const updateData = {
                firstName,
                lastName,
                phone,
                department
            };

            // Remove undefined values
            Object.keys(updateData).forEach(key => 
                updateData[key] === undefined && delete updateData[key]
            );

            if (Object.keys(updateData).length === 0) {
                throw new ApplicationError('No valid fields to update', 400);
            }

            const updatedUser = await this.userRepository.updateById(userId, updateData);

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedUser
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while updating profile', 500));
        }
    }

    // Get all managers
    async getAllManagers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';

            const filters = { role: 'Manager' };
            if (search) {
                filters.$or = [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }

            const result = await this.userRepository.getAllWithPagination(page, limit, filters);

            res.status(200).json({
                success: true,
                message: 'Managers retrieved successfully',
                data: result.users,
                pagination: {
                    currentPage: page,
                    totalPages: result.totalPages,
                    totalUsers: result.totalUsers,
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
            next(new ApplicationError('Something went wrong while retrieving managers', 500));
        }
    }

    // Get all developers
    async getAllDevelopers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';

            const filters = { role: 'Developer' };
            if (search) {
                filters.$or = [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }

            const result = await this.userRepository.getAllWithPagination(page, limit, filters);

            res.status(200).json({
                success: true,
                message: 'Developers retrieved successfully',
                data: result.users,
                pagination: {
                    currentPage: page,
                    totalPages: result.totalPages,
                    totalUsers: result.totalUsers,
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
            next(new ApplicationError('Something went wrong while retrieving developers', 500));
        }
    }
}
