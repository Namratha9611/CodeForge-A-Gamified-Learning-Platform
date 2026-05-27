import mongoose from 'mongoose';

const zoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true,
    unique: true
  },
  icon: {
    type: String,
    required: true
  },
  isLockedByDefault: {
    type: Boolean,
    default: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  theme: {
    type: String,
    default: 'default'
  },
  // Enhanced fields for RPG-style structure
  worldType: {
    type: String,
    enum: ['basics', 'loops', 'arrays', 'functions', 'oop', 'algorithms'],
    required: true
  },
  concepts: [{
    type: String
  }],
  requiredXP: {
    type: Number,
    default: 0
  },
  hasBoss: {
    type: Boolean,
    default: false
  },
  bossBugId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BugChallenge'
  }
}, {
  timestamps: true
});

export default mongoose.model('Zone', zoneSchema);
