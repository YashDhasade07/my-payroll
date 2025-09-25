import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  token: {
    type: String,
    required: [true, 'Token is required'],
    unique: true
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiration date is required'],
    default: function() {
      return new Date(Date.now() + 10 * 60 * 1000);
    }
  },
  isUsed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});


passwordResetSchema.index({ userId: 1 });
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

passwordResetSchema.index({ token: 1, expiresAt: 1, isUsed: 1 });

passwordResetSchema.statics.findValidToken = function(token) {
  return this.findOne({
    token,
    expiresAt: { $gt: new Date() },
    isUsed: false
  });
};

passwordResetSchema.statics.invalidateUserTokens = function(userId) {
  return this.updateMany(
    { userId },
    { isUsed: true }
  );
};

passwordResetSchema.pre('save', function(next) {
  if (this.isNew && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  }
  next();
});

export default mongoose.model('PasswordReset', passwordResetSchema);
