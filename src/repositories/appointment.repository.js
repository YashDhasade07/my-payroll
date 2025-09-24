import Appointment from '../models/Appointment.js';
import ApplicationError from '../middleware/applicationError.js';

export default class AppointmentRepository {
    
    async create(appointmentData) {
        try {
            const appointment = new Appointment(appointmentData);
            const savedAppointment = await appointment.save();
            return await this.findById(savedAppointment._id);
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new ApplicationError(error.message, 400);
            }
            throw new ApplicationError('Error creating appointment', 500);
        }
    }

    async getAllWithPagination(page, limit, filters = {}) {
        try {
            const skip = (page - 1) * limit;
            
            const appointments = await Appointment.find(filters)
                .populate('manager', 'firstName lastName email role department')
                .populate('attendees.user', 'firstName lastName email role department')
                .sort({ scheduledDate: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const totalAppointments = await Appointment.countDocuments(filters);
            const totalPages = Math.ceil(totalAppointments / limit);

            return {
                appointments,
                totalAppointments,
                totalPages,
                currentPage: page
            };
        } catch (error) {
            throw new ApplicationError('Error retrieving appointments', 500);
        }
    }

    async findById(appointmentId) {
        try {
            return await Appointment.findById(appointmentId)
                .populate('manager', 'firstName lastName email role department')
                .populate('attendees.user', 'firstName lastName email role department')
                .lean();
        } catch (error) {
            throw new ApplicationError('Error finding appointment', 500);
        }
    }

    async updateById(appointmentId, updateData) {
        try {
            const updatedAppointment = await Appointment.findByIdAndUpdate(
                appointmentId,
                { $set: updateData },
                { new: true, runValidators: true }
            )
            .populate('manager', 'firstName lastName email role department')
            .populate('attendees.user', 'firstName lastName email role department')
            .lean();

            if (!updatedAppointment) {
                throw new ApplicationError('Appointment not found', 404);
            }

            return updatedAppointment;
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new ApplicationError(error.message, 400);
            }
            if (error instanceof ApplicationError) {
                throw error;
            }
            throw new ApplicationError('Error updating appointment', 500);
        }
    }

    async deleteById(appointmentId) {
        try {
            const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);
            if (!deletedAppointment) {
                throw new ApplicationError('Appointment not found', 404);
            }
            return deletedAppointment;
        } catch (error) {
            if (error instanceof ApplicationError) {
                throw error;
            }
            throw new ApplicationError('Error deleting appointment', 500);
        }
    }

    async findByManager(managerId, page = 1, limit = 10, filters = {}) {
        try {
            filters.manager = managerId;
            return await this.getAllWithPagination(page, limit, filters);
        } catch (error) {
            throw new ApplicationError('Error finding appointments by manager', 500);
        }
    }

    async findByAttendee(attendeeId, page = 1, limit = 10, filters = {}) {
        try {
            filters['attendees.user'] = attendeeId;
            return await this.getAllWithPagination(page, limit, filters);
        } catch (error) {
            throw new ApplicationError('Error finding appointments by attendee', 500);
        }
    }

    async updateAttendeeStatus(appointmentId, userId, status, notes = null) {
        try {
            const updateQuery = {
                'attendees.user': userId
            };
    
            const updateData = {
                'attendees.$.status': status,
                'attendees.$.respondedAt': new Date()
            };
    
            if (notes) {
                updateData['attendees.$.notes'] = notes;
            }
    
            const updatedAppointment = await Appointment.findOneAndUpdate(
                { _id: appointmentId, ...updateQuery },
                { $set: updateData },
                { new: true, runValidators: true }
            )
            .populate('manager', 'firstName lastName email role department')
            .populate('attendees.user', 'firstName lastName email role department')
            .lean();
    
            if (!updatedAppointment) {
                throw new ApplicationError('Appointment not found or user not assigned', 404);
            }
    
            return updatedAppointment;
        } catch (error) {
            if (error instanceof ApplicationError) {
                throw error;
            }
            throw new ApplicationError('Error updating attendee status', 500);
        }
    }
}
