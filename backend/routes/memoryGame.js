import express from 'express'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'

const router = express.Router()

// Save game score and award XP
router.post('/save-score', [
  body('score').isInt({ min: 0 }).withMessage('Score must be a positive integer'),
  body('moves').isInt({ min: 0 }).withMessage('Moves must be a positive integer'),
  body('topic').isIn(['dsa', 'oop', 'os', 'sql', 'dbms', 'web', 'networking']).withMessage('Invalid topic'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
  body('timeSpent').isInt({ min: 0 }).withMessage('Time spent must be a positive integer'),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const { score, moves, topic, difficulty, timeSpent } = req.body
    const userId = req.user.id

    // Find user
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Calculate XP based on performance
    let xpEarned = Math.floor(score / 10) // Base XP from score
    
    // Bonus XP for difficulty
    const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 }
    xpEarned = Math.floor(xpEarned * difficultyMultiplier[difficulty])

    // Efficiency bonus (fewer moves = more XP)
    const maxMoves = 20 // Expected max moves for 6 pairs
    if (moves < maxMoves) {
      xpEarned += Math.floor((maxMoves - moves) * 2)
    }

    // Speed bonus (completed quickly)
    const timeBonus = Math.floor(Math.max(0, 120 - timeSpent) / 10)
    xpEarned += timeBonus

    // Update user XP and level
    user.xp += xpEarned
    
    // Calculate new level (every 100 XP = 1 level)
    const newLevel = Math.floor(user.xp / 100) + 1
    if (newLevel > user.level) {
      user.level = newLevel
      
      // Update persona based on level
      if (newLevel <= 4) user.persona = 'Novice'
      else if (newLevel <= 14) user.persona = 'Explorer'
      else if (newLevel <= 29) user.persona = 'Prodigy'
      else user.persona = 'Master'
    }

    // Add memory game stats
    if (!user.gameStats) user.gameStats = {}
    if (!user.gameStats.memoryGame) {
      user.gameStats.memoryGame = {
        gamesPlayed: 0,
        totalScore: 0,
        bestScore: 0,
        topicsPlayed: {}
      }
    }

    const gameStats = user.gameStats.memoryGame
    gameStats.gamesPlayed += 1
    gameStats.totalScore += score
    gameStats.bestScore = Math.max(gameStats.bestScore, score)
    
    if (!gameStats.topicsPlayed[topic]) {
      gameStats.topicsPlayed[topic] = { easy: 0, medium: 0, hard: 0 }
    }
    gameStats.topicsPlayed[topic][difficulty] += 1

    // Check for badges
    const badges = user.badges || []
    
    // Memory game badges
    if (gameStats.gamesPlayed === 1 && !badges.includes('First Game')) {
      badges.push('First Game')
    }
    
    if (score >= 100 && !badges.includes('Memory Master')) {
      badges.push('Memory Master')
    }
    
    if (gameStats.gamesPlayed >= 10 && !badges.includes('Game Enthusiast')) {
      badges.push('Game Enthusiast')
    }

    user.badges = badges

    await user.save()

    res.json({
      message: 'Score saved successfully',
      xpEarned,
      newLevel: user.level,
      newPersona: user.persona,
      totalXP: user.xp,
      badges: badges.filter(b => b.includes('Game') || b.includes('Memory'))
    })

  } catch (error) {
    console.error('Save score error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get game stats
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId).select('gameStats.badges gameStats.memoryGame')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const memoryStats = user.gameStats?.memoryGame || {
      gamesPlayed: 0,
      totalScore: 0,
      bestScore: 0,
      topicsPlayed: {}
    }

    res.json({
      stats: memoryStats,
      badges: user.badges?.filter(b => b.includes('Game') || b.includes('Memory')) || []
    })

  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get leaderboard for memory game
router.get('/leaderboard', async (req, res) => {
  try {
    const { topic, difficulty, limit = 10 } = req.query

    // Build query
    let query = {}
    if (topic || difficulty) {
      query['gameStats.memoryGame.bestScore'] = { $exists: true, $gt: 0 }
    }

    // Find users with memory game scores
    const users = await User.find(query)
      .select('name xp level persona gameStats.memoryGame')
      .sort({ 'gameStats.memoryGame.bestScore': -1 })
      .limit(parseInt(limit))

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      score: user.gameStats?.memoryGame?.bestScore || 0,
      level: user.level,
      persona: user.persona,
      gamesPlayed: user.gameStats?.memoryGame?.gamesPlayed || 0
    }))

    res.json({ leaderboard })

  } catch (error) {
    console.error('Leaderboard error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
