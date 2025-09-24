import express from 'express';
import BulkUploadController from '../controllers/bulkUpload.controller.js';
import jwtAuth from '../middleware/jwt.middleware.js';
import uploadMiddleware from '../middleware/upload.middleware.js';

const bulkUploadRouter = express.Router();
let bulkUploadController = new BulkUploadController();

// Bulk upload routes
bulkUploadRouter.post('/users', jwtAuth, uploadMiddleware.single('file'), (req, res, next) => {
    bulkUploadController.uploadUsers(req, res, next);
});

bulkUploadRouter.get('/history', jwtAuth, (req, res, next) => {
    bulkUploadController.getUploadHistory(req, res, next);
});

bulkUploadRouter.get('/:id', jwtAuth, (req, res, next) => {
    bulkUploadController.getUploadById(req, res, next);
});

bulkUploadRouter.get('/:id/download', jwtAuth, (req, res, next) => {
    bulkUploadController.downloadFile(req, res, next);
});

bulkUploadRouter.get('/:id/errors', jwtAuth, (req, res, next) => {
    bulkUploadController.getUploadErrors(req, res, next);
});

bulkUploadRouter.delete('/:id', jwtAuth, (req, res, next) => {
    bulkUploadController.deleteUpload(req, res, next);
});

export default bulkUploadRouter;
