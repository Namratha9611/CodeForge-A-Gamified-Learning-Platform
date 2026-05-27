import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { generateTokens } from '../middleware/auth.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const { name, email, password } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Create user
    const user = new User({ name, email, password })
    await user.save()

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id)

    res.status(201).json({
      message: 'User created successfully',
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        persona: user.persona,
        assessmentTaken: user.assessmentTaken,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)

    // Check if it's a MongoDB connection error
    if (error.name === 'MongoServerError' || error.message.includes('Mongo')) {
      return res.status(503).json({
        message: 'Database connection error. Please check MongoDB connection.',
        error: 'MongoDB connection failed'
      })
    }

    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message })
    }

    res.status(500).json({
      message: error.message || 'Server error',
      error: error.name || 'Unknown error'
    })
  }
})

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Update streak
    user.updateStreak()
    await user.save()

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id)

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        persona: user.persona,
        assessmentTaken: user.assessmentTaken,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: 'Database connection unavailable. Please ensure MongoDB is running.',
        error: 'MongoDB disconnected'
      })
    }

    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' })
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const { accessToken } = generateTokens(decoded.userId)

    res.json({ accessToken })
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' })
  }
})

export default router

