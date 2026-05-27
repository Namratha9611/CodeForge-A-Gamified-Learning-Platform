import express from 'express'
import { authenticate } from '../middleware/auth.js'
import User from '../models/User.js'

const router = express.Router()

// Get leaderboard
router.get('/', authenticate, async (req, res) => {
  try {
    const { sortBy = 'xp' } = req.query
    
    let sortField = 'xp'
    if (sortBy === 'streak') sortField = 'streak'
    else if (sortBy === 'quests') sortField = 'questsCompleted'

    const users = await User.find()
      .select('name email xp level streak persona questsCompleted')
      .sort({ [sortField]: -1 })
      .limit(100)

    res.json(users)
  } catch (error) {
    console.error('Leaderboard fetch error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router

