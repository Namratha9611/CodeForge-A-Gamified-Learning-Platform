import mongoose from 'mongoose'

const assessmentQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
  },
  domain: {
    type: String,
    enum: ['dsa', 'dbms', 'os', 'cn', 'web'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  explanation: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

// Index for efficient querying
assessmentQuestionSchema.index({ domain: 1, isActive: 1 })

export default mongoose.model('AssessmentQuestion', assessmentQuestionSchema)

