import { Routes, Route, Navigate } from 'react-router-dom'
import useGameStore from './store/gameStore.js'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SkillAssessment from './pages/SkillAssessment'
import QuestList from './pages/QuestList'
import QuestDetail from './pages/QuestDetail'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import MemoryGame from './components/MemoryGame'
import Layout from './components/Layout'
import AdminDashboard from './pages/AdminDashboard'
import AddCourse from './pages/AddCourse'
import CourseListAdmin from './pages/CourseListAdmin'
import ProtectedRoute from './components/ProtectedRoute'

// Games imports
import Games from './pages/Games'

import CodeArena from './pages/CodeArena'
import WorldMap from './pages/bug/WorldMap'
import BugList from './pages/bug/BugList'
import BugChallenge from './pages/bug/BugChallenge'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes starting at /dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="skill-assessment" element={<SkillAssessment />} />

        <Route path="arena" element={<CodeArena />} />
        <Route path="quests" element={<QuestList />} />
        <Route path="quests/:id" element={<QuestDetail />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="memory-game" element={<MemoryGame />} />

        {/* Games Routes */}
        <Route path="games" element={<Games />} />
        <Route path="bug-hunter" element={<WorldMap />} />
        <Route path="bug-hunter/zone/:zoneId" element={<BugList />} />
        <Route path="bug-hunter/play/:bugId" element={<BugChallenge />} />

        {/* Admin Routes (Nested within Layout) */}
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/add-course" element={<AddCourse />} />
        <Route path="admin/courses" element={<CourseListAdmin />} />
      </Route>

      {/* Legacy/Cleanup Routes - redirects or 404s can be handled here */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

