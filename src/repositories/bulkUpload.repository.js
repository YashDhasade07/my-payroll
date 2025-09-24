import BulkUpload from '../models/BulkUpload.js';
import ApplicationError from '../middleware/applicationError.js';

export default class BulkUploadRepository {
    
    async create(uploadData) {
        try {
            const upload = new BulkUpload(uploadData);
            return await upload.save();
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new ApplicationError(error.message, 400);
            }
            throw new ApplicationError('Error creating upload record', 500);
        }
    }

    async findById(uploadId) {
        try {
            return await BulkUpload.findById(uploadId)
                .populate('uploadedBy', 'firstName lastName email role')
                .lean();
        } catch (error) {
            throw new ApplicationError('Error finding upload', 500);
        }
    }

    async updateById(uploadId, updateData) {
        try {
            const updatedUpload = await BulkUpload.findByIdAndUpdate(
                uploadId,
                { $set: updateData },
                { new: true, runValidators: true }
            )
            .populate('uploadedBy', 'firstName lastName email role')
            .lean();

            if (!updatedUpload) {
                throw new ApplicationError('Upload not found', 404);
            }

            return updatedUpload;
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new ApplicationError(error.message, 400);
            }
            if (error instanceof ApplicationError) {
                throw error;
            }
            throw new ApplicationError('Error updating upload', 500);
        }
    }

    async deleteById(uploadId) {
        try {
            const deletedUpload = await BulkUpload.findByIdAndDelete(uploadId);
            if (!deletedUpload) {
                throw new ApplicationError('Upload not found', 404);
            }
            return deletedUpload;
        } catch (error) {
            if (error instanceof ApplicationError) {
                throw error;
            }
            throw new ApplicationError('Error deleting upload', 500);
        }
    }

    async getAllWithPagination(page, limit, filters = {}) {
        try {
            const skip = (page - 1) * limit;
            
            const uploads = await BulkUpload.find(filters)
                .populate('uploadedBy', 'firstName lastName email role')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const totalUploads = await BulkUpload.countDocuments(filters);
            const totalPages = Math.ceil(totalUploads / limit);

            return {
                uploads,
                totalUploads,
                totalPages,
                currentPage: page
            };
        } catch (error) {
            throw new ApplicationError('Error retrieving uploads', 500);
        }
    }

    async getUploadStats() {
        try {
            const stats = await BulkUpload.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        totalRecords: { $sum: '$totalRecords' },
                        successfulRecords: { $sum: '$successfulRecords' },
                        errorRecords: { $sum: '$errorRecords' }
                    }
                }
            ]);

            return stats;
        } catch (error) {
            throw new ApplicationError('Error getting upload statistics', 500);
        }
    }
}
