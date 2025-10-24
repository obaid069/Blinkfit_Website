import express from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { generateToken, authenticate, adminOnly } from '../middleware/auth.js';

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

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;
};

router.post('/register/doctor', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('specialization').trim().isLength({ min: 2, max: 200 }).withMessage('Specialization is required'),
  body('licenseNumber').trim().isLength({ min: 2, max: 100 }).withMessage('License number is required'),
  body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('hospital').optional().trim().isLength({ max: 200 }).withMessage('Hospital name too long'),
], handleValidationErrors, async (req, res) => {
  try {
    const { name, email, password, specialization, licenseNumber, experience, hospital } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const doctor = new User({
      name,
      email,
      password,
      role: 'doctor',
      profile: {
        specialization,
        licenseNumber,
        experience: experience || 0,
        hospital: hospital || '',
      },
      emailVerified: false,
    });

    await doctor.save();

    const doctorResponse = doctor.toObject();
    delete doctorResponse.password;

    res.status(201).json({
      success: true,
      message: 'Doctor registration successful. Awaiting admin verification.',
      data: {
        user: doctorResponse,
      },
    });
  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering doctor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

router.post('/admin/login', [
  body('email').trim().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
], handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'admin' }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin account is deactivated',
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials',
      });
    }

    const token = generateToken(user._id);

    await user.updateLastLogin();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        admin: userResponse,
        token,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during admin login',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

router.post('/login', [
  body('email').trim().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
], handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'doctor' }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.emailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Your account is pending verification',
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    await user.updateLastLogin();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

router.get('/profile', authenticate, async (req, res) => {
  try {
    const userResponse = req.user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      data: {
        user: userResponse,
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
    });
  }
});

router.put('/profile', authenticate, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('profile.bio').optional().trim().isLength({ max: 500 }).withMessage('Bio too long'),
  body('profile.location').optional().trim().isLength({ max: 100 }).withMessage('Location too long'),
  body('profile.website').optional().trim().matches(/^https?:\/\/.+/).withMessage('Invalid website URL'),
  body('profile.specialization').optional().trim().isLength({ max: 200 }).withMessage('Specialization too long'),
  body('profile.hospital').optional().trim().isLength({ max: 200 }).withMessage('Hospital name too long'),
  body('profile.experience').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number'),
], handleValidationErrors, async (req, res) => {
  try {
    const updates = req.body;
    const user = req.user;

    if (updates.name) user.name = updates.name;
    
    if (updates.profile) {
      Object.keys(updates.profile).forEach(key => {
        if (updates.profile[key] !== undefined) {
          user.profile[key] = updates.profile[key];
        }
      });
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: userResponse,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

router.get('/admin/doctors', authenticate, adminOnly, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = 'all'
    } = req.query;

    let query = { role: 'doctor' };

    if (status === 'pending') {
      query.emailVerified = false;
    } else if (status === 'verified') {
      query.emailVerified = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'profile.specialization': { $regex: search, $options: 'i' } },
        { 'profile.hospital': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const doctors = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalDoctors = await User.countDocuments(query);
    const totalPages = Math.ceil(totalDoctors / limit);

    res.json({
      success: true,
      data: {
        doctors,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalDoctors,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

router.put('/admin/doctors/:id/verify', authenticate, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID format',
      });
    }

    const doctor = await User.findOne({ _id: id, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    doctor.emailVerified = true;
    doctor.profile.isVerifiedDoctor = true;
    
    if (reason) {
      doctor.profile.verificationReason = reason;
    }
    
    doctor.profile.verificationDate = new Date();
    doctor.profile.verifiedBy = req.user._id;

    await doctor.save();

    res.json({
      success: true,
      message: 'Doctor verified successfully',
      data: {
        doctor: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          emailVerified: doctor.emailVerified,
          isVerifiedDoctor: doctor.profile.isVerifiedDoctor,
          verificationDate: doctor.profile.verificationDate,
          verificationReason: doctor.profile.verificationReason,
        },
      },
    });
  } catch (error) {
    console.error('Doctor verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying doctor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

router.put('/admin/doctors/:id/unverify', authenticate, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID format',
      });
    }

    const doctor = await User.findOne({ _id: id, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    doctor.emailVerified = false;
    doctor.profile.isVerifiedDoctor = false;
    
    if (reason) {
      doctor.profile.verificationReason = reason;
    }
    
    doctor.profile.verificationDate = new Date();
    doctor.profile.verifiedBy = req.user._id;

    await doctor.save();

    res.json({
      success: true,
      message: 'Doctor unverified successfully',
      data: {
        doctor: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          emailVerified: doctor.emailVerified,
          isVerifiedDoctor: doctor.profile.isVerifiedDoctor,
          verificationDate: doctor.profile.verificationDate,
          verificationReason: doctor.profile.verificationReason,
        },
      },
    });
  } catch (error) {
    console.error('Doctor unverification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unverifying doctor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

router.delete('/admin/doctors/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID format',
      });
    }

    const doctor = await User.findOne({ _id: id, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Doctor deleted successfully',
      data: {
        deletedDoctor: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
        },
      },
    });
  } catch (error) {
    console.error('Doctor deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting doctor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

export default router;
