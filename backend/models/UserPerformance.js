import mongoose from 'mongoose'

const topicPerformanceSchema = new mongoose.Schema({
  topic: { type: String, required: true },          // e.g. "arrays", "trees", "sql"
  domain: { type: String, required: true },          // e.g. "dsa", "dbms", "os"
  solved: { type: Number, default: 0 },
  failed: { type: Number, default: 0 },
  totalAttempts: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },           // 0-100 %
  avgTimeSeconds: { type: Number, default: 0 },
  hintsUsed: { type: Number, default: 0 },
  lastAttempted: { type: Date, default: Date.now },
}, { _id: false })

const userPerformanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  // Per-topic breakdown
  topics: [topicPerformanceSchema],

  // Overall stats
  totalSolved: { type: Number, default: 0 },
  totalFailed: { type: Number, default: 0 },
  overallAccuracy: { type: Number, default: 0 },
  avgTimeSeconds: { type: Number, default: 0 },

  // Current computed difficulty the engine recommends
  recommendedDifficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
  },

  // Weak / strong topic lists (denormalized for fast reads)
  weakTopics: [String],
  strongTopics: [String],

  // For the "recently failed" section of the smart panel
  recentlyFailed: [{
    questId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest' },
    topic: String,
    failedAt: { type: Date, default: Date.now },
  }],

  currentLevel: {
    type: String,
    enum: ['Novice', 'Intermediate', 'Advanced', 'Master'],
    default: 'Novice',
  },
}, { timestamps: true })

// Recompute aggregates and difficulty whenever a topic record changes
userPerformanceSchema.methods.recompute = function () {
  const topics = this.topics

  if (!topics.length) return

  const totalSolved = topics.reduce((s, t) => s + t.solved, 0)
  const totalFailed = topics.reduce((s, t) => s + t.failed, 0)
  const totalAttempts = totalSolved + totalFailed
  const overallAccuracy = totalAttempts > 0
    ? Math.round((totalSolved / totalAttempts) * 100) : 0

  this.totalSolved = totalSolved
  this.totalFailed = totalFailed
  this.overallAccuracy = overallAccuracy

  // Adaptive difficulty rule
  if (overallAccuracy < 40) this.recommendedDifficulty = 'easy'
  else if (overallAccuracy <= 70) this.recommendedDifficulty = 'medium'
  else this.recommendedDifficulty = 'hard'

  // Weak = accuracy < 50, Strong = accuracy >= 75
  this.weakTopics = topics.filter(t => t.accuracy < 50).map(t => t.topic)
  this.strongTopics = topics.filter(t => t.accuracy >= 75).map(t => t.topic)
}

export default mongoose.model('UserPerformance', userPerformanceSchema)
