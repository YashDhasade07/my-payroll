import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import ApplicationError from '../middleware/applicationError.js';

export default class ReportRepository {
    
    async getMonthlyStats(year, userFilter = {}) {
        try {
            const pipeline = [
                {
                    $match: {
                        ...userFilter,
                        scheduledDate: {
                            $gte: new Date(year, 0, 1),
                            $lt: new Date(year + 1, 0, 1)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $month: '$scheduledDate' },
                        total: { $sum: 1 },
                        scheduled: { $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] } },
                        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                        cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
                        totalDuration: { $sum: '$duration' }
                    }
                },
                { $sort: { '_id': 1 } }
            ];

            const results = await Appointment.aggregate(pipeline);

            // Fill missing months with zero data
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthlyStats = [];

            for (let month = 1; month <= 12; month++) {
                const monthData = results.find(r => r._id === month) || {
                    total: 0, scheduled: 0, completed: 0, cancelled: 0, totalDuration: 0
                };
                
                monthlyStats.push({
                    month: monthNames[month - 1],
                    monthNumber: month,
                    ...monthData
                });
            }

            return monthlyStats;
        } catch (error) {
            throw new ApplicationError('Error retrieving monthly statistics', 500);
        }
    }

    async getCustomDateRangeReport(startDate, endDate, userFilter = {}) {
        try {
            const pipeline = [
                {
                    $match: {
                        ...userFilter,
                        scheduledDate: {
                            $gte: startDate,
                            $lte: endDate
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalAppointments: { $sum: 1 },
                        scheduled: { $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] } },
                        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                        cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
                        totalDuration: { $sum: '$duration' },
                        avgDuration: { $avg: '$duration' },
                        totalAttendees: { $sum: { $size: '$attendees' } }
                    }
                }
            ];

            const result = await Appointment.aggregate(pipeline);
            return result[0] || {
                totalAppointments: 0,
                scheduled: 0,
                completed: 0,
                cancelled: 0,
                totalDuration: 0,
                avgDuration: 0,
                totalAttendees: 0
            };
        } catch (error) {
            throw new ApplicationError('Error generating custom date range report', 500);
        }
    }

    async getAppointmentsByStatus(status, additionalFilters = {}) {
        try {
            const baseFilter = { status, ...additionalFilters };
            
            const now = new Date();
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            const pipeline = [
                { $match: baseFilter },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                        avgDuration: { $avg: '$duration' },
                        thisWeek: {
                            $sum: {
                                $cond: [
                                    { $gte: ['$scheduledDate', startOfWeek] },
                                    1,
                                    0
                                ]
                            }
                        },
                        thisMonth: {
                            $sum: {
                                $cond: [
                                    { $gte: ['$scheduledDate', startOfMonth] },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                }
            ];

            const result = await Appointment.aggregate(pipeline);
            return result[0] || { count: 0, avgDuration: 0, thisWeek: 0, thisMonth: 0 };
        } catch (error) {
            throw new ApplicationError('Error retrieving appointments by status', 500);
        }
    }

    async getAttendedMeetingsStats(timeframe, filters = {}) {
        try {
            const now = new Date();
            let startDate;

            switch (timeframe) {
                case 'week':
                    startDate = new Date(now.setDate(now.getDate() - 7));
                    break;
                case 'quarter':
                    startDate = new Date(now.setMonth(now.getMonth() - 3));
                    break;
                case 'year':
                    startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                    break;
                default: // month
                    startDate = new Date(now.setMonth(now.getMonth() - 1));
            }

            const pipeline = [
                {
                    $match: {
                        ...filters,
                        scheduledDate: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                        totalDuration: { $sum: '$duration' },
                        avgDuration: { $avg: '$duration' },
                        attendanceRate: {
                            $avg: {
                                $divide: [
                                    { $size: { $filter: { input: '$attendees', cond: { $eq: ['$$this.status', 'accepted'] } } } },
                                    { $size: '$attendees' }
                                ]
                            }
                        }
                    }
                }
            ];

            const result = await Appointment.aggregate(pipeline);
            return result[0] || { count: 0, totalDuration: 0, avgDuration: 0, attendanceRate: 0 };
        } catch (error) {
            throw new ApplicationError('Error retrieving attended meetings statistics', 500);
        }
    }

    async getUserActivityReport(userId, timeframe) {
        try {
            const now = new Date();
            let startDate;

            switch (timeframe) {
                case 'week':
                    startDate = new Date(now.setDate(now.getDate() - 7));
                    break;
                case 'quarter':
                    startDate = new Date(now.setMonth(now.getMonth() - 3));
                    break;
                case 'year':
                    startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                    break;
                default: // month
                    startDate = new Date(now.setMonth(now.getMonth() - 1));
            }

            // Get created appointments
            const createdAppointments = await Appointment.countDocuments({
                manager: userId,
                createdAt: { $gte: startDate }
            });

            // Get assigned appointments and responses
            const assignedPipeline = [
                {
                    $match: {
                        'attendees.user': userId,
                        createdAt: { $gte: startDate }
                    }
                },
                {
                    $unwind: '$attendees'
                },
                {
                    $match: {
                        'attendees.user': userId
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalAssigned: { $sum: 1 },
                        accepted: { $sum: { $cond: [{ $eq: ['$attendees.status', 'accepted'] }, 1, 0] } },
                        declined: { $sum: { $cond: [{ $eq: ['$attendees.status', 'declined'] }, 1, 0] } },
                        attended: { $sum: { $cond: [{ $and: [{ $eq: ['$attendees.status', 'accepted'] }, { $eq: ['$status', 'completed'] }] }, 1, 0] } },
                        totalHours: { $sum: { $cond: [{ $and: [{ $eq: ['$attendees.status', 'accepted'] }, { $eq: ['$status', 'completed'] }] }, { $divide: ['$duration', 60] }, 0] } }
                    }
                }
            ];

            const assignedResults = await Appointment.aggregate(assignedPipeline);
            const assignedData = assignedResults[0] || {
                totalAssigned: 0,
                accepted: 0,
                declined: 0,
                attended: 0,
                totalHours: 0
            };

            return {
                created: createdAppointments,
                assigned: assignedData.totalAssigned,
                accepted: assignedData.accepted,
                declined: assignedData.declined,
                attended: assignedData.attended,
                responseRate: assignedData.totalAssigned > 0 ? 
                    Math.round(((assignedData.accepted + assignedData.declined) / assignedData.totalAssigned) * 100) : 0,
                attendanceRate: assignedData.accepted > 0 ? 
                    Math.round((assignedData.attended / assignedData.accepted) * 100) : 0,
                totalHours: Math.round(assignedData.totalHours * 10) / 10
            };
        } catch (error) {
            throw new ApplicationError('Error retrieving user activity report', 500);
        }
    }

    async getAppointmentStatusSummary(userFilter = {}) {
        try {
            const pipeline = [
                { $match: userFilter },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        scheduled: { $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] } },
                        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                        cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
                        totalAttendees: { $sum: { $size: '$attendees' } },
                        pendingResponses: { $sum: { $size: { $filter: { input: '$attendees', cond: { $eq: ['$$this.status', 'pending'] } } } } },
                        acceptedResponses: { $sum: { $size: { $filter: { input: '$attendees', cond: { $eq: ['$$this.status', 'accepted'] } } } } },
                        declinedResponses: { $sum: { $size: { $filter: { input: '$attendees', cond: { $eq: ['$$this.status', 'declined'] } } } } }
                    }
                }
            ];

            const result = await Appointment.aggregate(pipeline);
            const data = result[0] || {
                total: 0, scheduled: 0, completed: 0, cancelled: 0,
                totalAttendees: 0, pendingResponses: 0, acceptedResponses: 0, declinedResponses: 0
            };

            return {
                ...data,
                responseRate: data.totalAttendees > 0 ? 
                    Math.round(((data.acceptedResponses + data.declinedResponses) / data.totalAttendees) * 100) : 0,
                completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
                cancellationRate: data.total > 0 ? Math.round((data.cancelled / data.total) * 100) : 0
            };
        } catch (error) {
            throw new ApplicationError('Error retrieving appointment status summary', 500);
        }
    }
}
