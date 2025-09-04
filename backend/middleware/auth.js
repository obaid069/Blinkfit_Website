import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'blinkfit-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Verify JWT token middleware
export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'blinkfit-secret-key');
    const user = await User.findById(decoded.userId).select('+password');

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

// Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication required.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`,
      });
    }

    next();
  };
};

// Admin only middleware
export const adminOnly = authorize('admin');

// Doctor only middleware
export const doctorOnly = authorize('doctor');

// Admin or Doctor middleware
export const adminOrDoctor = authorize('admin', 'doctor');

// Blog ownership check for doctors (admins can access any blog)
export const checkBlogOwnership = async (req, res, next) => {
  try {
    // Admins can access any blog
    if (req.user.role === 'admin') {
      return next();
    }

    // Doctors can only access their own blogs
    if (req.user.role === 'doctor') {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Blog ID is required',
        });
      }

      const Blog = (await import('../models/Blog.js')).default;
      
      const blog = await Blog.findById(id);
      
      if (!blog) {
        return res.status(404).json({
          success: false,
          message: 'Blog not found',
        });
      }

      // Check if the doctor is the author of this blog
      if (blog.authorId && blog.authorId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only manage your own blogs.',
        });
      }
    }

    next();
  } catch (error) {
    console.error('Blog ownership check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking blog ownership',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
