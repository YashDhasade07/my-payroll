import mongoose from 'mongoose';

const blockedUserSchema = new mongoose.Schema({
  blocker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Blocker user is required']
  },
  blocked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Blocked user is required']
  },
  reason: {
    type: String,
    trim: true,
    maxlength: [500, 'Reason cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

blockedUserSchema.index({ blocker: 1, blocked: 1 }, { unique: true });

blockedUserSchema.index({ blocker: 1 });
blockedUserSchema.index({ blocked: 1 });

blockedUserSchema.pre('save', function(next) {
  if (this.blocker.equals(this.blocked)) {
    return next(new Error('Users cannot block themselves'));
  }
  next();
});

export default mongoose.model('BlockedUser', blockedUserSchema);
