import express from 'express'
import { authenticate } from '../middleware/auth.js'
import UserPerformance from '../models/UserPerformance.js'
import AIChallenge from '../models/AIChallenge.js'
import Quest from '../models/Quest.js'
import Progress from '../models/Progress.js'
import User from '../models/User.js'
import axios from 'axios'

const router = express.Router()
const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

// ─── Proxy: Hint & Similar Questions (frontend calls these through backend) ───

router.post('/hint', authenticate, async (req, res) => {
  try {
    const aiRes = await axios.post(`${AI_URL}/api/hint`, req.body, { timeout: 5000 })
    res.json(aiRes.data)
  } catch (e) {
    // Fallback hint if AI is down
    res.json({
      hint: 'Break the problem into smaller steps. Try a brute force approach first, then optimize.',
      hintNumber: (req.body.hintIndex || 0) + 1,
      totalHints: 3,
      isLast: (req.body.hintIndex || 0) >= 2,
      xpPenalty: ((req.body.hintIndex || 0) + 1) * 2,
    })
  }
})

router.post('/similar-questions', authenticate, async (req, res) => {
  try {
    const aiRes = await axios.post(`${AI_URL}/api/similar-questions`, req.body, { timeout: 5000 })
    res.json(aiRes.data)
  } catch (e) {
    res.json({ questions: [] })
  }
})

// ─── Proxy: Generate Specific Follow-up Challenge ───
router.post('/generate-specific', authenticate, async (req, res) => {
  try {
    const { title, domain, difficulty } = req.body
    
    // Call AI to generate full problem statement
    const aiRes = await axios.post(`${AI_URL}/api/adaptive/generate-specific`, {
      title, domain, difficulty
    }, { timeout: 10000 })

    const generated = aiRes.data
    
    // Save to database
    const newQuest = await AIChallenge.findOneAndUpdate(
      { title: generated.title },
      { ...generated, domain: domain || 'dsa', tags: [domain] },
      { upsert: true, new: true }
    )
    
    res.json(newQuest)
  } catch (e) {
    console.error('Failed to generate specific challenge:', e.message)
    res.status(500).json({ message: 'Failed to generate challenge.' })
  }
})



// ─────────────────────────────────────────────────────────────────────────────
// GET /api/adaptive/panel
// Returns the full smart recommendation panel for the dashboard.
// Calls AI service to get generated question + reads weak topics from DB.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/panel', authenticate, async (req, res) => {
  try {
    const [user, perf] = await Promise.all([
      User.findById(req.userId),
      UserPerformance.findOne({ userId: req.userId }),
    ])

    if (!user) return res.status(404).json({ message: 'User not found' })

    const persona   = user.persona || 'Novice'
    const skillScores = user.skillScores || {}
    const weakAreas   = user.weakAreas   || []

    // Decide difficulty from performance record or fallback to skill scores avg
    let difficulty = 'easy'
    if (perf) {
      difficulty = perf.recommendedDifficulty
    } else {
      const scores = Object.values(skillScores)
      const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
      if (avg < 40) difficulty = 'easy'
      else if (avg <= 70) difficulty = 'medium'
      else difficulty = 'hard'
    }

    const weakTopics   = perf?.weakTopics   || weakAreas
    const strongTopics = perf?.strongTopics || []
    const recentFailed = perf?.recentlyFailed?.slice(-3) || []

    // ── Section 1: Weak-topic practice (up to 2 from DB) ──────────────────
    let weakPractice = []
    if (weakTopics.length) {
      weakPractice = await Quest.find({
        domain: { $in: weakTopics },
        difficulty: 'easy',
        isActive: true,
      }).limit(2).lean()
    }

    // ── Section 2: AI-generated daily challenge ───────────────────────────
    let dailyChallenge = null
    try {
      const focusDomain = weakTopics[0] || 'dsa'
      const aiRes = await axios.post(`${AI_URL}/api/adaptive/generate`, {
        persona,
        difficulty,
        domain: focusDomain,
        weakTopics,
        strongTopics,
        skillScores,
      }, { timeout: 8000 })

      const generated = aiRes.data
      // Upsert into AIChallenge collection so it's reusable
      dailyChallenge = await AIChallenge.findOneAndUpdate(
        { title: generated.title, difficulty: generated.difficulty },
        { ...generated, generatedForPersona: persona, $inc: { timesServed: 1 } },
        { upsert: true, new: true }
      )
    } catch (err) {
      console.error('AI daily challenge generation failed:', err.message)
    }

    // ── Section 3: Next-level challenge (one step harder) ─────────────────
    const nextDiff = difficulty === 'easy' ? 'medium' : difficulty === 'medium' ? 'hard' : 'hard'
    const nextLevel = await Quest.findOne({ difficulty: nextDiff, isActive: true }).lean()

    // ── Section 4: Recently failed quests ─────────────────────────────────
    const failedQuestIds = recentFailed.map(f => f.questId).filter(Boolean)
    const revisionQuests = await Quest.find({ _id: { $in: failedQuestIds } }).lean()

    res.json({
      persona,
      difficulty,
      weakTopics,
      strongTopics,
      overallAccuracy: perf?.overallAccuracy ?? null,
      sections: {
        weakPractice,
        dailyChallenge,
        nextLevelChallenge: nextLevel,
        revisionQuests,
      },
    })
  } catch (err) {
    console.error('Adaptive panel error:', err)
    res.status(500).json({ message: 'Failed to load adaptive panel' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/adaptive/update-performance
// Called automatically after every quest submission.
// Body: { questId, topic, domain, solved, timeTakenSeconds, hintsUsed, score }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/update-performance', authenticate, async (req, res) => {
  try {
    const { questId, topic, domain, solved, timeTakenSeconds = 0, hintsUsed = 0, score = 0 } = req.body

    let perf = await UserPerformance.findOne({ userId: req.userId })
    if (!perf) {
      perf = new UserPerformance({ userId: req.userId, topics: [] })
    }

    // Find existing topic record or create
    let topicRecord = perf.topics.find(t => t.topic === topic && t.domain === domain)
    if (!topicRecord) {
      perf.topics.push({ topic, domain, solved: 0, failed: 0, totalAttempts: 0, accuracy: 0, avgTimeSeconds: 0, hintsUsed: 0 })
      topicRecord = perf.topics[perf.topics.length - 1]
    }

    // Update topic stats
    topicRecord.totalAttempts += 1
    topicRecord.hintsUsed += hintsUsed
    topicRecord.lastAttempted = new Date()
    if (solved) {
      topicRecord.solved += 1
    } else {
      topicRecord.failed += 1
      // Track recently failed for revision section
      perf.recentlyFailed = perf.recentlyFailed || []
      perf.recentlyFailed.push({ questId, topic })
      if (perf.recentlyFailed.length > 10) perf.recentlyFailed.shift()
    }

    // Rolling average time
    topicRecord.avgTimeSeconds = Math.round(
      (topicRecord.avgTimeSeconds * (topicRecord.totalAttempts - 1) + timeTakenSeconds) / topicRecord.totalAttempts
    )

    // Accuracy for this topic
    topicRecord.accuracy = Math.round((topicRecord.solved / topicRecord.totalAttempts) * 100)

    // Recompute overall stats & difficulty
    perf.recompute()

    await perf.save()

    res.json({
      recommendedDifficulty: perf.recommendedDifficulty,
      overallAccuracy: perf.overallAccuracy,
      weakTopics: perf.weakTopics,
      strongTopics: perf.strongTopics,
    })
  } catch (err) {
    console.error('Update performance error:', err)
    res.status(500).json({ message: 'Failed to update performance' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/adaptive/next-problem
// Returns the single best next problem for this user right now.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/next-problem', authenticate, async (req, res) => {
  try {
    const [user, perf] = await Promise.all([
      User.findById(req.userId),
      UserPerformance.findOne({ userId: req.userId }),
    ])

    const persona     = user?.persona    || 'Novice'
    const skillScores = user?.skillScores || {}
    const weakTopics  = perf?.weakTopics  || user?.weakAreas || []
    const difficulty  = perf?.recommendedDifficulty || 'easy'

    // IDs already solved
    const solved = await Progress.find({ user: req.userId, status: 'completed' })
    const solvedIds = solved.map(p => p.quest)

    // Look for an unseen quest in weak areas first
    let nextQuest = null
    if (weakTopics.length) {
      nextQuest = await Quest.findOne({
        domain: { $in: weakTopics },
        difficulty,
        isActive: true,
        _id: { $nin: solvedIds },
      }).lean()
    }

    // Fallback: any unseen quest at recommended difficulty
    if (!nextQuest) {
      nextQuest = await Quest.findOne({
        difficulty,
        isActive: true,
        _id: { $nin: solvedIds },
      }).lean()
    }

    // Last resort: generate fresh from AI
    if (!nextQuest) {
      try {
        const aiRes = await axios.post(`${AI_URL}/api/adaptive/generate`, {
          persona, difficulty,
          domain: weakTopics[0] || 'dsa',
          weakTopics, strongTopics: perf?.strongTopics || [],
          skillScores,
        }, { timeout: 8000 })

        nextQuest = await AIChallenge.findOneAndUpdate(
          { title: aiRes.data.title },
          { ...aiRes.data, generatedForPersona: persona },
          { upsert: true, new: true }
        )
      } catch (e) {
        console.error('AI next-problem generation failed:', e.message)
      }
    }

    res.json({ nextProblem: nextQuest, difficulty, persona })
  } catch (err) {
    console.error('Next-problem error:', err)
    res.status(500).json({ message: 'Failed to fetch next problem' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/adaptive/stats
// Full performance analytics for the student.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/stats', authenticate, async (req, res) => {
  try {
    const perf = await UserPerformance.findOne({ userId: req.userId })
    if (!perf) return res.json({ message: 'No performance data yet. Solve some quests!' })

    res.json({
      totalSolved: perf.totalSolved,
      totalFailed: perf.totalFailed,
      overallAccuracy: perf.overallAccuracy,
      recommendedDifficulty: perf.recommendedDifficulty,
      weakTopics: perf.weakTopics,
      strongTopics: perf.strongTopics,
      topicBreakdown: perf.topics,
      currentLevel: perf.currentLevel,
    })
  } catch (err) {
    console.error('Stats error:', err)
    res.status(500).json({ message: 'Failed to fetch stats' })
  }
})

export default router
