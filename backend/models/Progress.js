import mongoose from 'mongoose'

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quest',
    required: true,
  },
  status: {
    type: String,
    enum: ['attempted', 'completed', 'failed'],
    default: 'attempted',
  },
  code: String,
  language: String,
  attempts: {
    type: Number,
    default: 1,
  },
  timeSpent: Number, // in seconds
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  score: Number,
  feedback: String,
}, {
  timestamps: true,
})

progressSchema.index({ user: 1, quest: 1 }, { unique: true })

export default mongoose.model('Progress', progressSchema)

