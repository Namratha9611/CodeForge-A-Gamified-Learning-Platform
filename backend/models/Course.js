import mongoose from 'mongoose'

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    default: '',
  },
  resources: [{
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['link', 'document', 'video'],
      default: 'link',
    },
  }],
  order: {
    type: Number,
    required: true,
  },
}, { _id: true })

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
    enum: ['dsa', 'dbms', 'os', 'cn', 'web'],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'],
  },
  lessons: [lessonSchema],
  isVisible: {
    type: Boolean,
    default: true,
  },
  enrolledUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    progress: [{
      lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      completed: {
        type: Boolean,
        default: false,
      },
      completedAt: {
        type: Date,
      },
      quizCompleted: {
        type: Boolean,
        default: false,
      },
      quizScore: {
        type: Number,
        default: 0,
      },
    }],
    completedAt: {
      type: Date,
    },
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  xpReward: {
    type: Number,
    default: 50,
  },
  // AI Generation fields
  sourcePdf: {
    type: String, // PDF file path
  },
  aiGenerated: {
    type: Boolean,
    default: false,
  },
  generationStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
  aiConfidence: {
    type: Number,
    min: 0,
    max: 100,
  },
}, {
  timestamps: true,
})

// Index for faster queries
courseSchema.index({ domain: 1, difficulty: 1 })
courseSchema.index({ isVisible: 1 })
courseSchema.index({ 'enrolledUsers.user': 1 })

export default mongoose.model('Course', courseSchema)
