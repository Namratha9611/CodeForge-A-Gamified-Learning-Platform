import mongoose from 'mongoose'

const aiChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  problemStatement: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  domain: {
    type: String,
    enum: ['dsa', 'dbms', 'os', 'cn', 'web'],
    required: true,
  },
  topic: { type: String, required: true },          // e.g. "arrays", "trees"
  tags: [String],
  constraints: [String],
  examples: [{
    input: mongoose.Schema.Types.Mixed,
    output: mongoose.Schema.Types.Mixed,
    explanation: String,
  }],
  starterCode: {
    python: String,
    javascript: String,
    java: String,
    cpp: String,
  },
  testCases: [{
    input: mongoose.Schema.Types.Mixed,
    expectedOutput: mongoose.Schema.Types.Mixed,
    isHidden: { type: Boolean, default: false },
  }],
  hints: [String],
  xpReward: { type: Number, default: 15 },
  isActive: { type: Boolean, default: true },

  // Tracking
  generatedForPersona: {
    type: String,
    enum: ['Novice', 'Intermediate', 'Advanced', 'Master'],
    default: 'Novice',
  },
  timesServed: { type: Number, default: 0 },
  avgScore: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('AIChallenge', aiChallengeSchema)
