import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  excerpt: {
    type: String,
    required: [true, 'Blog excerpt is required'],
    maxlength: [300, 'Excerpt cannot exceed 300 characters'],
  },
  content: {
    type: String,
    required: [true, 'Blog content is required'],
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    default: 'BlinkFit Team',
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      // Only required for admin/doctor created blogs
      return this.author !== 'BlinkFit Team';
    },
  },
  category: {
    type: String,
    required: [true, 'Blog category is required'],
    enum: ['Eye Health', 'Technology', 'Lifestyle', 'Tips & Tricks', 'App Features'],
    default: 'Eye Health',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  featuredImage: {
    type: String,
    default: '/api/placeholder/600/400',
  },
  readTime: {
    type: Number,
    default: 5,
  },
  published: {
    type: Boolean,
    default: true,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot exceed 60 characters'],
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters'],
  },
}, {
  timestamps: true,
});

blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });
blogSchema.index({ category: 1, published: 1 });
blogSchema.index({ publishedAt: -1 });

blogSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`;
});

blogSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  if (!this.metaTitle) {
    this.metaTitle = this.title.length > 60 ? this.title.substring(0, 57) + '...' : this.title;
  }
  if (!this.metaDescription) {
    this.metaDescription = this.excerpt.length > 160 ? this.excerpt.substring(0, 157) + '...' : this.excerpt;
  }
  next();
});

blogSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

export default mongoose.model('Blog', blogSchema);
