import express from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

const router = express.Router();

const newsletterLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 3, 
  message: {
    success: false,
    message: 'Too many subscription attempts. Please try again in 10 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const createEmailTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email configuration missing. Newsletter emails will not be sent.');
    return null;
  }

  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
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

const newsletterValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array'),

  body('interests.*')
    .optional()
    .isIn(['eye-health', 'technology', 'lifestyle', 'app-updates', 'tips'])
    .withMessage('Invalid interest category'),
];

router.post('/newsletter/subscribe', 
  newsletterLimiter, 
  newsletterValidation, 
  handleValidationErrors, 
  async (req, res) => {
    try {
      const { email, name, interests = [] } = req.body;

      let user = await User.findOne({ email });

      if (user) {
        if (user.isNewsletterSubscribed) {
          return res.status(400).json({
            success: false,
            message: 'Email is already subscribed to our newsletter.',
          });
        }

        user.isNewsletterSubscribed = true;
        if (name && !user.name) {
          user.name = name;
        }
        if (interests.length > 0) {
          user.preferences.interests = interests;
        }
        await user.save();
      } else {

        user = await User.createNewsletterUser(email, name);
        if (interests.length > 0) {
          user.preferences.interests = interests;
          await user.save();
        }
      }

      const transporter = createEmailTransporter();
      if (transporter) {
        try {
          const welcomeEmailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to BlinkFit Newsletter! ðŸ‘ï¸',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
                <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2563eb; font-size: 28px; margin: 0;">BlinkFit</h1>
                    <p style="color: #64748b; margin: 5px 0;">AI-Powered Eye Health</p>
                  </div>

                  <h2 style="color: #334155;">Welcome to BlinkFit Newsletter! ðŸŽ‰</h2>
                  <p>Hi ${name || 'there'},</p>

                  <p>Thank you for subscribing to the BlinkFit newsletter! You're now part of our community focused on protecting and improving eye health through AI technology.</p>

                  <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                    <h3 style="margin-top: 0; color: #1e40af;">What to expect:</h3>
                    <ul style="margin: 0; padding-left: 20px;">
                      <li>Weekly eye health tips and insights</li>
                      <li>Latest BlinkFit app updates and features</li>
                      <li>Expert advice from eye care professionals</li>
                      <li>Exclusive content about digital wellness</li>
                    </ul>
                  </div>

                  ${interests.length > 0 ? `
                    <p><strong>Your interests:</strong> ${interests.map(interest => interest.replace('-', ' ')).join(', ')}</p>
                  ` : ''}

                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'https:
                       style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                      Visit BlinkFit
                    </a>
                  </div>

                  <p>Best regards,<br>The BlinkFit Team</p>

                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                  <p style="font-size: 12px; color: #6b7280; text-align: center;">
                    You can unsubscribe at any time by clicking 
                    <a href="${process.env.FRONTEND_URL || 'https:
                       style="color: #2563eb;">here</a>.
                  </p>
                </div>
              </div>
            `,
          };

          await transporter.sendMail(welcomeEmailOptions);
          console.log(`Welcome email sent to: ${email}`);
        } catch (emailError) {
          console.error('Error sending welcome email:', emailError);

        }
      }

      res.status(201).json({
        success: true,
        message: 'Successfully subscribed to newsletter! Welcome email sent.',
        data: {
          email: user.email,
          subscribedAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);

      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Email is already registered.',
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error subscribing to newsletter. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

router.post('/newsletter/unsubscribe', [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
], handleValidationErrors, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.isNewsletterSubscribed) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in newsletter subscription list.',
      });
    }

    user.isNewsletterSubscribed = false;
    await user.save();

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter.',
    });
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Error unsubscribing from newsletter. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

router.get('/newsletter/stats', async (req, res) => {
  try {
    const totalSubscribers = await User.countDocuments({ isNewsletterSubscribed: true });
    const recentSubscribers = await User.countDocuments({
      isNewsletterSubscribed: true,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, 
    });

    const interestStats = await User.aggregate([
      { $match: { isNewsletterSubscribed: true } },
      { $unwind: '$preferences.interests' },
      { $group: { _id: '$preferences.interests', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        total: totalSubscribers,
        recentSubscribers,
        interests: interestStats.map(stat => ({
          name: stat._id,
          count: stat.count
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching newsletter stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching newsletter statistics',
      error: error.message,
    });
  }
});

export default router;
