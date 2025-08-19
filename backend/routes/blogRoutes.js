import express from 'express';
import { body, query, param, validationResult } from 'express-validator';
import Blog from '../models/Blog.js';

const router = express.Router();

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
