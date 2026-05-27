import mongoose from 'mongoose'

const questSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  problemStatement: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    enum: ['dsa', 'dbms', 'os', 'cn', 'web'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  xpReward: {
    type: Number,
    default: 10,
  },
  starterCode: {
    python: String,
    java: String,
    cpp: String,
    javascript: String,
  },
  testCases: [{
    input: mongoose.Schema.Types.Mixed,
    expectedOutput: mongoose.Schema.Types.Mixed,
    isHidden: { type: Boolean, default: false },
  }],
  examples: [{
    input: mongoose.Schema.Types.Mixed,
    output: mongoose.Schema.Types.Mixed,
    explanation: String,
  }],
  constraints: [String],
  hints: [String],
  solution: {
    type: String,
    select: false, // Don't return by default
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

export default mongoose.model('Quest', questSchema)

