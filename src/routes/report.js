import express from 'express';
import ReportController from '../controllers/report.controller.js';
import jwtAuth from '../middleware/jwt.middleware.js';

const reportRouter = express.Router();
let reportController = new ReportController();

// Meeting reports
reportRouter.get('/meetings/monthly', jwtAuth, (req, res, next) => {
    reportController.getMonthlyMeetingStats(req, res, next);
});

reportRouter.get('/meetings/custom', jwtAuth, (req, res, next) => {
    reportController.getCustomDateRangeReport(req, res, next);
});

reportRouter.get('/meetings/scheduled', jwtAuth, (req, res, next) => {
    reportController.getScheduledMeetingsCount(req, res, next);
});

reportRouter.get('/meetings/attended', jwtAuth, (req, res, next) => {
    reportController.getAttendedMeetingsCount(req, res, next);
});

// User and appointment reports
reportRouter.get('/users/activity', jwtAuth, (req, res, next) => {
    reportController.getUserActivityReport(req, res, next);
});

reportRouter.get('/appointments/status', jwtAuth, (req, res, next) => {
    reportController.getAppointmentStatusSummary(req, res, next);
});

export default reportRouter;
