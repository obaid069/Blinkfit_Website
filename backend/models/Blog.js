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
    unique: true,
    lowercase: true,
    default: function() {
      return this.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    }
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
    default: 'https://media.istockphoto.com/id/489756064/photo/green-blue-and-purple-iris.jpg?s=2048x2048&w=is&k=20&c=kQWa_NVOjcwvBptnL562PkEJIRZeJ9C3xH_K5O9XAi8=',
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
  try {
    if (!this.title || this.title.trim().length === 0) {
      return next(new Error('Title is required'));
    }

    if (!this.excerpt || this.excerpt.trim().length === 0) {
      return next(new Error('Excerpt is required'));
    }

    if (!this.content || this.content.trim().length === 0) {
      return next(new Error('Content is required'));
    }

    if (!this.slug || this.isModified('title')) {
      this.slug = this.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .replace(/^-+|-+$/g, '');
      
      if (!this.slug || this.slug.length === 0) {
        return next(new Error('Failed to generate valid slug from title'));
      }
    }

    if (this.tags && Array.isArray(this.tags)) {
      this.tags = this.tags
        .filter(tag => tag && typeof tag === 'string' && tag.trim().length > 0)
        .map(tag => tag.trim().substring(0, 50));
    }

    if (!this.metaTitle) {
      this.metaTitle = this.title.length > 60 ? this.title.substring(0, 57) + '...' : this.title;
    }
    
    if (!this.metaDescription) {
      this.metaDescription = this.excerpt && this.excerpt.length > 160 
        ? this.excerpt.substring(0, 157) + '...' 
        : this.excerpt;
    }

    if (this.views < 0) this.views = 0;
    if (this.likes < 0) this.likes = 0;

    next();
  } catch (error) {
    console.error('❌ Error in blog pre-save hook:', error.message);
    next(error);
  }
});

blogSchema.methods.incrementViews = async function() {
  try {
    this.views = (this.views || 0) + 1;
    return await this.save({ validateBeforeSave: false });
  } catch (error) {
    console.error('❌ Error incrementing blog views:', error.message);
    return this;
  }
};

export default mongoose.model('Blog', blogSchema);
