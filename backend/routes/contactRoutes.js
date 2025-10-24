import express from 'express';
import { body, validationResult, query } from 'express-validator';
import rateLimit from 'express-rate-limit';
import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3, 
  message: {
    success: false,
    message: 'Too many contact form submissions. Please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const createEmailTransporter = () => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️  Warning: Email configuration missing. Contact emails will not be sent.');
      console.warn('Required: EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT');
      return null;
    }

    if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT) {
      console.warn('⚠️  Warning: EMAIL_HOST or EMAIL_PORT not configured. Using defaults.');
    }

    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false // For development only
      }
    });

    // Verify transporter configuration
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email transporter verification failed:', error.message);
      } else {
        console.log('✅ Email transporter configured successfully');
      }
    });

    return transporter;
  } catch (error) {
    console.error('❌ Error creating email transporter:', error.message);
    return null;
  }
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

const contactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),

  body('type')
    .optional()
    .isIn(['general', 'support', 'partnership', 'feedback', 'bug-report'])
    .withMessage('Invalid contact type'),
];

router.post('/', contactLimiter, contactValidation, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, subject, message, type = 'general' } = req.body;

    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      type,
      ipAddress,
      userAgent,
    });

    const transporter = createEmailTransporter();
    if (transporter) {
      try {
        // Sanitize user input for HTML injection
        const sanitizedName = name.replace(/[<>]/g, '');
        const sanitizedSubject = subject.replace(/[<>]/g, '');
        const sanitizedMessage = message.replace(/[<>]/g, '');

        const adminMailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `New Contact Form Submission: ${sanitizedSubject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${sanitizedName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${sanitizedSubject}</p>
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
              ${sanitizedMessage.replace(/\n/g, '<br>')}
            </div>
            <hr>
            <p><small>IP: ${ipAddress}</small></p>
            <p><small>Time: ${new Date().toISOString()}</small></p>
          `,
        };

        const userMailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Thank you for contacting BlinkFit',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Thank you for contacting BlinkFit!</h2>
              <p>Hi ${sanitizedName},</p>
              <p>We've received your message and will get back to you as soon as possible.</p>

              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Your Message Details:</h3>
                <p><strong>Subject:</strong> ${sanitizedSubject}</p>
                <p><strong>Type:</strong> ${type}</p>
              </div>

              <p>For urgent matters, you can also reach us through:</p>
              <ul>
                <li>Support Email: support@blinkfit.com</li>
                <li>General Inquiries: info@blinkfit.com</li>
              </ul>

              <p>Best regards,<br>The BlinkFit Team</p>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="font-size: 12px; color: #6b7280;">
                This is an automated response. Please do not reply to this email.
              </p>
            </div>
          `,
        };

        await Promise.all([
          transporter.sendMail(adminMailOptions).catch(err => {
            console.error('❌ Failed to send admin notification email:', err.message);
            throw err;
          }),
          transporter.sendMail(userMailOptions).catch(err => {
            console.error('❌ Failed to send user confirmation email:', err.message);
            throw err;
          }),
        ]);

        console.log(`✅ Contact form notification emails sent for: ${email}`);
      } catch (emailError) {
        console.error('❌ Error sending contact notification emails:', emailError.message);
        // Don't fail the request if email fails - contact is already saved
      }
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
      data: {
        id: contact._id,
        submittedAt: contact.createdAt,
      },
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate submission detected. Please try again later.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error submitting contact form. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Admin: Get contact statistics
router.get('/admin/stats', authenticate, adminOnly, async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          unread: {
            $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const totalContacts = await Contact.countDocuments();
    const totalUnread = await Contact.countDocuments({ status: 'new' });
    
    // Recent contacts
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email subject type status createdAt')
      .lean();

    res.json({
      success: true,
      data: {
        total: totalContacts,
        unread: totalUnread,
        byType: stats,
        recentContacts,
      },
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

// Admin: Get all contacts with pagination
router.get('/admin/contacts', authenticate, adminOnly, [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('type').optional().isIn(['general', 'support', 'partnership', 'feedback', 'bug-report']),
  query('status').optional().isIn(['new', 'read', 'responded']),
  query('search').optional().isString().trim(),
], async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      search
    } = req.query;

    const query = {};

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalContacts = await Contact.countDocuments(query);
    const totalPages = Math.ceil(totalContacts / limit);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalContacts,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

// Admin: Update contact status
router.patch('/admin/contacts/:id/status', authenticate, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate MongoDB ObjectId
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID format',
      });
    }

    if (!['new', 'read', 'responded'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: new, read, or responded',
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact,
    });
  } catch (error) {
    console.error('Error updating contact status:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating contact status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

export default router;
