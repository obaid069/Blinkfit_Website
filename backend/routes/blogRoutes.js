import express from 'express';
import { body, query, param, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Blog from '../models/Blog.js';
import { authenticate, adminOnly, doctorOnly, adminOrDoctor, checkBlogOwnership } from '../middleware/auth.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Configure multer for file uploads (memory storage for Cloudinary)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, originalname) => {
  return new Promise((resolve, reject) => {
    try {
      // Validate input
      if (!buffer || buffer.length === 0) {
        return reject(new Error('Invalid buffer: Buffer is empty or undefined'));
      }

      if (!originalname) {
        return reject(new Error('Original filename is required'));
      }

      // Check if cloudinary is configured
      if (!cloudinary.config().cloud_name) {
        return reject(new Error('Cloudinary is not properly configured'));
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'blog-images',
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 630, crop: 'fill', quality: 'auto' },
            { format: 'webp' }
          ],
          public_id: `blog-${Date.now()}-${originalname.split('.')[0]}`,
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error.message);
            return reject(new Error(`Cloudinary upload failed: ${error.message}`));
          }
          
          if (!result || !result.secure_url) {
            return reject(new Error('Cloudinary upload succeeded but no URL returned'));
          }
          
          console.log('✅ Image uploaded successfully to Cloudinary');
          resolve(result.secure_url);
        }
      );

      uploadStream.on('error', (streamError) => {
        console.error('❌ Upload stream error:', streamError.message);
        reject(new Error(`Upload stream error: ${streamError.message}`));
      });

      uploadStream.end(buffer);
    } catch (error) {
      console.error('❌ Error in uploadToCloudinary:', error.message);
      reject(new Error(`Failed to initiate upload: ${error.message}`));
    }
  });
};

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array(),
    });
  }
  next();
};
router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('category').optional().isIn(['Eye Health', 'Technology', 'Lifestyle', 'Tips & Tricks', 'App Features']),
  query('search').optional().isString().trim(),
  query('sort').optional().isIn(['latest', 'popular', 'oldest']),
], handleValidationErrors, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      sort = 'latest'
    } = req.query;

    const query = { published: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    let sortOptions = {};
    switch (sort) {
      case 'popular':
        sortOptions = { views: -1, publishedAt: -1 };
        break;
      case 'oldest':
        sortOptions = { publishedAt: 1 };
        break;
      case 'latest':
      default:
        sortOptions = { publishedAt: -1 };
    }

    const skip = (page - 1) * limit;
    const blogs = await Blog.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select('-content') 
      .lean();

    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          currentPage: page,
          totalPages,
          totalBlogs,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message,
    });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const featuredBlogs = await Blog.find({ published: true })
      .sort({ views: -1, likes: -1 })
      .limit(5)
      .select('-content')
      .lean();

    res.json({
      success: true,
      data: featuredBlogs,
    });
  } catch (error) {
    console.error('Error fetching featured blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured blogs',
      error: error.message,
    });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Blog.aggregate([
      { $match: { published: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: categories.map(cat => ({
        name: cat._id,
        count: cat.count
      })),
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
});

// ============= ADMIN & DOCTOR BLOG MANAGEMENT ROUTES =============

// Admin Analytics
router.get('/admin/analytics', authenticate, adminOnly, async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ published: true });
    const draftBlogs = await Blog.countDocuments({ published: false });
    
    const topBlogs = await Blog.find({ published: true })
      .sort({ views: -1 })
      .limit(5)
      .select('title views likes publishedAt author category')
      .lean();

    const categoryStats = await Blog.aggregate([
      { $match: { published: true } },
      { $group: { _id: '$category', count: { $sum: 1 }, totalViews: { $sum: '$views' } } },
      { $sort: { count: -1 } }
    ]);

    const authorStats = await Blog.aggregate([
      { $match: { published: true, authorId: { $exists: true } } },
      { $group: { _id: '$authorId', count: { $sum: 1 }, totalViews: { $sum: '$views' } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'author' } },
      { $unwind: '$author' },
      { $project: { name: '$author.name', role: '$author.role', blogCount: '$count', totalViews: '$totalViews' } },
      { $sort: { blogCount: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          total: totalBlogs,
          published: publishedBlogs,
          drafts: draftBlogs,
        },
        topBlogs,
        categoryStats: categoryStats.map(stat => ({
          category: stat._id,
          count: stat.count,
          totalViews: stat.totalViews,
        })),
        authorStats,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

// Admin: Create new blog (with file upload support)
router.post('/admin/manage', authenticate, adminOnly, upload.single('featuredImage'), [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('excerpt').trim().isLength({ min: 10, max: 300 }).withMessage('Excerpt must be between 10 and 300 characters'),
  body('content').trim().isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
  body('category').isIn(['Eye Health', 'Technology', 'Lifestyle', 'Tips & Tricks', 'App Features']).withMessage('Invalid category'),
  body('tags').optional().custom((value) => {
    if (Array.isArray(value)) return true;
    if (typeof value === 'string') return true;
    return false;
  }).withMessage('Tags must be an array or string'),
  body('readTime').optional().isInt({ min: 1, max: 60 }).toInt().withMessage('Read time must be between 1 and 60 minutes'),
  body('published').optional().isBoolean().toBoolean().withMessage('Published must be a boolean'),
  body('metaTitle').optional().trim().isLength({ max: 60 }).withMessage('Meta title cannot exceed 60 characters'),
  body('metaDescription').optional().trim().isLength({ max: 160 }).withMessage('Meta description cannot exceed 160 characters'),
], handleValidationErrors, async (req, res) => {
  try {
    const { title, excerpt, content, category, readTime, published, metaTitle, metaDescription } = req.body;
    let { tags } = req.body;

    // Normalize types in case of multipart/form-data strings
    const normalizedPublished = (published === true || published === 'true' || published === 1 || published === '1');
    const normalizedReadTime = Number.isInteger(readTime) ? readTime : (parseInt(readTime, 10) || undefined);
    const user = req.user;

    // Handle tags - convert string to array if needed
    if (typeof tags === 'string') {
      tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    } else if (!Array.isArray(tags)) {
      tags = [];
    }

    // Handle featured image
    let featuredImage = null;
    if (req.file) {
      // File uploaded - upload to Cloudinary
      try {
        featuredImage = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        console.log('Image uploaded to Cloudinary:', featuredImage);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Error uploading image to Cloudinary',
          error: uploadError.message
        });
      }
    } else if (req.body.featuredImage) {
      // URL provided
      featuredImage = req.body.featuredImage;
    }

    // Create new blog with author information
    const blog = new Blog({
      title,
      excerpt,
      content,
      author: user.name,
      authorId: user._id,
      category,
      tags,
      featuredImage: featuredImage || '/api/placeholder/600/400',
      readTime: normalizedReadTime || Math.ceil(content.split(' ').length / 200),
      published: published !== undefined ? normalizedPublished : true,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: 'Blog created successfully by admin',
      data: blog,
    });
  } catch (error) {
    console.error('Error creating blog by admin:', error);
    if (error.code === 11000 && (error.keyPattern?.slug || error.keyValue?.slug)) {
      return res.status(409).json({
        success: false,
        message: 'A blog with this title already exists. Please use a different title.',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating blog',
      error: error.message,
    });
  }
});

// Create new blog (Admin or Doctor)
router.post('/manage', authenticate, adminOrDoctor, upload.single('featuredImage'), [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('excerpt').trim().isLength({ min: 10, max: 300 }).withMessage('Excerpt must be between 10 and 300 characters'),
  body('content').trim().isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
  body('category').isIn(['Eye Health', 'Technology', 'Lifestyle', 'Tips & Tricks', 'App Features']).withMessage('Invalid category'),
  body('tags').optional().custom((value) => {
    if (Array.isArray(value)) return true;
    if (typeof value === 'string') return true;
    return false;
  }).withMessage('Tags must be an array or string'),
  body('featuredImage').optional().isString().withMessage('Featured image must be a string'),
  body('readTime').optional().isInt({ min: 1, max: 60 }).toInt().withMessage('Read time must be between 1 and 60 minutes'),
  body('published').optional().isBoolean().toBoolean().withMessage('Published must be a boolean'),
  body('metaTitle').optional().trim().isLength({ max: 60 }).withMessage('Meta title cannot exceed 60 characters'),
  body('metaDescription').optional().trim().isLength({ max: 160 }).withMessage('Meta description cannot exceed 160 characters'),
], handleValidationErrors, async (req, res) => {
  try {
    const { title, excerpt, content, category, readTime, published, metaTitle, metaDescription } = req.body;
    let { tags } = req.body;
    const user = req.user;

    // Normalize types in case of multipart/form-data strings
    const normalizedPublished = (published === true || published === 'true' || published === 1 || published === '1');
    const normalizedReadTime = Number.isInteger(readTime) ? readTime : (parseInt(readTime, 10) || undefined);

    // Handle tags - convert string to array if needed
    if (typeof tags === 'string') {
      tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    } else if (!Array.isArray(tags)) {
      tags = [];
    }

    // Handle featured image
    let featuredImage = null;
    if (req.file) {
      // File uploaded - upload to Cloudinary
      try {
        featuredImage = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        console.log('Image uploaded to Cloudinary:', featuredImage);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Error uploading image to Cloudinary',
          error: uploadError.message
        });
      }
    } else if (req.body.featuredImage) {
      // URL provided
      featuredImage = req.body.featuredImage;
    }

    // Create new blog with author information
    const blog = new Blog({
      title,
      excerpt,
      content,
      author: user.name,
      authorId: user._id,
      category,
      tags,
      featuredImage: featuredImage || '/api/placeholder/600/400',
      readTime: normalizedReadTime || Math.ceil(content.split(' ').length / 200), // Estimate based on word count
      published: published !== undefined ? normalizedPublished : true,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog,
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    if (error.code === 11000 && (error.keyPattern?.slug || error.keyValue?.slug)) {
      return res.status(409).json({
        success: false,
        message: 'A blog with this title already exists. Please use a different title.',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating blog',
      error: error.message,
    });
  }
});

// Admin: Get all blogs for management
router.get('/admin/manage', authenticate, adminOnly, [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('category').optional().isIn(['Eye Health', 'Technology', 'Lifestyle', 'Tips & Tricks', 'App Features']),
  query('search').optional().isString().trim(),
  query('published').optional().isBoolean(),
  query('author').optional().isString().trim(),
], handleValidationErrors, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      published,
      author
    } = req.query;

    const query = {};

    // Apply filters
    if (category) {
      query.category = category;
    }

    if (published !== undefined) {
      query.published = published;
    }

    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const blogs = await Blog.find(query)
      .populate('authorId', 'name email role profile.specialization')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          currentPage: page,
          totalPages,
          totalBlogs,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
    
  } catch (error) {
    console.error('Error fetching blogs for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

// Admin: Get single blog for editing (any blog)
router.get('/admin/manage/:id', authenticate, adminOnly, [
  param('id').isMongoId().withMessage('Invalid blog ID'),
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id)
      .populate('authorId', 'name email role profile.specialization');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error('Error fetching blog for admin editing:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

// Admin: Update any blog
router.put('/admin/manage/:id', authenticate, adminOnly, [
  param('id').isMongoId().withMessage('Invalid blog ID'),
  body('title').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('excerpt').optional().trim().isLength({ min: 10, max: 300 }).withMessage('Excerpt must be between 10 and 300 characters'),
  body('content').optional().trim().isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
  body('category').optional().isIn(['Eye Health', 'Technology', 'Lifestyle', 'Tips & Tricks', 'App Features']).withMessage('Invalid category'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('featuredImage').optional().isString().withMessage('Featured image must be a string'),
  body('readTime').optional().isInt({ min: 1, max: 60 }).toInt().withMessage('Read time must be between 1 and 60 minutes'),
  body('published').optional().isBoolean().toBoolean().withMessage('Published must be a boolean'),
  body('featured').optional().isBoolean().toBoolean().withMessage('Featured must be a boolean'),
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Normalize types for booleans/ints if coming as strings
    if (updates.published !== undefined) {
      updates.published = (updates.published === true || updates.published === 'true' || updates.published === 1 || updates.published === '1');
    }
    if (updates.featured !== undefined) {
      updates.featured = (updates.featured === true || updates.featured === 'true' || updates.featured === 1 || updates.featured === '1');
    }
    if (updates.readTime !== undefined && typeof updates.readTime !== 'number') {
      const rt = parseInt(updates.readTime, 10);
      updates.readTime = Number.isNaN(rt) ? undefined : rt;
    }

    // Admin can update views and likes, but not authorId
    delete updates.authorId;
    delete updates.author;

    // Update read time if content is changed
    if (updates.content) {
      updates.readTime = updates.readTime || Math.ceil(updates.content.split(' ').length / 200);
    }

    const blog = await Blog.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('authorId', 'name email role profile.specialization');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.json({
      success: true,
      message: 'Blog updated successfully by admin',
      data: blog,
    });
  } catch (error) {
    console.error('Error updating blog by admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating blog',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

// Admin: Delete any blog
router.delete('/admin/manage/:id', authenticate, adminOnly, [
  param('id').isMongoId().withMessage('Invalid blog ID'),
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    await Blog.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Blog deleted successfully by admin',
      data: {
        deletedBlog: {
          id: blog._id,
          title: blog.title,
          author: blog.author,
        },
      },
    });
  } catch (error) {
    console.error('Error deleting blog by admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

// Doctor: Get all blogs for management (Doctor sees only their own)
router.get('/manage', authenticate, doctorOnly, [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('category').optional().isIn(['Eye Health', 'Technology', 'Lifestyle', 'Tips & Tricks', 'App Features']),
  query('search').optional().isString().trim(),
  query('published').optional().isBoolean(),
], handleValidationErrors, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      published
    } = req.query;

    const query = {};

    // Doctor only sees their own blogs
    query.authorId = req.user._id;

    if (category) {
      query.category = category;
    }

    if (published !== undefined) {
      query.published = published;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;
    const blogs = await Blog.find(query)
      .populate('authorId', 'name email role profile.specialization')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          currentPage: page,
          totalPages,
          totalBlogs,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
    
  } catch (error) {
    console.error('❌ Error fetching blogs for management:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message,
    });
  }
});

// Get single blog for editing
router.get('/manage/:id', authenticate, doctorOnly, checkBlogOwnership, [
  param('id').isMongoId().withMessage('Invalid blog ID'),
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id)
      .populate('authorId', 'name email role profile.specialization');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error('Error fetching blog for editing:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog',
      error: error.message,
    });
  }
});

// Update blog
router.put('/manage/:id', authenticate, doctorOnly, checkBlogOwnership, upload.single('featuredImage'), [
  param('id').isMongoId().withMessage('Invalid blog ID'),
  body('title').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('excerpt').optional().trim().isLength({ min: 10, max: 300 }).withMessage('Excerpt must be between 10 and 300 characters'),
  body('content').optional().trim().isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
  body('category').optional().isIn(['Eye Health', 'Technology', 'Lifestyle', 'Tips & Tricks', 'App Features']).withMessage('Invalid category'),
  body('tags').optional().custom((value) => {
    if (Array.isArray(value)) return true;
    if (typeof value === 'string') return true;
    return false;
  }).withMessage('Tags must be an array or string'),
  body('featuredImage').optional().isString().withMessage('Featured image must be a string'),
  body('readTime').optional().isInt({ min: 1, max: 60 }).toInt().withMessage('Read time must be between 1 and 60 minutes'),
  body('published').optional().isBoolean().toBoolean().withMessage('Published must be a boolean'),
  body('metaTitle').optional().trim().isLength({ max: 60 }).withMessage('Meta title cannot exceed 60 characters'),
  body('metaDescription').optional().trim().isLength({ max: 160 }).withMessage('Meta description cannot exceed 160 characters'),
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, category, readTime, published, metaTitle, metaDescription } = req.body;
    let { tags } = req.body;

    // Normalize types in case of multipart/form-data strings
    const normalizedPublished = (published === true || published === 'true' || published === 1 || published === '1');
    const normalizedReadTime = Number.isInteger(readTime) ? readTime : (parseInt(readTime, 10) || undefined);
    
    // Handle tags - convert string to array if needed
    if (typeof tags === 'string') {
      tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    } else if (Array.isArray(tags)) {
      // tags is already an array, keep as is
    } else if (tags !== undefined) {
      tags = [];
    }

    // Handle featured image
    let featuredImage = null;
    if (req.file) {
      // File uploaded - upload to Cloudinary
      try {
        featuredImage = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        console.log('Image uploaded to Cloudinary:', featuredImage);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Error uploading image to Cloudinary',
          error: uploadError.message
        });
      }
    } else if (req.body.featuredImage) {
      // URL provided
      featuredImage = req.body.featuredImage;
    }

    // Build updates object
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (content !== undefined) updates.content = content;
    if (category !== undefined) updates.category = category;
    if (tags !== undefined) updates.tags = tags;
    if (featuredImage !== null) updates.featuredImage = featuredImage;
    if (normalizedReadTime !== undefined) updates.readTime = normalizedReadTime;
    if (published !== undefined) updates.published = normalizedPublished;
    if (metaTitle !== undefined) updates.metaTitle = metaTitle;
    if (metaDescription !== undefined) updates.metaDescription = metaDescription;

    // Update read time if content is changed
    if (updates.content) {
      updates.readTime = updates.readTime || Math.ceil(updates.content.split(' ').length / 200);
    }

    const blog = await Blog.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('authorId', 'name email role profile.specialization');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: blog,
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating blog',
      error: error.message,
    });
  }
});

// Delete blog
router.delete('/manage/:id', authenticate, doctorOnly, checkBlogOwnership, [
  param('id').isMongoId().withMessage('Invalid blog ID'),
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.json({
      success: true,
      message: 'Blog deleted successfully',
      data: {
        deletedBlog: {
          id: blog._id,
          title: blog.title,
        },
      },
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog',
      error: error.message,
    });
  }
});

// Doctor-only blog preview (before public route)
router.get('/preview/:id', authenticate, doctorOnly, [
  param('id').isMongoId().withMessage('Invalid blog ID'),
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find blog and check ownership
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }
    
    // Only allow doctor to view their own blogs
    if (blog.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only preview your own blogs',
      });
    }
    
    // Don't increment views for preview
    const relatedBlogs = await Blog.find({
      category: blog.category,
      published: true,
      authorId: req.user._id, // Only show related blogs from same doctor
      _id: { $ne: blog._id }
    })
    .limit(3)
    .select('-content')
    .sort({ publishedAt: -1 })
    .lean();
    
    res.json({
      success: true,
      data: {
        blog: blog.toObject(),
        relatedBlogs,
      },
    });
  } catch (error) {
    console.error('Error fetching blog preview:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog preview',
      error: error.message,
    });
  }
});

router.get('/:slug', [
  param('slug').isString().trim().notEmpty(),
], handleValidationErrors, async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug, published: true });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    await blog.incrementViews();

    const relatedBlogs = await Blog.find({
      category: blog.category,
      published: true,
      _id: { $ne: blog._id }
    })
    .limit(3)
    .select('-content')
    .sort({ publishedAt: -1 })
    .lean();

    res.json({
      success: true,
      data: {
        blog: blog.toObject(),
        relatedBlogs,
      },
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog post',
      error: error.message,
    });
  }
});

router.post('/:id/like', [
  param('id').isMongoId(),
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    ).select('likes');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    res.json({
      success: true,
      data: { likes: blog.likes },
    });
  } catch (error) {
    console.error('Error liking blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking blog post',
      error: error.message,
    });
  }
});


export default router;
