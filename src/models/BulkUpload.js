import mongoose from "mongoose";

const bulkUploadSchema = new mongoose.Schema({
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required']
  },
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  originalFileName: {
    type: String,
    required: [true, 'Original file name is required'],
    trim: true
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required'],
    enum: {
      values: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      message: 'File must be CSV or Excel format'
    }
  },
  filePath: {
    type: String,
    required: [true, 'File path is required']
  },
  status: {
    type: String,
    enum: {
      values: ['processing', 'completed', 'failed', 'partial'],
      message: 'Status must be processing, completed, or failed'
    },
    default: 'processing'
  },
  totalRecords: {
    type: Number,
    default: 0
  },
  successfulRecords: {
    type: Number,
    default: 0
  },
  errorRecords: {
    type: Number,
    default: 0
  },
  errors: [{
    row: {
      type: Number,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Indexes for performance
bulkUploadSchema.index({ uploadedBy: 1, createdAt: -1 });
bulkUploadSchema.index({ status: 1 });

export default mongoose.model('BulkUpload', bulkUploadSchema);
