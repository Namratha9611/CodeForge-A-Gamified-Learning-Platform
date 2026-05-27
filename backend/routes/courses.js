import express from 'express'
import Course from '../models/Course.js'
import { authenticate, isAdmin } from '../middleware/auth.js'

const router = express.Router()

// Create course (admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { title, description, domain, difficulty, lessons, isVisible, xpReward } = req.body
    
    // Validate lessons
    if (lessons && lessons.length > 0) {
      lessons.forEach((lesson, index) => {
        lesson.order = lesson.order || index + 1
      })
    }
    
    const course = new Course({
      title,
      description,
      domain,
      difficulty,
      lessons: lessons || [],
      isVisible: isVisible !== undefined ? isVisible : true,
      xpReward: xpReward || 50,
      createdBy: req.userId,
    })
    
    await course.save()
    await course.populate('createdBy', 'name email')
    
    res.status(201).json(course)
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message })
  }
})

// Update course (admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { title, description, domain, difficulty, lessons, isVisible, xpReward } = req.body
    const courseId = req.params.id
    
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }
    
    // Update fields
    if (title) course.title = title
    if (description) course.description = description
    if (domain) course.domain = domain
    if (difficulty) course.difficulty = difficulty
    if (isVisible !== undefined) course.isVisible = isVisible
    if (xpReward) course.xpReward = xpReward
    if (lessons) {
      lessons.forEach((lesson, index) => {
        lesson.order = lesson.order || index + 1
      })
      course.lessons = lessons
    }
    
    await course.save()
    await course.populate('createdBy', 'name email')
    
    res.json(course)
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message })
  }
})

// Delete course (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const courseId = req.params.id
    
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }
    
    await Course.findByIdAndDelete(courseId)
    
    res.json({ message: 'Course deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message })
  }
})

// Get all courses (admin only - includes hidden courses)
router.get('/admin/all', authenticate, isAdmin, async (req, res) => {
  try {
    const { domain, difficulty, page = 1, limit = 10 } = req.query
    
    const filter = {}
    if (domain) filter.domain = domain
    if (difficulty) filter.difficulty = difficulty
    
    const courses = await Course.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
    
    const total = await Course.countDocuments(filter)
    
    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message })
  }
})

// Get course by ID (admin only)
router.get('/admin/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const courseId = req.params.id
    
    const course = await Course.findById(courseId)
      .populate('createdBy', 'name email')
      .populate('enrolledUsers.user', 'name email')
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }
    
    res.json(course)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message })
  }
})

export default router
