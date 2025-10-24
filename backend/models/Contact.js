import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ],
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
  },
  type: {
    type: String,
    enum: ['general', 'support', 'partnership', 'feedback', 'bug-report'],
    default: 'general',
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  ipAddress: {
    type: String,
    required: false,
  },
  userAgent: {
    type: String,
    required: false,
  },
  replied: {
    type: Boolean,
    default: false,
  },
  repliedAt: {
    type: Date,
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
  },
}, {
  timestamps: true,
});

contactSchema.index({ email: 1 });
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ type: 1, status: 1 });

contactSchema.virtual('displayName').get(function() {
  return this.name || 'Anonymous User';
});

contactSchema.pre('save', function(next) {
  try {
    if (this.name) {
      this.name = this.name.trim();
    }
    
    if (this.email) {
      this.email = this.email.trim().toLowerCase();
    }
    
    if (this.subject) {
      this.subject = this.subject.trim();
    }
    
    if (this.message) {
      this.message = this.message.trim();
    }

    if (this.notes) {
      this.notes = this.notes.trim();
    }

    if (!this.name || this.name.length === 0) {
      return next(new Error('Name is required'));
    }

    if (!this.email || this.email.length === 0) {
      return next(new Error('Email is required'));
    }

    if (!this.subject || this.subject.length === 0) {
      return next(new Error('Subject is required'));
    }

    if (!this.message || this.message.length === 0) {
      return next(new Error('Message is required'));
    }

    next();
  } catch (error) {
    console.error('❌ Error in contact pre-save hook:', error.message);
    next(error);
  }
});

contactSchema.methods.markAsReplied = async function() {
  try {
    this.replied = true;
    this.repliedAt = new Date();
    this.status = 'replied';
    return await this.save({ validateBeforeSave: false });
  } catch (error) {
    console.error('❌ Error marking contact as replied:', error.message);
    throw error;
  }
};

export default mongoose.model('Contact', contactSchema);
