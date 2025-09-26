import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import blogRoutes from './routes/blogRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Increased limit for development
  message: 'Too many requests from this IP, please try again later.',
  skip: (req) => {
    // Skip rate limiting for OPTIONS requests (CORS preflight)
    return req.method === 'OPTIONS';
  },
});
app.use(limiter);

// CORS debugging middleware (reduced logging)
app.use((req, res, next) => {
  // Only log errors and important requests in development
  if (process.env.NODE_ENV === 'development' && req.method !== 'OPTIONS') {
    const shouldLog = req.url.includes('/api/auth/') || 
                     req.url.includes('/api/admin/') || 
                     req.statusCode >= 400;
    if (shouldLog) {
      console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin || 'none'}`);
    }
  }
  next();
});

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://blinkfit-website.vercel.app',
  'https://blinkfit-official.vercel.app', // Added frontend domain
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    console.log('CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept', 
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Handle favicon.ico requests
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// MongoDB connection with serverless optimization
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Initialize DB connection
connectDB().catch(console.error);

// Middleware to ensure DB connection before each API request
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BlinkFit API is running successfully',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to BlinkFit API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      blogs: '/api/blogs',
      contact: '/api/contact',
      users: '/api/users',
      auth: '/api/auth',
    },
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Only start server in local development (not in Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 BlinkFit Server is running on port ${PORT}`);
    console.log(`🌟 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}`);
  });
}

export default app;
