import express from 'express';
import AppointmentController from '../controllers/appointment.controller.js';
import jwtAuth from '../middleware/jwt.middleware.js';

const appointmentRouter = express.Router();
let appointmentController = new AppointmentController();

// Appointment management routes
appointmentRouter.get('/', jwtAuth, (req, res, next) => {
    appointmentController.getAllAppointments(req, res, next);
});

appointmentRouter.post('/', jwtAuth, (req, res, next) => {
    appointmentController.createAppointment(req, res, next);
});

appointmentRouter.get('/my-created', jwtAuth, (req, res, next) => {
    appointmentController.getMyCreatedAppointments(req, res, next);
});

appointmentRouter.get('/my-assigned', jwtAuth, (req, res, next) => {
    appointmentController.getMyAssignedAppointments(req, res, next);
});

appointmentRouter.get('/:id', jwtAuth, (req, res, next) => {
    appointmentController.getAppointmentById(req, res, next);
});

appointmentRouter.put('/:id', jwtAuth, (req, res, next) => {
    appointmentController.updateAppointment(req, res, next);
});

appointmentRouter.delete('/:id', jwtAuth, (req, res, next) => {
    appointmentController.deleteAppointment(req, res, next);
});

////////
appointmentRouter.put('/:id/accept', jwtAuth, (req, res, next) => {
    appointmentController.acceptAppointment(req, res, next);
});

appointmentRouter.put('/:id/decline', jwtAuth, (req, res, next) => {
    appointmentController.declineAppointment(req, res, next);
});

appointmentRouter.get('/:id/status', jwtAuth, (req, res, next) => {
    appointmentController.getAppointmentStatus(req, res, next);
});

export default appointmentRouter;
