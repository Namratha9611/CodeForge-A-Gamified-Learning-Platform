import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  xpRequired: {
    type: Number,
    required: true,
    min: 0
  },
  effectType: {
    type: String,
    enum: [
      'syntax-highlighter',    // Highlights suspicious lines
      'hint-level-1',          // One-line hint
      'auto-scanner',          // Shows potential error location
      'debugger-view',         // Shows variable states
      'performance-analyzer',  // Warns about inefficient code
      'error-explainer',       // Explains what the error means
      'step-by-step',          // Provides step-by-step solution
      'code-completion'        // Auto-completes partial fixes
    ],
    required: true
  },
  toolCategory: {
    type: String,
    enum: ['analyzer', 'helper', 'debugger', 'optimizer'],
    required: true
  },
  powerLevel: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },
  targetBugTypes: [{
    type: String
    // Which bug types this tool is effective against
  }],
  icon: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  uses: {
    type: Number,
    default: -1 // -1 means unlimited uses
  },
  cooldown: {
    type: Number, // in seconds
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Tool', toolSchema);
