import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ],
  },
  password: {
    type: String,
    required: function() {
      return !this.isNewsletterOnly;
    },
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator', 'doctor'],
    default: 'user',
  },
  isNewsletterSubscribed: {
    type: Boolean,
    default: false,
  },
  isNewsletterOnly: {
    type: Boolean,
    default: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      newsletter: {
        type: Boolean,
        default: true,
      },
      updates: {
        type: Boolean,
        default: true,
      },
    },
    interests: [{
      type: String,
      enum: ['eye-health', 'technology', 'lifestyle', 'app-updates', 'tips'],
    }],
  },
  profile: {
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    location: {
      type: String,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    website: {
      type: String,
      match: [
        /^https?:\/\/.+/,
        'Please provide a valid website URL'
      ],
    },
    specialization: {
      type: String,
      maxlength: [200, 'Specialization cannot exceed 200 characters'],
    },
    licenseNumber: {
      type: String,
      maxlength: [100, 'License number cannot exceed 100 characters'],
    },
    experience: {
      type: Number,
      min: [0, 'Experience cannot be negative'],
    },
    hospital: {
      type: String,
      maxlength: [200, 'Hospital name cannot exceed 200 characters'],
    },
    isVerifiedDoctor: {
      type: Boolean,
      default: false,
    },
  },
  lastLoginAt: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ isNewsletterSubscribed: 1 });
userSchema.index({ createdAt: -1 });

userSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) return next();
    
    if (!this.password) {
      return next(new Error('Password is required for hashing'));
    }
    
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    console.error('❌ Error hashing password:', error.message);
    next(new Error('Failed to hash password'));
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    if (!this.password) {
      console.warn('⚠️  Warning: No password hash found for user');
      return false;
    }
    
    if (!candidatePassword) {
      console.warn('⚠️  Warning: No candidate password provided for comparison');
      return false;
    }
    
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('❌ Error comparing passwords:', error.message);
    return false;
  }
};

userSchema.methods.createPasswordResetToken = function() {
  try {
    const resetToken = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
    
    if (!resetToken || resetToken.length < 10) {
      throw new Error('Failed to generate secure reset token');
    }
    
    this.passwordResetToken = bcrypt.hashSync(resetToken, 10);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    
    return resetToken;
  } catch (error) {
    console.error('❌ Error creating password reset token:', error.message);
    throw new Error('Failed to create password reset token');
  }
};

userSchema.methods.updateLastLogin = async function() {
  try {
    this.lastLoginAt = new Date();
    return await this.save({ validateBeforeSave: false });
  } catch (error) {
    console.error('❌ Error updating last login time:', error.message);
    return this;
  }
};

userSchema.statics.createNewsletterUser = async function(email, name) {
  try {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Valid email is required for newsletter subscription');
    }
    
    return await this.create({
      email,
      name: name || 'Newsletter Subscriber',
      isNewsletterOnly: true,
      isNewsletterSubscribed: true,
      emailVerified: false,
    });
  } catch (error) {
    console.error('❌ Error creating newsletter user:', error.message);
    throw error;
  }
};

export default mongoose.model('User', userSchema);
