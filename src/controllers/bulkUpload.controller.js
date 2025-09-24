import BulkUploadRepository from '../repositories/bulkUpload.repository.js';
import UserRepository from '../repositories/user.repository.js';
import FileProcessor from '../services/fileProcessor.service.js';
import ApplicationError from '../middleware/applicationError.js';
import fs from 'fs';
import path from 'path';

export default class BulkUploadController {
    constructor() {
        this.bulkUploadRepository = new BulkUploadRepository();
        this.userRepository = new UserRepository();
        this.fileProcessor = new FileProcessor();
    }

    // Upload and process CSV/Excel file
    async uploadUsers(req, res, next) {
        try {
            const uploadedBy = req.userId;
            const userRole = req.userRole;

            // Only managers can upload bulk users
            if (userRole !== 'Manager') {
                // Clean up uploaded file
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                throw new ApplicationError('Only managers can upload bulk users', 403);
            }

            if (!req.file) {
                throw new ApplicationError('File is required', 400);
            }

            const fileData = {
                uploadedBy,
                fileName: req.file.filename,
                originalFileName: req.file.originalname,
                fileSize: req.file.size,
                mimeType: req.file.mimetype,
                filePath: req.file.path,
                status: 'processing'
            };

            // Create bulk upload record
            const uploadRecord = await this.bulkUploadRepository.create(fileData);

            // Process file asynchronously
            this.processFileAsync(uploadRecord._id, req.file.path);

            res.status(201).json({
                success: true,
                message: 'File uploaded successfully. Processing started.',
                data: {
                    uploadId: uploadRecord._id,
                    fileName: uploadRecord.originalFileName,
                    status: uploadRecord.status,
                    uploadedAt: uploadRecord.createdAt
                }
            });

        } catch (error) {
            // Clean up file if error occurs
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong during file upload', 500));
        }
    }

    // Process file asynchronously
    async processFileAsync(uploadId, filePath) {
        try {
            const startTime = Date.now();

            // Parse file
            const userData = await this.fileProcessor.parseFile(filePath);
            
            // Validate and process users
            const processResult = await this.processUsers(userData);

            // Update upload record
            const endTime = Date.now();
            await this.bulkUploadRepository.updateById(uploadId, {
                status: processResult.errors.length === 0 ? 'completed' : 'partial',
                totalRecords: userData.length,
                successfulRecords: processResult.successful,
                errorRecords: processResult.errors.length,
                errors: processResult.errors,
                processedAt: new Date(),
                processingTime: endTime - startTime
            });

        } catch (error) {
            console.log('File processing error:', error);
            
            // Update upload record with error status
            await this.bulkUploadRepository.updateById(uploadId, {
                status: 'failed',
                errors: [{
                    row: 0,
                    message: 'File processing failed: ' + error.message
                }],
                processedAt: new Date()
            });
        }
    }

    // Process user data and create users
    async processUsers(userData) {
        const errors = [];
        let successful = 0;

        for (let i = 0; i < userData.length; i++) {
            const rowData = userData[i];
            const rowNumber = i + 2; // +2 because row 1 is header, array is 0-indexed

            try {
                // Validate required fields
                const validationError = this.validateUserData(rowData, rowNumber);
                if (validationError) {
                    errors.push(validationError);
                    continue;
                }

                // Check if user already exists
                const existingUser = await this.userRepository.findByEmail(rowData.email);
                if (existingUser) {
                    errors.push({
                        row: rowNumber,
                        field: 'email',
                        message: 'Email already exists',
                        data: rowData
                    });
                    continue;
                }

                // Create user
                const userData = {
                    firstName: rowData.firstName.trim(),
                    lastName: rowData.lastName.trim(),
                    email: rowData.email.trim().toLowerCase(),
                    password: rowData.password,
                    role: rowData.role,
                    phone: rowData.phone ? rowData.phone.trim() : undefined,
                    department: rowData.department ? rowData.department.trim() : undefined
                };

                await this.userRepository.create(userData);
                successful++;

            } catch (error) {
                console.log(`Error processing row ${rowNumber}:`, error);
                errors.push({
                    row: rowNumber,
                    field: 'general',
                    message: error.message || 'Error creating user',
                    data: rowData
                });
            }
        }

        return { successful, errors };
    }

    // Validate user data
    validateUserData(data, rowNumber) {
        const requiredFields = ['firstName', 'lastName', 'email', 'password', 'role'];
        
        for (const field of requiredFields) {
            if (!data[field] || data[field].toString().trim() === '') {
                return {
                    row: rowNumber,
                    field: field,
                    message: `${field} is required`,
                    data: data
                };
            }
        }

        // Validate email format
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(data.email)) {
            return {
                row: rowNumber,
                field: 'email',
                message: 'Invalid email format',
                data: data
            };
        }

        // Validate role
        if (!['Manager', 'Developer'].includes(data.role)) {
            return {
                row: rowNumber,
                field: 'role',
                message: 'Role must be Manager or Developer',
                data: data
            };
        }

        // Validate password length
        if (data.password.length < 8) {
            return {
                row: rowNumber,
                field: 'password',
                message: 'Password must be at least 8 characters',
                data: data
            };
        }

        return null;
    }

    // Get upload history
    async getUploadHistory(req, res, next) {
        try {
            const uploadedBy = req.userId;
            const userRole = req.userRole;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            // Managers can see all uploads, others see only their own
            const filters = userRole === 'Manager' ? {} : { uploadedBy };

            if (req.query.status) {
                filters.status = req.query.status;
            }

            const result = await this.bulkUploadRepository.getAllWithPagination(page, limit, filters);

            res.status(200).json({
                success: true,
                message: 'Upload history retrieved successfully',
                data: result.uploads,
                pagination: {
                    currentPage: page,
                    totalPages: result.totalPages,
                    totalUploads: result.totalUploads,
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
            next(new ApplicationError('Something went wrong while retrieving upload history', 500));
        }
    }

    // Get upload details by ID
    async getUploadById(req, res, next) {
        try {
            const uploadId = req.params.id;
            const userId = req.userId;
            const userRole = req.userRole;

            if (!uploadId) {
                throw new ApplicationError('Upload ID is required', 400);
            }

            const upload = await this.bulkUploadRepository.findById(uploadId);
            if (!upload) {
                throw new ApplicationError('Upload not found', 404);
            }

            // Check permissions: users can see their own, managers can see all
            if (userRole !== 'Manager' && upload.uploadedBy._id.toString() !== userId) {
                throw new ApplicationError('You can only view your own uploads', 403);
            }

            res.status(200).json({
                success: true,
                message: 'Upload details retrieved successfully',
                data: upload
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while retrieving upload details', 500));
        }
    }

    // Download original file
    async downloadFile(req, res, next) {
        try {
            const uploadId = req.params.id;
            const userId = req.userId;
            const userRole = req.userRole;

            if (!uploadId) {
                throw new ApplicationError('Upload ID is required', 400);
            }

            const upload = await this.bulkUploadRepository.findById(uploadId);
            if (!upload) {
                throw new ApplicationError('Upload not found', 404);
            }

            // Check permissions
            if (userRole !== 'Manager' && upload.uploadedBy._id.toString() !== userId) {
                throw new ApplicationError('You can only download your own files', 403);
            }

            // Check if file exists
            if (!fs.existsSync(upload.filePath)) {
                throw new ApplicationError('File not found on server', 404);
            }

            // Set headers for file download
            res.setHeader('Content-Disposition', `attachment; filename="${upload.originalFileName}"`);
            res.setHeader('Content-Type', upload.mimeType);

            // Stream file to response
            const fileStream = fs.createReadStream(upload.filePath);
            fileStream.pipe(res);

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while downloading file', 500));
        }
    }

    // Get upload errors
    async getUploadErrors(req, res, next) {
        try {
            const uploadId = req.params.id;
            const userId = req.userId;
            const userRole = req.userRole;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;

            if (!uploadId) {
                throw new ApplicationError('Upload ID is required', 400);
            }

            const upload = await this.bulkUploadRepository.findById(uploadId);
            if (!upload) {
                throw new ApplicationError('Upload not found', 404);
            }

            // Check permissions
            if (userRole !== 'Manager' && upload.uploadedBy._id.toString() !== userId) {
                throw new ApplicationError('You can only view your own upload errors', 403);
            }

            // Paginate errors
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedErrors = upload.errors.slice(startIndex, endIndex);
            const totalErrors = upload.errors.length;
            const totalPages = Math.ceil(totalErrors / limit);

            res.status(200).json({
                success: true,
                message: 'Upload errors retrieved successfully',
                data: {
                    uploadInfo: {
                        _id: upload._id,
                        fileName: upload.originalFileName,
                        status: upload.status,
                        totalRecords: upload.totalRecords,
                        errorRecords: upload.errorRecords
                    },
                    errors: paginatedErrors
                },
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalErrors: totalErrors,
                    limit: limit,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while retrieving upload errors', 500));
        }
    }

    // Delete upload record
    async deleteUpload(req, res, next) {
        try {
            const uploadId = req.params.id;
            const userId = req.userId;
            const userRole = req.userRole;

            if (!uploadId) {
                throw new ApplicationError('Upload ID is required', 400);
            }

            const upload = await this.bulkUploadRepository.findById(uploadId);
            if (!upload) {
                throw new ApplicationError('Upload not found', 404);
            }

            // Check permissions: users can delete their own, managers can delete any
            if (userRole !== 'Manager' && upload.uploadedBy._id.toString() !== userId) {
                throw new ApplicationError('You can only delete your own uploads', 403);
            }

            // Delete file from filesystem
            if (fs.existsSync(upload.filePath)) {
                fs.unlinkSync(upload.filePath);
            }

            // Delete upload record
            await this.bulkUploadRepository.deleteById(uploadId);

            res.status(200).json({
                success: true,
                message: 'Upload record deleted successfully'
            });

        } catch (error) {
            console.log(error);
            if (error instanceof ApplicationError) {
                return next(error);
            }
            next(new ApplicationError('Something went wrong while deleting upload', 500));
        }
    }
}
