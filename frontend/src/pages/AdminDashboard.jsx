import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAllUsers, deleteUser } from '../store/slices/userSlice'
import {
  Users,
  LogOut,
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
  Eye,
  ChevronRight,
  Shield,
  TrendingUp,
  Star,
  Activity,
  User as UserIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { allUsers, loading } = useSelector((state) => state.user)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'xp', direction: 'desc' })
  const [showConfirmDelete, setShowConfirmDelete] = useState(null)

  useEffect(() => {
    dispatch(fetchAllUsers())
  }, [dispatch])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const handleDelete = (userId) => {
    dispatch(deleteUser(userId))
    setShowConfirmDelete(null)
  }

  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedUsers = useMemo(() => {
    let items = [...allUsers]
    if (searchTerm) {
      items = items.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    items.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
    return items
  }, [allUsers, searchTerm, sortConfig])

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Glass Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-3 rounded-2xl shadow-lg shadow-indigo-500/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Admin Terminal</h1>
              <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400" />
                System Oversight • {allUsers.length} Users Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 bg-slate-800/50 hover:bg-slate-800 border border-white/5 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
            >
              Student View
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              Terminate
            </button>
          </div>
        </motion.header>

        {/* Search & Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, email, or credentials..."
              className="w-full bg-slate-900/40 backdrop-blur-md border border-white/5 focus:border-indigo-500/50 rounded-2xl py-5 pl-16 pr-6 outline-none transition-all placeholder:text-slate-600 font-medium shadow-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Avg. Velocity</p>
              <h3 className="text-2xl font-black text-white mt-1">Lv. {Math.round(allUsers.reduce((acc, u) => acc + (u.level || 0), 0) / allUsers.length) || 0}</h3>
            </div>
            <TrendingUp className="w-10 h-10 text-indigo-400 opacity-50" />
          </div>
        </div>

        {/* User Database */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl"
        >
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              <Users className="w-6 h-6 text-indigo-400" />
              User Manifest
            </h2>
            <div className="flex gap-2">
              <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter border border-white/5">
                Real-time Sync
              </span>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-800/20">
                  <th className="px-8 py-5 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Cadet</th>
                  <th className="px-8 py-5 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em] cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => requestSort('level')}>
                    <div className="flex items-center gap-2">
                      Level <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em] cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => requestSort('xp')}>
                    <div className="flex items-center gap-2">
                      Experience <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em] cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => requestSort('streak')}>
                    <div className="flex items-center gap-2">
                      Streak <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-8 py-5 text-center text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode='popLayout'>
                  {sortedUsers.map((user, idx) => (
                    <motion.tr
                      key={user._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/50 transition-colors">
                            <UserIcon className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
                          </div>
                          <div>
                            <p className="font-bold text-white group-hover:text-indigo-300 transition-colors">{user.name}</p>
                            <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="inline-flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-white/5">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="font-black text-white text-sm">{user.level || 1}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-mono text-sm font-bold text-slate-400">
                          {user.xp?.toLocaleString() || 0} <span className="text-[10px] text-slate-600">PTS</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Activity className="w-3 h-3 text-orange-500" />
                          <span className="font-bold text-slate-300 text-sm">{user.streak || 0}D</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            className="p-3 bg-slate-800/50 hover:bg-slate-700 rounded-xl border border-white/5 text-slate-400 hover:text-white transition-all hover:scale-110"
                            title="Analyze Cadet"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowConfirmDelete(user)}
                            className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl border border-red-500/20 text-red-400 hover:text-red-300 transition-all hover:scale-110"
                            title="Decommission User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {loading && sortedUsers.length === 0 && (
              <div className="p-24 text-center">
                <div className="relative inline-block">
                  <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-400 animate-pulse" />
                </div>
                <p className="mt-6 text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Establishing secure link...</p>
              </div>
            )}

            {!loading && sortedUsers.length === 0 && (
              <div className="p-24 text-center">
                <Search className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-slate-400">Zero matches found in manifest</h3>
                <p className="text-slate-600 text-sm mt-2">Adjust your filtering parameters and try again.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer Attribution */}
        <footer className="text-center pb-12">
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]">
            Admin Privileges Active • v2.4.0 Interactive Engine
          </p>
        </footer>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmDelete(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-slate-900 border border-red-500/30 p-8 rounded-[2rem] max-w-sm w-full shadow-2xl"
            >
              <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-center text-white mb-2">Decommission User?</h3>
              <p className="text-slate-400 text-center text-sm leading-relaxed mb-8">
                Are you sure you want to terminate <span className="text-white font-bold">{showConfirmDelete.name}</span>?
                This action is permanent and cannot be reversed.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmDelete(null)}
                  className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold text-sm transition-all"
                >
                  Abort
                </button>
                <button
                  onClick={() => handleDelete(showConfirmDelete._id)}
                  className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-500/20 transition-all active:scale-95"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
