import AppointmentRepository from '../repositories/appointment.repository.js';
import UserRepository from '../repositories/user.repository.js';
import BlockedUserRepository from '../repositories/blockedUser.repository.js';
import ApplicationError from '../middleware/applicationError.js';

export default class AppointmentController {
    constructor() {
        this.appointmentRepository = new AppointmentRepository();
        this.userRepository = new UserRepository();
        this.blockedUserRepository = new BlockedUserRepository();
    }

    // Get all appointments with filters
    async getAllAppointments(req, res, next) {
        try {
            const userId = req.userId;
            const userRole = req.userRole;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            
            // Filter parameters
            const filters = {};
            
            // Date filtering
            if (req.query.startDate) {
                filters.scheduledDate = { $gte: new Date(req.query.startDate) };
            }
            if (req.query.endDate) {
                if (filters.scheduledDate) {
                    filters.scheduledDate.$lte = new Date(req.query.endDate);
                } else {
                    filters.scheduledDate = { $lte: new Date(req.query.endDate) };
                }
            }
            
            // Status filtering
            if (req.query.status) {
                filters.status = req.query.status;
            }
            
            // Role-based filtering
            if (userRole === 'Manager') {
                // Managers see appointments they created
                if (req.query.type === 'created') {
                    filters.manager = userId;
                } else if (req.query.type === 'assigned') {
                    filters['attendees.user'] = userId;
                } else {
                    // Default: show both created and assigned
                    filters.$or = [
                        { manager: userId },
                        { 'attendees.user': userId }
                    ];
                }
            } else {
                // Developers see only appointments they're assigned to
                filters['attendees.user'] = userId;
            }

            const result = await this.appointmentRepository.getAllWithPagination(page, limit, filters);

            res.status(200).json({
                success: true,
                message: 'Appointments retrieved successfully',
                data: result.appointments,
                pagination: {
                    currentPage: page,
                    totalPages: result.totalPages,
                    totalAppointments: result.totalAppointments,
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
            next(new ApplicationError('Something went wrong while retrieving appointments', 500));
        }
    }

    // Create new appointment (managers only)
    async createAppointment(req, res, next) {
        try {
            const managerId = req.userId;
            const userRole = req.userRole;

            // Check if user is a manager
            if (userRole !== 'Manager') {
                throw new ApplicationError('Only managers can create appointments', 403);
            }

            const { title, description, attendeeIds, scheduledDate, duration } = req.body;

            // Validation
            if (!title || !attendeeIds || !scheduledDate || !duration) {
                throw new ApplicationError('Title, attendees, scheduled date, and duration are required', 400);
            }

            if (!Array.isArray(attendeeIds) || attendeeIds.length === 0) {
                throw new ApplicationError('At least one attendee is required', 400);
            }

            // Validate scheduled date is in future
            if (new Date(scheduledDate) <= new Date()) {
                throw new ApplicationError('Scheduled date must be in the future', 400);
            }

            // Check if all attendees exist and are developers
            const attendees = await this.userRepository.findByIds(attendeeIds);
            if (attendees.length !== attendeeIds.length) {
                throw new ApplicationError('One or more attendees not found', 404);
            }

            const nonDevelopers = attendees.filter(attendee => attendee.role !== 'Developer');
            if (nonDevelopers.length > 0) {
                throw new ApplicationError('All attendees must be developers', 400);
            }

            // Check for blocked users
            for (const attendeeId of attendeeIds) {
                const isBlocked = await this.blockedUserRepository.isBlocked(managerId, attendeeId) ||
                                await this.blockedUserRepository.isBlocked(attendeeId, managerId);
                
                if (isBlocked) {
                    const attendee = attendees.find(a => a._id.toString() === attendeeId);
                    throw new ApplicationError(`Cannot schedule appointment with ${attendee.firstName} ${attendee.lastName} due to blocking restrictions`, 400);
                }
            }

            // Create appointment data
            const appointmentData = {
                title,
                description,
                manager: managerId,
                attendees: attendeeIds.map(id => ({
                    user: id,
                    status: 'pending'
                })),
                scheduledDate: new Date(scheduledDate),
                duration,
                status: 'scheduled'
            };

            const appointment = await this.appointmentRepository.create(appointmentData);

            res.status(201).json({
                success: true,
                message: 'Appointment created successfully',
                data: appointment
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while creating appointment', 500));
        }
    }

    // Get appointment by ID
    async getAppointmentById(req, res, next) {
        try {
            const appointmentId = req.params.id;
            const userId = req.userId;

            if (!appointmentId) {
                throw new ApplicationError('Appointment ID is required', 400);
            }

            const appointment = await this.appointmentRepository.findById(appointmentId);
            if (!appointment) {
                throw new ApplicationError('Appointment not found', 404);
            }

            // Check if user has access to this appointment
            const isManager = appointment.manager._id.toString() === userId;
            const isAttendee = appointment.attendees.some(attendee => 
                attendee.user._id.toString() === userId
            );

            if (!isManager && !isAttendee) {
                throw new ApplicationError('You do not have access to this appointment', 403);
            }

            res.status(200).json({
                success: true,
                message: 'Appointment retrieved successfully',
                data: appointment
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while retrieving appointment', 500));
        }
    }

    // Update appointment (managers only)
    async updateAppointment(req, res, next) {
        try {
            const appointmentId = req.params.id;
            const userId = req.userId;
            const userRole = req.userRole;

            if (!appointmentId) {
                throw new ApplicationError('Appointment ID is required', 400);
            }

            // Check if user is a manager
            if (userRole !== 'Manager') {
                throw new ApplicationError('Only managers can update appointments', 403);
            }

            // Check if appointment exists
            const existingAppointment = await this.appointmentRepository.findById(appointmentId);
            if (!existingAppointment) {
                throw new ApplicationError('Appointment not found', 404);
            }

            // Check if manager owns this appointment
            if (existingAppointment.manager._id.toString() !== userId) {
                throw new ApplicationError('You can only update your own appointments', 403);
            }

            const { title, description, attendeeIds, scheduledDate, duration, status } = req.body;

            // Prepare update data
            const updateData = {};
            if (title !== undefined) updateData.title = title;
            if (description !== undefined) updateData.description = description;
            if (scheduledDate !== undefined) {
                if (new Date(scheduledDate) <= new Date()) {
                    throw new ApplicationError('Scheduled date must be in the future', 400);
                }
                updateData.scheduledDate = new Date(scheduledDate);
            }
            if (duration !== undefined) updateData.duration = duration;
            if (status !== undefined) updateData.status = status;

            // Handle attendee updates
            if (attendeeIds && Array.isArray(attendeeIds)) {
                if (attendeeIds.length === 0) {
                    throw new ApplicationError('At least one attendee is required', 400);
                }

                // Validate new attendees
                const attendees = await this.userRepository.findByIds(attendeeIds);
                if (attendees.length !== attendeeIds.length) {
                    throw new ApplicationError('One or more attendees not found', 404);
                }

                const nonDevelopers = attendees.filter(attendee => attendee.role !== 'Developer');
                if (nonDevelopers.length > 0) {
                    throw new ApplicationError('All attendees must be developers', 400);
                }

                // Check for blocked users
                for (const attendeeId of attendeeIds) {
                    const isBlocked = await this.blockedUserRepository.isBlocked(userId, attendeeId) ||
                                    await this.blockedUserRepository.isBlocked(attendeeId, userId);
                    
                    if (isBlocked) {
                        const attendee = attendees.find(a => a._id.toString() === attendeeId);
                        throw new ApplicationError(`Cannot schedule appointment with ${attendee.firstName} ${attendee.lastName} due to blocking restrictions`, 400);
                    }
                }

                // Preserve existing responses for unchanged attendees
                const existingAttendees = existingAppointment.attendees;
                updateData.attendees = attendeeIds.map(id => {
                    const existing = existingAttendees.find(a => a.user._id.toString() === id);
                    return existing ? existing : { user: id, status: 'pending' };
                });
            }

            if (Object.keys(updateData).length === 0) {
                throw new ApplicationError('No valid fields to update', 400);
            }

            const updatedAppointment = await this.appointmentRepository.updateById(appointmentId, updateData);

            res.status(200).json({
                success: true,
                message: 'Appointment updated successfully',
                data: updatedAppointment
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while updating appointment', 500));
        }
    }

    // Delete appointment (managers only)
    async deleteAppointment(req, res, next) {
        try {
            const appointmentId = req.params.id;
            const userId = req.userId;
            const userRole = req.userRole;

            if (!appointmentId) {
                throw new ApplicationError('Appointment ID is required', 400);
            }

            // Check if user is a manager
            if (userRole !== 'Manager') {
                throw new ApplicationError('Only managers can delete appointments', 403);
            }

            // Check if appointment exists
            const appointment = await this.appointmentRepository.findById(appointmentId);
            if (!appointment) {
                throw new ApplicationError('Appointment not found', 404);
            }

            // Check if manager owns this appointment
            if (appointment.manager._id.toString() !== userId) {
                throw new ApplicationError('You can only delete your own appointments', 403);
            }

            await this.appointmentRepository.deleteById(appointmentId);

            res.status(200).json({
                success: true,
                message: 'Appointment deleted successfully'
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while deleting appointment', 500));
        }
    }

    async acceptAppointment(req, res, next) {
        try {
            const appointmentId = req.params.id;
            const userId = req.userId;
            const userRole = req.userRole;
    
            if (!appointmentId) {
                throw new ApplicationError('Appointment ID is required', 400);
            }
    
            // // Only developers can accept appointments
            // if (userRole !== 'Developer') {
            //     throw new ApplicationError('Only developers can accept appointments', 403);
            // }
    
            // Get appointment
            const appointment = await this.appointmentRepository.findById(appointmentId);
            if (!appointment) {
                throw new ApplicationError('Appointment not found', 404);
            }
    
            // Check if user is assigned to this appointment
            const attendeeIndex = appointment.attendees.findIndex(
                attendee => attendee.user._id.toString() === userId
            );
    
            if (attendeeIndex === -1) {
                throw new ApplicationError('You are not assigned to this appointment', 403);
            }
    
            // Update attendee status
            const updatedAppointment = await this.appointmentRepository.updateAttendeeStatus(
                appointmentId, 
                userId, 
                'accepted'
            );
    
            res.status(200).json({
                success: true,
                message: 'Appointment accepted successfully',
                data: updatedAppointment
            });
    
        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while accepting appointment', 500));
        }
    }
    
    // Decline appointment (developers only)
    async declineAppointment(req, res, next) {
        try {
            const appointmentId = req.params.id;
            const userId = req.userId;
            const userRole = req.userRole;
    
            if (!appointmentId) {
                throw new ApplicationError('Appointment ID is required', 400);
            }
    
            // Only developers can decline appointments
            if (userRole !== 'Developer') {
                throw new ApplicationError('Only developers can decline appointments', 403);
            }
    
            // Get appointment
            const appointment = await this.appointmentRepository.findById(appointmentId);
            if (!appointment) {
                throw new ApplicationError('Appointment not found', 404);
            }
    
            // Check if user is assigned to this appointment
            const attendeeIndex = appointment.attendees.findIndex(
                attendee => attendee.user._id.toString() === userId
            );
    
            if (attendeeIndex === -1) {
                throw new ApplicationError('You are not assigned to this appointment', 403);
            }
    
            const { reason } = req.body;
    
            // Update attendee status
            const updatedAppointment = await this.appointmentRepository.updateAttendeeStatus(
                appointmentId, 
                userId, 
                'declined',
                reason
            );
    
            res.status(200).json({
                success: true,
                message: 'Appointment declined successfully',
                data: updatedAppointment
            });
    
        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while declining appointment', 500));
        }
    }
    
    // Get appointment status
    async getAppointmentStatus(req, res, next) {
        try {
            const appointmentId = req.params.id;
            const userId = req.userId;
    
            if (!appointmentId) {
                throw new ApplicationError('Appointment ID is required', 400);
            }
    
            const appointment = await this.appointmentRepository.findById(appointmentId);
            if (!appointment) {
                throw new ApplicationError('Appointment not found', 404);
            }
    
            // Check if user has access to this appointment
            const isManager = appointment.manager._id.toString() === userId;
            const isAttendee = appointment.attendees.some(attendee => 
                attendee.user._id.toString() === userId
            );
    
            if (!isManager && !isAttendee) {
                throw new ApplicationError('You do not have access to this appointment', 403);
            }
    
            // Prepare status summary
            const statusSummary = {
                appointmentId: appointment._id,
                title: appointment.title,
                status: appointment.status,
                scheduledDate: appointment.scheduledDate,
                manager: {
                    _id: appointment.manager._id,
                    name: `${appointment.manager.firstName} ${appointment.manager.lastName}`,
                    email: appointment.manager.email
                },
                attendees: appointment.attendees.map(attendee => ({
                    user: {
                        _id: attendee.user._id,
                        name: `${attendee.user.firstName} ${attendee.user.lastName}`,
                        email: attendee.user.email
                    },
                    status: attendee.status,
                    respondedAt: attendee.respondedAt,
                    notes: attendee.notes
                })),
                summary: {
                    totalAttendees: appointment.attendees.length,
                    accepted: appointment.attendees.filter(a => a.status === 'accepted').length,
                    declined: appointment.attendees.filter(a => a.status === 'declined').length,
                    pending: appointment.attendees.filter(a => a.status === 'pending').length
                }
            };
    
            res.status(200).json({
                success: true,
                message: 'Appointment status retrieved successfully',
                data: statusSummary
            });
    
        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while retrieving appointment status', 500));
        }
    }
    
    // Get current user's created appointments
    async getMyCreatedAppointments(req, res, next) {
        try {
            const userId = req.userId;
            const userRole = req.userRole;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
    
            // Only managers can have created appointments
            if (userRole !== 'Manager') {
                return res.status(200).json({
                    success: true,
                    message: 'No created appointments (only managers can create appointments)',
                    data: [],
                    pagination: {
                        currentPage: page,
                        totalPages: 0,
                        totalAppointments: 0,
                        limit: limit,
                        hasNext: false,
                        hasPrev: false
                    }
                });
            }
    
            // Apply filters
            const filters = { manager: userId };
            
            // Date filtering
            if (req.query.startDate) {
                filters.scheduledDate = { $gte: new Date(req.query.startDate) };
            }
            if (req.query.endDate) {
                if (filters.scheduledDate) {
                    filters.scheduledDate.$lte = new Date(req.query.endDate);
                } else {
                    filters.scheduledDate = { $lte: new Date(req.query.endDate) };
                }
            }
            
            if (req.query.status) {
                filters.status = req.query.status;
            }
    
            const result = await this.appointmentRepository.getAllWithPagination(page, limit, filters);
    
            res.status(200).json({
                success: true,
                message: 'Created appointments retrieved successfully',
                data: result.appointments,
                pagination: {
                    currentPage: page,
                    totalPages: result.totalPages,
                    totalAppointments: result.totalAppointments,
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
            next(new ApplicationError('Something went wrong while retrieving created appointments', 500));
        }
    }
    
    // Get current user's assigned appointments
    async getMyAssignedAppointments(req, res, next) {
        try {
            const userId = req.userId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
    
            // Apply filters
            const filters = { 'attendees.user': userId };
            
            // Date filtering
            if (req.query.startDate) {
                filters.scheduledDate = { $gte: new Date(req.query.startDate) };
            }
            if (req.query.endDate) {
                if (filters.scheduledDate) {
                    filters.scheduledDate.$lte = new Date(req.query.endDate);
                } else {
                    filters.scheduledDate = { $lte: new Date(req.query.endDate) };
                }
            }
            
            if (req.query.status) {
                filters.status = req.query.status;
            }
    
            // Filter by response status
            if (req.query.responseStatus) {
                filters['attendees.status'] = req.query.responseStatus;
            }
    
            const result = await this.appointmentRepository.getAllWithPagination(page, limit, filters);
    
            res.status(200).json({
                success: true,
                message: 'Assigned appointments retrieved successfully',
                data: result.appointments,
                pagination: {
                    currentPage: page,
                    totalPages: result.totalPages,
                    totalAppointments: result.totalAppointments,
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
            next(new ApplicationError('Something went wrong while retrieving assigned appointments', 500));
        }
    }
    
    // Get specific user's created appointments
    async getUserCreatedAppointments(req, res, next) {
        try {
            const targetUserId = req.params.userId;
            const currentUserId = req.userId;
            const currentUserRole = req.userRole;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
    
            if (!targetUserId) {
                throw new ApplicationError('User ID is required', 400);
            }
    
            // Authorization: users can see their own, managers can see others
            if (currentUserRole !== 'Manager' && targetUserId !== currentUserId) {
                throw new ApplicationError('You can only view your own appointments', 403);
            }
    
            // Check if target user exists
            const targetUser = await this.userRepository.findById(targetUserId);
            if (!targetUser) {
                throw new ApplicationError('User not found', 404);
            }
    
            // Apply filters
            const filters = { manager: targetUserId };
            
            if (req.query.startDate) {
                filters.scheduledDate = { $gte: new Date(req.query.startDate) };
            }
            if (req.query.endDate) {
                if (filters.scheduledDate) {
                    filters.scheduledDate.$lte = new Date(req.query.endDate);
                } else {
                    filters.scheduledDate = { $lte: new Date(req.query.endDate) };
                }
            }
            
            if (req.query.status) {
                filters.status = req.query.status;
            }
    
            const result = await this.appointmentRepository.getAllWithPagination(page, limit, filters);
    
            res.status(200).json({
                success: true,
                message: `Created appointments retrieved successfully for ${targetUser.firstName} ${targetUser.lastName}`,
                data: result.appointments,
                user: {
                    _id: targetUser._id,
                    name: `${targetUser.firstName} ${targetUser.lastName}`,
                    email: targetUser.email,
                    role: targetUser.role
                },
                pagination: {
                    currentPage: page,
                    totalPages: result.totalPages,
                    totalAppointments: result.totalAppointments,
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
            next(new ApplicationError('Something went wrong while retrieving user created appointments', 500));
        }
    }
    
    // Get specific user's assigned appointments
    async getUserAssignedAppointments(req, res, next) {
        try {
            const targetUserId = req.params.userId;
            const currentUserId = req.userId;
            const currentUserRole = req.userRole;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
    
            if (!targetUserId) {
                throw new ApplicationError('User ID is required', 400);
            }
    
            // Authorization: users can see their own, managers can see others
            if (currentUserRole !== 'Manager' && targetUserId !== currentUserId) {
                throw new ApplicationError('You can only view your own appointments', 403);
            }
    
            // Check if target user exists
            const targetUser = await this.userRepository.findById(targetUserId);
            if (!targetUser) {
                throw new ApplicationError('User not found', 404);
            }
    
            // Apply filters
            const filters = { 'attendees.user': targetUserId };
            
            if (req.query.startDate) {
                filters.scheduledDate = { $gte: new Date(req.query.startDate) };
            }
            if (req.query.endDate) {
                if (filters.scheduledDate) {
                    filters.scheduledDate.$lte = new Date(req.query.endDate);
                } else {
                    filters.scheduledDate = { $lte: new Date(req.query.endDate) };
                }
            }
            
            if (req.query.status) {
                filters.status = req.query.status;
            }
    
            if (req.query.responseStatus) {
                filters['attendees.status'] = req.query.responseStatus;
            }
    
            const result = await this.appointmentRepository.getAllWithPagination(page, limit, filters);
    
            res.status(200).json({
                success: true,
                message: `Assigned appointments retrieved successfully for ${targetUser.firstName} ${targetUser.lastName}`,
                data: result.appointments,
                user: {
                    _id: targetUser._id,
                    name: `${targetUser.firstName} ${targetUser.lastName}`,
                    email: targetUser.email,
                    role: targetUser.role
                },
                pagination: {
                    currentPage: page,
                    totalPages: result.totalPages,
                    totalAppointments: result.totalAppointments,
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
            next(new ApplicationError('Something went wrong while retrieving user assigned appointments', 500));
        }
    }
}
