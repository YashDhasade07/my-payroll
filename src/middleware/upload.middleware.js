import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ApplicationError from './applicationError.js';

// Create uploads directory if it doesn't exist
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename: timestamp-userId-originalname
        const timestamp = Date.now();
        const userId = req.userId;
        const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${userId}-${sanitizedOriginalName}`;
        cb(null, filename);
    }
});

// File filter to allow only CSV and Excel files
const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    const allowedExtensions = ['.csv', '.xls', '.xlsx'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new ApplicationError('Only CSV and Excel files are allowed', 400), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 1
    },
    fileFilter: fileFilter
});

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return next(new ApplicationError('File size too large. Maximum size is 10MB', 400));
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return next(new ApplicationError('Too many files. Only one file allowed', 400));
        }
        return next(new ApplicationError('File upload error: ' + error.message, 400));
    }
    next(error);
};

export default {
    single: (fieldName) => [upload.single(fieldName), handleUploadError]
};
