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

// Indexes for efficient querying
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ type: 1, status: 1 });

// Virtual for display name
contactSchema.virtual('displayName').get(function() {
  return this.name || 'Anonymous User';
});

// Method to mark as replied
contactSchema.methods.markAsReplied = function() {
  this.replied = true;
  this.repliedAt = new Date();
  this.status = 'replied';
  return this.save();
};

export default mongoose.model('Contact', contactSchema);
