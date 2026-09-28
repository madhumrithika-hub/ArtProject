const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const Tutorial = require('../models/Tutorial');

const JWT_SECRET = process.env.JWT_SECRET || 'artflow_super_secure_jwt_secret_token_key_2026';

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      user_id: user.user_id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user with user_id, mail id (email), and password
 */
router.post('/register', async (req, res) => {
  try {
    const { user_id, email, password } = req.body;

    if (!user_id || !email || !password) {
      return res.status(400).json({
        error: 'Please provide all required fields: user_id, mail id (email), and password.',
      });
    }

    const cleanUserId = user_id.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // Check if user_id or email already exists
    const existingUser = await User.findOne({
      $or: [{ user_id: cleanUserId }, { email: cleanEmail }],
    });

    if (existingUser) {
      if (existingUser.user_id === cleanUserId) {
        return res.status(409).json({ error: `User ID "${cleanUserId}" is already taken. Please choose another.` });
      }
      return res.status(409).json({ error: `Email address "${cleanEmail}" is already registered. Please log in.` });
    }

    // Create user
    const newUser = new User({
      user_id: cleanUserId,
      email: cleanEmail,
      password,
    });

    await newUser.save();

    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'Account registered successfully!',
      token,
      user: {
        id: newUser._id,
        user_id: newUser.user_id,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('[Auth] Registration error:', error);
    return res.status(500).json({ error: error.message || 'Server error during registration.' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user with user_id/email and password
 */
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        error: 'Please provide your user_id or mail id and password.',
      });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Find by user_id OR email
    const user = await User.findOne({
      $or: [{ user_id: cleanIdentifier }, { email: cleanIdentifier }],
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid user credentials. Please check your details.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid user credentials. Incorrect password.' });
    }

    const token = generateToken(user);

    return res.json({
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        user_id: user.user_id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return res.status(500).json({ error: error.message || 'Server error during login.' });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile and tutorial count
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const tutorialCount = await Tutorial.countDocuments({ userId: user.user_id });
    const artworkCount = await Tutorial.countDocuments({
      userId: user.user_id,
      'savedDrawing.canvasData': { $exists: true, $ne: null },
    });

    return res.json({
      user: {
        id: user._id,
        user_id: user.user_id,
        email: user.email,
        createdAt: user.createdAt,
      },
      stats: {
        tutorialCount,
        artworkCount,
      },
    });
  } catch (error) {
    console.error('[Auth] /me error:', error);
    return res.status(500).json({ error: 'Error fetching profile.' });
  }
});

module.exports = router;
