import express from 'express'
import { authenticate } from '../middleware/auth.js'
import Quest from '../models/Quest.js'
import AIChallenge from '../models/AIChallenge.js'
import Progress from '../models/Progress.js'
import User from '../models/User.js'
import UserPerformance from '../models/UserPerformance.js'
import { calculateXP } from '../services/xpService.js'
import axios from 'axios'

const router = express.Router()

// Get all quests
router.get('/', authenticate, async (req, res) => {
  try {
    const { domain, difficulty } = req.query
    const filter = { isActive: true }

    if (domain) filter.domain = domain
    if (difficulty) filter.difficulty = difficulty

    const quests = await Quest.find(filter)
      .select('-solution') // Exclude solution
      .sort({ createdAt: -1 })
      .lean() // Convert to plain objects for better performance

    console.log(`Fetched ${quests.length} quests with filters:`, filter)

    // Ensure we always return an array
    res.json(Array.isArray(quests) ? quests : [])
  } catch (error) {
    console.error('Quests fetch error:', error)
    res.status(500).json({
      message: 'Failed to fetch quests',
      error: error.message
    })
  }
})

// Create a new quest
router.post('/', authenticate, async (req, res) => {
  try {
    const questData = req.body

    // Basic validation
    if (!questData.title || !questData.problemStatement) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const quest = new Quest({
      ...questData,
      isActive: true,
      createdAt: new Date()
    })

    const savedQuest = await quest.save()
    res.status(201).json(savedQuest)
  } catch (error) {
    console.error('Quest creation error:', error)
    res.status(500).json({
      message: 'Failed to create quest',
      error: error.message
    })
  }
})

// Get quest detail
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params

    // Validate ObjectId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid quest ID format' })
    }

    let quest = await Quest.findById(id)
      .select('-solution') // Exclude solution
      .lean() // Convert to plain object

    if (!quest) {
      quest = await AIChallenge.findById(id).lean()
    }

    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' })
    }

    res.json(quest)
  } catch (error) {
    console.error('Quest fetch error:', error)

    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid quest ID format' })
    }

    res.status(500).json({
      message: 'Failed to fetch quest',
      error: error.message
    })
  }
})

// Get all user's progress
router.get('/progress/all', authenticate, async (req, res) => {
  try {
    const allProgress = await Progress.find({ user: req.userId })
    console.log(`Found ${allProgress.length} progress records for user ${req.userId}`)

    // Convert quest ObjectIds to strings for easier comparison in frontend
    const progressData = allProgress.map(p => ({
      ...p.toObject(),
      quest: p.quest.toString()
    }))

    res.json(progressData)
  } catch (error) {
    console.error('Progress fetch error:', error)
    res.status(500).json({ message: 'Failed to fetch progress' })
  }
})

// Get user's progress for a quest
router.get('/:id/progress', authenticate, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.userId,
      quest: req.params.id
    })

    if (!progress) {
      return res.status(404).json({ message: 'No progress found' })
    }

    res.json(progress)
  } catch (error) {
    console.error('Progress fetch error:', error)
    res.status(500).json({ message: 'Failed to fetch progress' })
  }
})

// Submit quest solution
router.post('/:id/submit', authenticate, async (req, res) => {
  try {
    const { code, language } = req.body
    let quest = await Quest.findById(req.params.id)
    
    if (!quest) {
      quest = await AIChallenge.findById(req.params.id)
    }

    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' })
    }

    // Handle DBMS/SQL quests differently - they don't need code execution
    let evaluationResult
    if (quest.domain === 'dbms' || language === 'sql') {
      // For SQL queries, do pattern-based validation
      const sqlCode = code.trim()
      const sqlUpper = sqlCode.toUpperCase()

      // Check for basic SQL structure
      const hasSelect = sqlUpper.includes('SELECT')
      const hasFrom = sqlUpper.includes('FROM')
      const hasWhere = sqlUpper.includes('WHERE')

      // Check for table name (case-insensitive)
      const hasEmployees = /FROM\s+(\w+\.)?employees/i.test(sqlCode)

      // Check for department filter (flexible matching)
      const departmentPatterns = [
        /department\s*=\s*['"]engineering['"]/i,
        /department\s*=\s*['"]Engineering['"]/i,
        /department\s*LIKE\s*['"]%engineering%['"]/i,
        /department\s*IN\s*\(['"]engineering['"]\)/i,
        /WHERE.*department/i
      ]
      const hasDepartmentFilter = departmentPatterns.some(pattern => pattern.test(sqlCode))

      // Validate SQL structure
      if (!hasSelect || !hasFrom) {
        evaluationResult = {
          success: false,
          message: 'Invalid SQL query. Make sure it includes SELECT and FROM clauses.',
          score: 0,
          output: code,
          feedback: 'SQL queries must include SELECT and FROM statements.'
        }
      } else if (!hasEmployees) {
        evaluationResult = {
          success: false,
          message: 'SQL query should select from the employees table.',
          score: 30,
          output: code,
          feedback: 'Make sure your FROM clause references the employees table.'
        }
      } else if (!hasWhere || !hasDepartmentFilter) {
        evaluationResult = {
          success: false,
          message: 'SQL query should filter by department. Add a WHERE clause filtering for Engineering department.',
          score: 60,
          output: code,
          feedback: 'Add a WHERE clause to filter employees by department = \'Engineering\'.'
        }
      } else {
        // Valid SQL query
        evaluationResult = {
          success: true,
          message: 'SQL query looks correct!',
          score: 100,
          output: code,
          feedback: 'Your SQL query is syntactically correct and filters by the Engineering department.'
        }
      }
    } else {
      // For other domains, use code evaluation service
      try {
        const aiResponse = await axios.post('http://localhost:8000/api/evaluate-code', {
          code,
          language,
          testCases: quest.testCases,
          questId: quest._id.toString(),
        })
        evaluationResult = aiResponse.data
      } catch (error) {
        console.error('Code evaluation error:', error)
        return res.status(500).json({
          success: false,
          message: 'Code evaluation service unavailable',
        })
      }
    }

    // Save progress
    const existingProgress = await Progress.findOne({ user: req.userId, quest: quest._id })
    const attempts = existingProgress ? existingProgress.attempts + 1 : 1

    const progress = await Progress.findOneAndUpdate(
      { user: req.userId, quest: quest._id },
      {
        user: req.userId,
        quest: quest._id,
        code,
        language,
        status: evaluationResult.success ? 'completed' : 'attempted',
        attempts,
        score: evaluationResult.score || 0,
        feedback: evaluationResult.feedback,
      },
      { upsert: true, new: true }
    )

    // Update user if successful
    if (evaluationResult.success) {
      const user = await User.findById(req.userId)
      
      // ── Dynamic XP Calculation ──────────────────────────────────────────
      const timeTakenSeconds = req.body.timeTakenSeconds || 0
      const hintsUsed = req.body.hintsUsed || 0
      const attempts = existingProgress ? existingProgress.attempts + 1 : 1
      
      const xpResult = calculateXP({
        difficulty: quest.difficulty,
        timeTakenSeconds,
        streak: user.streak || 0,
        attempts,
        hintsUsed,
        isFirstAttemptSolve: attempts === 1,
      })

      user.addXP(xpResult.total)
      user.questsCompleted = (user.questsCompleted || 0) + 1
      user.updateStreak()
      user.updatePersona()

      // Check for badges
      if (user.questsCompleted === 10) user.badges.push('First 10')
      else if (user.questsCompleted === 50) user.badges.push('Quest Master')
      else if (user.questsCompleted === 100) user.badges.push('Centurion')
      if (user.streak === 7) user.badges.push('Week Warrior')
      else if (user.streak === 30) user.badges.push('Monthly Master')

      await user.save()

      // ── Adaptive engine: update per-topic performance ───────────────────
      try {
        const topic = quest.tags?.[0] || quest.domain
        let perf = await UserPerformance.findOne({ userId: req.userId })
        if (!perf) perf = new UserPerformance({ userId: req.userId, topics: [] })

        let topicRec = perf.topics.find(t => t.topic === topic && t.domain === quest.domain)
        if (!topicRec) {
          perf.topics.push({ topic, domain: quest.domain, solved: 0, failed: 0, totalAttempts: 0, accuracy: 0, avgTimeSeconds: 0, hintsUsed: 0 })
          topicRec = perf.topics[perf.topics.length - 1]
        }

        topicRec.totalAttempts += 1
        topicRec.solved += 1
        topicRec.accuracy = Math.round((topicRec.solved / topicRec.totalAttempts) * 100)
        topicRec.lastAttempted = new Date()
        perf.recompute()
        await perf.save()
      } catch (perfErr) {
        console.error('Performance update error (non-critical):', perfErr.message)
      }

      // ── AI Code Analysis (non-blocking) ────────────────────────────────
      let codeAnalysis = null
      try {
        const analysisRes = await axios.post('http://localhost:8000/api/analyze-code', {
          code: req.body.code,
          language: req.body.language,
          passed: true,
          timeTakenMs: timeTakenSeconds * 1000,
        }, { timeout: 4000 })
        codeAnalysis = analysisRes.data
      } catch (e) { /* non-critical */ }

      // ── Similar Questions (non-blocking) ───────────────────────────────
      let similarQuestions = []
      try {
        const topic = quest.tags?.[0] || quest.domain
        const simRes = await axios.post('http://localhost:8000/api/similar-questions', {
          topic, difficulty: quest.difficulty || 'medium',
        }, { timeout: 4000 })
        similarQuestions = simRes.data?.questions || []
        console.log(`Similar questions generated:`, similarQuestions.length)
      } catch (e) {
        console.error('Failed to generate similar questions:', e.message)
      }

      return res.json({
        success: true,
        message: evaluationResult.message,
        output: evaluationResult.output,
        explanation: evaluationResult.explanation,
        score: evaluationResult.score,
        xpEarned: xpResult.total,
        xpBreakdown: xpResult.breakdown,
        codeAnalysis,
        similarQuestions,
        newPersona: user.persona,
        newLevel: user.level,
        progress: { code: progress.code, language: progress.language, status: progress.status }
      })
    }

    // ── Failed submission: track performance + get analysis ────────────────
    try {
      const topic = quest.tags?.[0] || quest.domain
      let perf = await UserPerformance.findOne({ userId: req.userId })
      if (!perf) perf = new UserPerformance({ userId: req.userId, topics: [] })

      let topicRec = perf.topics.find(t => t.topic === topic && t.domain === quest.domain)
      if (!topicRec) {
        perf.topics.push({ topic, domain: quest.domain, solved: 0, failed: 0, totalAttempts: 0, accuracy: 0, avgTimeSeconds: 0, hintsUsed: 0 })
        topicRec = perf.topics[perf.topics.length - 1]
      }
      topicRec.totalAttempts += 1
      topicRec.failed += 1
      topicRec.accuracy = Math.round((topicRec.solved / topicRec.totalAttempts) * 100)
      topicRec.lastAttempted = new Date()
      perf.recentlyFailed = perf.recentlyFailed || []
      perf.recentlyFailed.push({ questId: quest._id, topic })
      if (perf.recentlyFailed.length > 10) perf.recentlyFailed.shift()
      perf.recompute()
      await perf.save()
    } catch (e) { /* non-critical */ }

    // AI code analysis for failed attempt too
    let codeAnalysis = null
    try {
      const analysisRes = await axios.post('http://localhost:8000/api/analyze-code', {
        code: req.body.code,
        language: req.body.language,
        passed: false,
      }, { timeout: 4000 })
      codeAnalysis = analysisRes.data
    } catch (e) { /* non-critical */ }

    res.json({
      success: false,
      message: evaluationResult.message,
      output: evaluationResult.output,
      explanation: evaluationResult.explanation,
      score: evaluationResult.score,
      xpEarned: 0,
      codeAnalysis,
      progress: { code: progress.code, language: progress.language, status: progress.status }
    })
  } catch (error) {
    console.error('Quest submission error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router

