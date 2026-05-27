import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import questRoutes from './routes/quests.js'
import leaderboardRoutes from './routes/leaderboard.js'
import assessmentRoutes from './routes/assessment.js'

import memoryGameRoutes from './routes/memoryGame.js'
import courseRoutes from './routes/courses.js'
import adminRoutes from './routes/admin.js'
import gameRoutes from './routes/game.js'
import adaptiveRoutes from './routes/adaptive.js'
import axios from 'axios'

dotenv.config()

import { createServer } from 'http'
import { Server } from 'socket.io'

// ... (keep previous imports)

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"]
  }
})

const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Socket.io Logic
let lobby = [] // Queue of socket IDs waiting for a match

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join_lobby', (userData) => {
    // Add to lobby if not already there
    // userData can be object { name: "..." } or null
    const userName = userData?.name || "Unknown Player"

    // Check if socket is already in lobby (by checking ids)
    const isAlreadyInLobby = lobby.some(user => user.id === socket.id)

    if (!isAlreadyInLobby) {
      lobby.push({ id: socket.id, name: userName })
      console.log(`User ${userName} (${socket.id}) joined lobby. Total: ${lobby.length}`)

      // Try to match
      if (lobby.length >= 2) {
        const player1 = lobby.shift()
        const player2 = lobby.shift()
        const roomId = `match_${player1.id}_${player2.id}`

        // Join both to room
        io.to(player1.id).socketsJoin(roomId)
        io.to(player2.id).socketsJoin(roomId)

        // Notify both
        io.to(player1.id).emit('match_found', {
          opponentId: player2.id,
          opponentName: player2.name,
          roomId,
          role: 'player1'
        })
        io.to(player2.id).emit('match_found', {
          opponentId: player1.id,
          opponentName: player1.name,
          roomId,
          role: 'player2'
        })

        console.log(`Match started: ${player1.name} vs ${player2.name} in ${roomId}`)
      }
    }
  })

  socket.on('code_update', ({ roomId, progress, code, length }) => {
    // Broadcast progress to everyone else in the room (the opponent)
    socket.to(roomId).emit('opponent_progress', { progress, length })
  })

  socket.on('game_won', ({ roomId }) => {
    socket.to(roomId).emit('game_over', { result: 'defeat' })
    io.to(socket.id).emit('game_over', { result: 'victory' })
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
    lobby = lobby.filter(user => user.id !== socket.id)
    // In a real app, handle disconnect during match (auto-win for other)
  })
})

// Health check (before MongoDB check)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  })
})

// Add MongoDB connection status middleware (before routes)
app.use((req, res, next) => {
  // Skip health check
  if (req.path === '/api/health') {
    return next()
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database connection unavailable. Please check if MongoDB is running.',
      error: 'MongoDB not connected'
    })
  }
  next()
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/quests', questRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/assessment', assessmentRoutes)

app.use('/api/memory-game', memoryGameRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/game', gameRoutes)
app.use('/api/adaptive', adaptiveRoutes)

// ... (MongoDB Connection)

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learning-platform'

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB')
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message)
    httpServer.listen(PORT, () => {
      console.log(`⚠️  Server running on port ${PORT} but MongoDB is not connected`)
    })
  })

export default app

