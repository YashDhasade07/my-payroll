import AppointmentRepository from '../repositories/appointment.repository.js';
import UserRepository from '../repositories/user.repository.js';
import ReportRepository from '../repositories/report.repository.js';
import ApplicationError from '../middleware/applicationError.js';

export default class ReportController {
    constructor() {
        this.appointmentRepository = new AppointmentRepository();
        this.userRepository = new UserRepository();
        this.reportRepository = new ReportRepository();
    }

    async getMonthlyMeetingStats(req, res, next) {
        try {
            const userId = req.userId;
            const userRole = req.userRole;
            const year = parseInt(req.query.year) || new Date().getFullYear();

            const userFilter = userRole === 'Manager' ? {} : { 'attendees.user': userId };

            const monthlyStats = await this.reportRepository.getMonthlyStats(year, userFilter);

            res.status(200).json({
                success: true,
                message: 'Monthly meeting statistics retrieved successfully',
                data: {
                    year,
                    monthlyBreakdown: monthlyStats,
                    summary: {
                        totalAppointments: monthlyStats.reduce((sum, month) => sum + month.total, 0),
                        totalCompleted: monthlyStats.reduce((sum, month) => sum + month.completed, 0),
                        totalCancelled: monthlyStats.reduce((sum, month) => sum + month.cancelled, 0),
                        averagePerMonth: Math.round(monthlyStats.reduce((sum, month) => sum + month.total, 0) / 12)
                    }
                }
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while retrieving monthly statistics', 500));
        }
    }

    async getCustomDateRangeReport(req, res, next) {
        try {
            const userId = req.userId;
            const userRole = req.userRole;
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                throw new ApplicationError('Start date and end date are required', 400);
            }

            const start = new Date(startDate);
            const end = new Date(endDate);

            if (start >= end) {
                throw new ApplicationError('Start date must be before end date', 400);
            }

            const userFilter = userRole === 'Manager' ? {} : { 'attendees.user': userId };

            const customReport = await this.reportRepository.getCustomDateRangeReport(start, end, userFilter);

            res.status(200).json({
                success: true,
                message: 'Custom date range report retrieved successfully',
                data: {
                    dateRange: {
                        startDate: start,
                        endDate: end,
                        totalDays: Math.ceil((end - start) / (1000 * 60 * 60 * 24))
                    },
                    statistics: customReport,
                    dailyBreakdown: customReport.dailyStats || []
                }
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while generating custom report', 500));
        }
    }

    async getScheduledMeetingsCount(req, res, next) {
        try {
            const userId = req.userId;
            const userRole = req.userRole;

            const filters = { status: 'scheduled' };
            if (userRole === 'Developer') {
                filters['attendees.user'] = userId;
            }

            const scheduledMeetings = await this.reportRepository.getAppointmentsByStatus('scheduled', filters);

            res.status(200).json({
                success: true,
                message: 'Scheduled meetings count retrieved successfully',
                data: {
                    totalScheduled: scheduledMeetings.count,
                    upcomingThisWeek: scheduledMeetings.thisWeek,
                    upcomingThisMonth: scheduledMeetings.thisMonth,
                    byManager: scheduledMeetings.byManager,
                    averageDuration: scheduledMeetings.avgDuration,
                    details: req.query.includeDetails === 'true' ? scheduledMeetings.appointments : []
                }
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while retrieving scheduled meetings', 500));
        }
    }

    async getAttendedMeetingsCount(req, res, next) {
        try {
            const userId = req.userId;
            const userRole = req.userRole;
            const timeframe = req.query.timeframe || 'month';

            const filters = { status: 'completed' };
            if (userRole === 'Developer') {
                filters['attendees.user'] = userId;
            }

            const attendedMeetings = await this.reportRepository.getAttendedMeetingsStats(timeframe, filters);

            res.status(200).json({
                success: true,
                message: 'Attended meetings statistics retrieved successfully',
                data: {
                    timeframe,
                    totalAttended: attendedMeetings.count,
                    attendanceRate: attendedMeetings.attendanceRate,
                    totalDuration: attendedMeetings.totalDuration,
                    averageDuration: attendedMeetings.avgDuration,
                    byDepartment: attendedMeetings.byDepartment,
                    topAttendees: attendedMeetings.topAttendees,
                    details: req.query.includeDetails === 'true' ? attendedMeetings.appointments : []
                }
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while retrieving attended meetings', 500));
        }
    }

    async getUserActivityReport(req, res, next) {
        try {
            const currentUserId = req.userId;
            const userRole = req.userRole;
            const targetUserId = req.query.userId;
            const timeframe = req.query.timeframe || 'month';

            if (targetUserId && userRole !== 'Manager' && targetUserId !== currentUserId) {
                throw new ApplicationError('You can only view your own activity report', 403);
            }

            const userId = targetUserId || currentUserId;

            const activityReport = await this.reportRepository.getUserActivityReport(userId, timeframe);

            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new ApplicationError('User not found', 404);
            }

            res.status(200).json({
                success: true,
                message: 'User activity report retrieved successfully',
                data: {
                    user: {
                        _id: user._id,
                        name: `${user.firstName} ${user.lastName}`,
                        email: user.email,
                        role: user.role,
                        department: user.department
                    },
                    timeframe,
                    activity: {
                        appointmentsCreated: activityReport.created,
                        appointmentsAssigned: activityReport.assigned,
                        appointmentsAccepted: activityReport.accepted,
                        appointmentsDeclined: activityReport.declined,
                        appointmentsAttended: activityReport.attended,
                        responseRate: activityReport.responseRate,
                        attendanceRate: activityReport.attendanceRate,
                        totalHoursInMeetings: activityReport.totalHours
                    },
                    trends: activityReport.trends || []
                }
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while retrieving user activity', 500));
        }
    }

    async getAppointmentStatusSummary(req, res, next) {
        try {
            const userId = req.userId;
            const userRole = req.userRole;

            const userFilter = userRole === 'Manager' ? {} : { 'attendees.user': userId };

            const statusSummary = await this.reportRepository.getAppointmentStatusSummary(userFilter);

            res.status(200).json({
                success: true,
                message: 'Appointment status summary retrieved successfully',
                data: {
                    overview: {
                        total: statusSummary.total,
                        scheduled: statusSummary.scheduled,
                        completed: statusSummary.completed,
                        cancelled: statusSummary.cancelled
                    },
                    attendeeResponses: {
                        totalPending: statusSummary.pendingResponses,
                        totalAccepted: statusSummary.acceptedResponses,
                        totalDeclined: statusSummary.declinedResponses,
                        responseRate: statusSummary.responseRate
                    },
                    trends: {
                        thisWeek: statusSummary.thisWeekStats,
                        thisMonth: statusSummary.thisMonthStats,
                        lastMonth: statusSummary.lastMonthStats
                    },
                    healthMetrics: {
                        cancellationRate: statusSummary.cancellationRate,
                        completionRate: statusSummary.completionRate,
                        averageResponseTime: statusSummary.avgResponseTime
                    }
                }
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while retrieving status summary', 500));
        }
    }
}
