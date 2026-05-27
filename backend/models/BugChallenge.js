import mongoose from 'mongoose';

const bugChallengeSchema = new mongoose.Schema({
  zoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zone',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  brokenCode: {
    type: String,
    required: true
  },
  correctCode: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    required: true
  },
  canUseHint: { type: Boolean, default: true },
  xpReward: { type: Number, default: 50 },
  order: { type: Number, required: true }, // For sequencing
  boss: { type: Boolean, default: false },

  // Infinite Mode Fields
  generatedAutomatically: { type: Boolean, default: false },
  difficultyLevel: { type: Number, default: 1 },
  hints: [{
    type: String
  }],
  category: {
    type: String,
    enum: ['syntax', 'logic', 'runtime', 'memory', 'algorithmic'],
    required: true
  },
  bugType: {
    type: String,
    required: true
    // Examples: 'missing-semicolon', 'off-by-one', 'null-reference', 'memory-leak', 'inefficient-sort'
  },
  concepts: [{
    type: String
  }],
  hintLevel: {
    type: Number,
    default: 1,
    min: 1,
    max: 3
  },
  language: {
    type: String,
    enum: ['javascript', 'python', 'java', 'cpp', 'c'],
    default: 'javascript'
  },
  order: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

bugChallengeSchema.index({ zoneId: 1, order: 1 });

export default mongoose.model('BugChallenge', bugChallengeSchema);
