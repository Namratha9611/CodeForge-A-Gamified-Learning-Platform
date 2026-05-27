import express from 'express'
import { authenticate } from '../middleware/auth.js'
import AssessmentQuestion from '../models/AssessmentQuestion.js'

const router = express.Router()

// Get random assessment questions (3 per domain, total 15 questions)
router.get('/questions', authenticate, async (req, res) => {
  try {
    const domains = ['dsa', 'dbms', 'os', 'cn', 'web']
    const questionsPerDomain = 3
    const allQuestions = []

    // Fetch 3 random questions for each domain using $sample
    for (const domain of domains) {
      const domainQuestions = await AssessmentQuestion.aggregate([
        { $match: { domain, isActive: true } },
        { $sample: { size: questionsPerDomain } },
        { $project: { 
          _id: 1,
          question: 1,
          options: 1,
          correctAnswer: 1,
          domain: 1,
          explanation: 1
        }}
      ])

      // If we don't have enough questions, get all available
      if (domainQuestions.length < questionsPerDomain) {
        const allDomainQuestions = await AssessmentQuestion.find({
          domain,
          isActive: true
        }).select('question options correctAnswer domain explanation')

        // Shuffle and take what we have
        const shuffled = allDomainQuestions.sort(() => 0.5 - Math.random())
        allQuestions.push(...shuffled.slice(0, Math.min(questionsPerDomain, shuffled.length)))
      } else {
        allQuestions.push(...domainQuestions)
      }
    }

    // Group questions by domain
    const questionsByDomain = {}
    domains.forEach(domain => {
        questionsByDomain[domain] = allQuestions
        .filter(q => q.domain === domain)
        .map((q) => ({
          id: q._id.toString(),
          question: q.question,
          options: q.options,
          correct: q.correctAnswer,
          explanation: q.explanation,
        }))
    })

    // Add cache-control headers to prevent caching
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'Pragma': 'no-cache',
      'Expires': '0'
    })

    res.json({
      questions: questionsByDomain,
      totalQuestions: allQuestions.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching assessment questions:', error)
    res.status(500).json({ message: 'Failed to fetch assessment questions' })
  }
})

export default router

