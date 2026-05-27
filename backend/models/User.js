import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  profilePicture: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastActiveDate: {
    type: Date,
    default: Date.now,
  },
  persona: {
    type: String,
    enum: ['Novice', 'Intermediate', 'Advanced', 'Master'],
    default: 'Novice',
  },
  skillScores: {
    dsa: { type: Number, default: 0 },
    dbms: { type: Number, default: 0 },
    os: { type: Number, default: 0 },
    cn: { type: Number, default: 0 },
    web: { type: Number, default: 0 },
  },
  weakAreas: [{
    type: String,
  }],
  badges: [{
    type: String,
  }],
  toolsUnlocked: [{
    toolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tool'
    },
    unlockedAt: {
      type: Date,
      default: Date.now
    },
    usesRemaining: {
      type: Number,
      default: -1 // -1 means unlimited
    }
  }],
  gameProgress: {
    currentZone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Zone'
    },
    totalBugsFixed: {
      type: Number,
      default: 0
    },
    perfectSolutions: {
      type: Number,
      default: 0
    },
    hintsUsed: {
      type: Number,
      default: 0
    },
    bossAttempts: {
      type: Number,
      default: 0
    }
  },
  completedChallenges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BugChallenge'
  }],
  defeatedBosses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BugChallenge'
  }],
  unlockedZones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zone'
  }],
  questsCompleted: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  assessmentTaken: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// Update persona based on level
userSchema.methods.updatePersona = function () {
  if (this.xp <= 100) this.persona = 'Novice'
  else if (this.xp <= 300) this.persona = 'Intermediate'
  else if (this.xp <= 700) this.persona = 'Advanced'
  else this.persona = 'Master'
}

// Update streak
userSchema.methods.updateStreak = function () {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const lastActive = new Date(this.lastActiveDate)
  lastActive.setHours(0, 0, 0, 0)

  const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    // Already active today
    return
  } else if (diffDays === 1) {
    // Consecutive day
    this.streak += 1
  } else {
    // Streak broken
    this.streak = 1
  }

  this.lastActiveDate = new Date()
}

// Add XP and update level
userSchema.methods.addXP = function (amount) {
  this.xp += amount
  const newLevel = Math.floor(this.xp / 100) + 1
  if (newLevel > this.level) {
    this.level = newLevel
    this.updatePersona()
  }
}

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model('User', userSchema)

