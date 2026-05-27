import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';
import Zone from '../models/Zone.js';
import BugChallenge from '../models/BugChallenge.js';
import Tool from '../models/Tool.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// Create Zone
router.post('/zone', [
  body('name').trim().notEmpty().withMessage('Zone name is required'),
  body('description').trim().notEmpty().withMessage('Zone description is required'),
  body('order').isInt({ min: 1 }).withMessage('Order must be a positive integer'),
  body('icon').trim().notEmpty().withMessage('Icon is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, description, order, icon, isLockedByDefault, difficulty, theme } = req.body;

    // Check if order already exists
    const existingZone = await Zone.findOne({ order });
    if (existingZone) {
      return res.status(400).json({ message: 'Zone order already exists' });
    }

    const zone = new Zone({
      name,
      description,
      order,
      icon,
      isLockedByDefault,
      difficulty,
      theme
    });

    await zone.save();
    res.status(201).json({ message: 'Zone created successfully', zone });
  } catch (error) {
    console.error('Create zone error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Bug Challenge
router.post('/bug', [
  body('zoneId').notEmpty().withMessage('Zone ID is required'),
  body('title').trim().notEmpty().withMessage('Bug title is required'),
  body('description').trim().notEmpty().withMessage('Bug description is required'),
  body('brokenCode').trim().notEmpty().withMessage('Broken code is required'),
  body('correctCode').trim().notEmpty().withMessage('Correct code is required'),
  body('difficulty').isIn(['easy', 'medium', 'hard', 'expert']).withMessage('Invalid difficulty'),
  body('xpReward').isInt({ min: 10 }).withMessage('XP reward must be at least 10'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { zoneId, title, description, brokenCode, correctCode, difficulty, xpReward, boss, hints, category, language, order } = req.body;

    // Verify zone exists
    const zone = await Zone.findById(zoneId);
    if (!zone) {
      return res.status(400).json({ message: 'Zone not found' });
    }

    // Check if order already exists for this zone
    const existingBug = await BugChallenge.findOne({ zoneId, order });
    if (existingBug) {
      return res.status(400).json({ message: 'Bug order already exists for this zone' });
    }

    const bugChallenge = new BugChallenge({
      zoneId,
      title,
      description,
      brokenCode,
      correctCode,
      difficulty,
      xpReward,
      boss,
      hints,
      category,
      language,
      order
    });

    await bugChallenge.save();
    res.status(201).json({ message: 'Bug challenge created successfully', bugChallenge });
  } catch (error) {
    console.error('Create bug challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Tool
router.post('/tool', [
  body('name').trim().notEmpty().withMessage('Tool name is required'),
  body('description').trim().notEmpty().withMessage('Tool description is required'),
  body('xpRequired').isInt({ min: 0 }).withMessage('XP required must be non-negative'),
  body('effectType').isIn(['hint', 'auto-fix', 'syntax-check', 'debugger', 'documentation', 'time-freeze']).withMessage('Invalid effect type'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, description, xpRequired, effectType, icon, rarity, uses, cooldown } = req.body;

    const tool = new Tool({
      name,
      description,
      xpRequired,
      effectType,
      icon,
      rarity,
      uses,
      cooldown
    });

    await tool.save();
    res.status(201).json({ message: 'Tool created successfully', tool });
  } catch (error) {
    console.error('Create tool error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all zones
router.get('/zones', async (req, res) => {
  try {
    const zones = await Zone.find().sort({ order: 1 });
    res.json({ zones });
  } catch (error) {
    console.error('Get zones error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bugs
router.get('/bug-list', async (req, res) => {
  try {
    const bugs = await BugChallenge.find()
      .populate('zoneId', 'name')
      .sort({ zoneId: 1, order: 1 });
    res.json({ bugs });
  } catch (error) {
    console.error('Get bugs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all tools
router.get('/tools', async (req, res) => {
  try {
    const tools = await Tool.find().sort({ xpRequired: 1 });
    res.json({ tools });
  } catch (error) {
    console.error('Get tools error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Zone
router.put('/zone/:id', async (req, res) => {
  try {
    const zone = await Zone.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }
    
    res.json({ message: 'Zone updated successfully', zone });
  } catch (error) {
    console.error('Update zone error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Bug Challenge
router.put('/bug/:id', async (req, res) => {
  try {
    const bug = await BugChallenge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!bug) {
      return res.status(404).json({ message: 'Bug challenge not found' });
    }
    
    res.json({ message: 'Bug challenge updated successfully', bug });
  } catch (error) {
    console.error('Update bug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Tool
router.put('/tool/:id', async (req, res) => {
  try {
    const tool = await Tool.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    res.json({ message: 'Tool updated successfully', tool });
  } catch (error) {
    console.error('Update tool error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Zone
router.delete('/zone/:id', async (req, res) => {
  try {
    const zone = await Zone.findByIdAndDelete(req.params.id);
    
    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }
    
    // Also delete all bug challenges in this zone
    await BugChallenge.deleteMany({ zoneId: req.params.id });
    
    res.json({ message: 'Zone and associated bugs deleted successfully' });
  } catch (error) {
    console.error('Delete zone error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Bug Challenge
router.delete('/bug/:id', async (req, res) => {
  try {
    const bug = await BugChallenge.findByIdAndDelete(req.params.id);
    
    if (!bug) {
      return res.status(404).json({ message: 'Bug challenge not found' });
    }
    
    res.json({ message: 'Bug challenge deleted successfully' });
  } catch (error) {
    console.error('Delete bug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Tool
router.delete('/tool/:id', async (req, res) => {
  try {
    const tool = await Tool.findByIdAndDelete(req.params.id);
    
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    res.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    console.error('Delete tool error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
