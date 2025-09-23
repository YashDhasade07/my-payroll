import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, 'Token is required'],
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    expiresAt: {
        type: Date,
        required: [true, 'Expiration date is required']
    }
}, {
    timestamps: true
});

// Index for performance and auto-cleanup
tokenSchema.index({ userId: 1 });
// tokenSchema.index({ token: 1 });
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Token', tokenSchema);
