import express from 'express'
import { authenticate } from '../middleware/auth.js'
import User from '../models/User.js'
import Quest from '../models/Quest.js'
import Progress from '../models/Progress.js'

import axios from 'axios'

const router = express.Router()

// Get all users (admin only)
router.get('/', authenticate, async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (error) {
    console.error('Fetch all users error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    console.error('Profile fetch error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, profilePicture } = req.body
    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (name) user.name = name
    if (profilePicture !== undefined) user.profilePicture = profilePicture

    await user.save()

    // Return user without password
    const userResponse = user.toObject()
    delete userResponse.password

    res.json(userResponse)
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user progress
router.get('/progress', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const questsCompleted = await Progress.countDocuments({
      user: req.userId,
      status: 'completed',
    })

    // Get recommended quests from AI service
    let recommendedQuests = []
    let aiReasoning = ""
    try {
      const aiResponse = await axios.post('http://localhost:8000/api/recommend', {
        userId: req.userId.toString(),
        skillScores: user.skillScores,
        weakAreas: user.weakAreas,
        persona: user.persona,
      })
      
      const suggestedDifficulty = aiResponse.data.difficulty || 'easy';
      const focusDomains = aiResponse.data.focusDomains || ['dsa', 'web'];
      aiReasoning = aiResponse.data.reason || "";
      
        // Get IDs of quests the user has already completed
        const userProgress = await Progress.find({ user: req.userId, status: 'completed' });
        const completedQuestIds = userProgress.map(p => p.quest.toString());
        
        // Generate a new quest using the AI service specifically tailored to their level
        let generatedQuests = [];
        let attempts = 0;
        
        // Try up to 5 times to get 2 unique, uncompleted quests
        while (generatedQuests.length < 2 && attempts < 5) {
          attempts++;
          const domainToUse = focusDomains[generatedQuests.length % focusDomains.length] || 'dsa';
          
          const generateRes = await axios.post('http://localhost:8000/api/generate-quest', {
            domain: domainToUse,
            difficulty: suggestedDifficulty
          });
          
          const newQuestData = generateRes.data;
          
          // Check if we already generated this specific quest template to avoid duplicates
          let existingQuest = await Quest.findOne({ title: newQuestData.title, difficulty: suggestedDifficulty });
          
          if (!existingQuest) {
            existingQuest = await Quest.create({
              ...newQuestData,
              isActive: true,
              createdAt: new Date()
            });
          }
          
          // Only add if user hasn't completed it AND it's not already in our generated array
          const isCompleted = completedQuestIds.includes(existingQuest._id.toString());
          const isDuplicateInArray = generatedQuests.some(q => q._id.toString() === existingQuest._id.toString());
          
          if (!isCompleted && !isDuplicateInArray) {
            generatedQuests.push(existingQuest);
          }
        }
        
        // If we still don't have 2 quests (maybe we ran out of AI templates for this tier),
        // fallback to finding ANY uncompleted quests in the database for their difficulty
        if (generatedQuests.length < 2) {
          const fallbackQuests = await Quest.find({
            difficulty: suggestedDifficulty,
            _id: { $nin: [...completedQuestIds, ...generatedQuests.map(q => q._id)] }
          }).limit(2 - generatedQuests.length);
          generatedQuests = [...generatedQuests, ...fallbackQuests];
        }
      
      recommendedQuests = generatedQuests;
      
      // If generation somehow fails or returns empty, fallback to existing DB quests
      if (recommendedQuests.length === 0) {
        recommendedQuests = await Quest.find({ difficulty: suggestedDifficulty }).limit(2)
      }
    } catch (error) {
      console.error('AI recommendation error:', error)
      // Fallback: get easy quests
      recommendedQuests = await Quest.find({ difficulty: 'easy' }).limit(3)
    }

    res.json({
      skillScores: user.skillScores,
      weakAreas: user.weakAreas,
      questsCompleted,
      recommendedQuests,
      badges: user.badges,
    })
  } catch (error) {
    console.error('Progress fetch error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Submit skill assessment
router.post('/assessment', authenticate, async (req, res) => {
  try {
    const { scores } = req.body
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update skill scores
    user.skillScores = { ...user.skillScores, ...scores }

    // Identify weak areas (scores < 60)
    user.weakAreas = Object.entries(scores)
      .filter(([_, score]) => score < 60)
      .map(([domain, _]) => domain)

    user.assessmentTaken = true;
    await user.save()

    // Get AI recommendations
    let recommendedQuests = []
    try {
      const aiResponse = await axios.post('http://localhost:8000/api/analyze-weakness', {
        skillScores: scores,
      })
      if (aiResponse.data.focusDomains) {
        recommendedQuests = await Quest.find({
          domain: { $in: aiResponse.data.focusDomains },
          difficulty: 'easy',
        }).limit(5)
      }
    } catch (error) {
      console.error('AI analysis error:', error)
    }

    res.json({
      skillScores: user.skillScores,
      weakAreas: user.weakAreas,
      recommendedQuests,
    })
  } catch (error) {
    console.error('Assessment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})




// Delete user (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const admin = await User.findById(req.userId)
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }

    const userToDelete = await User.findById(req.params.id)
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Prevent admin from deleting themselves
    if (userToDelete._id.toString() === admin._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete yourself' })
    }

    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router

