import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false 
  },
  role: {
    type: String,
    enum: {
      values: ['Manager', 'Developer'],
      message: 'Role must be either Manager or Developer'
    },
    required: [true, 'Role is required']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  department: {
    type: String,
    trim: true,
    maxlength: [100, 'Department cannot exceed 100 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.index({ role: 1 });
userSchema.index({ department: 1 });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.findByEmailWithPassword = function(email) {
  return this.findOne({ email }).select('+password');
};

export default mongoose.model('User', userSchema);
