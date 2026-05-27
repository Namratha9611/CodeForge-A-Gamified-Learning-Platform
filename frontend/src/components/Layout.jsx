import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import useGameStore from '../store/gameStore.js'
import { Trophy, Home, BookOpen, User, LogOut, Zap, Gamepad2 } from 'lucide-react'

export default function Layout() {
  const navigate = useNavigate()
  const { user, logout } = useGameStore()

  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  // Check if current page is an admin page
  const isAdminPage = location.pathname.startsWith('/dashboard/admin')

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-lg border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4 sm:space-x-8 overflow-x-auto no-scrollbar mask-gradient w-full md:w-auto pb-1 md:pb-0">
              <Link to="/dashboard" className="flex items-center space-x-2 group shrink-0">
                <span className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:scale-105 transition-transform duration-300 ease-out inline-block">🎮 CodeForge</span>
              </Link>
              {!isAdminPage && (
                <div className="flex items-center space-x-3">
                  <Link to="/dashboard" className={`flex items-center justify-center space-x-2 w-[160px] h-[56px] rounded-xl transition-all duration-300 group hover:-translate-y-0.5 shrink-0 ${isActive('/dashboard') ? 'bg-indigo-100 border-2 border-indigo-500 shadow-md scale-105' : 'bg-white border-2 border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300'}`}>
                    <div className={`p-1.5 rounded-lg shadow-sm transition-colors ${isActive('/dashboard') ? 'bg-indigo-200' : 'bg-slate-50 group-hover:bg-indigo-50'}`}>
                      <Home className={`w-4 h-4 ${isActive('/dashboard') ? 'text-indigo-800' : 'text-slate-500 group-hover:text-indigo-600'}`} />
                    </div>
                    <span className={`font-bold ${isActive('/dashboard') ? 'text-indigo-900' : 'text-slate-700 group-hover:text-indigo-700'}`}>Dashboard</span>
                  </Link>

                  <Link to="/dashboard/quests" className={`flex items-center justify-center space-x-2 w-[160px] h-[56px] rounded-xl transition-all duration-300 group hover:-translate-y-0.5 shrink-0 ${isActive('/dashboard/quests') ? 'bg-indigo-100 border-2 border-indigo-500 shadow-md scale-105' : 'bg-white border-2 border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300'}`}>
                    <div className={`p-1.5 rounded-lg shadow-sm transition-colors ${isActive('/dashboard/quests') ? 'bg-indigo-200' : 'bg-slate-50 group-hover:bg-indigo-50'}`}>
                      <BookOpen className={`w-4 h-4 ${isActive('/dashboard/quests') ? 'text-indigo-800' : 'text-slate-500 group-hover:text-indigo-600'}`} />
                    </div>
                    <span className={`font-bold ${isActive('/dashboard/quests') ? 'text-indigo-900' : 'text-slate-700 group-hover:text-indigo-700'}`}>Quests</span>
                  </Link>

                  <Link to="/dashboard/games" className={`flex items-center justify-center space-x-2 w-[160px] h-[56px] rounded-xl transition-all duration-300 group hover:-translate-y-0.5 shrink-0 ${isActive('/dashboard/games') ? 'bg-indigo-100 border-2 border-indigo-500 shadow-md scale-105' : 'bg-white border-2 border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300'}`}>
                    <div className={`p-1.5 rounded-lg shadow-sm transition-colors ${isActive('/dashboard/games') ? 'bg-indigo-200' : 'bg-slate-50 group-hover:bg-indigo-50'}`}>
                      <Gamepad2 className={`w-4 h-4 ${isActive('/dashboard/games') ? 'text-indigo-800' : 'text-slate-500 group-hover:text-indigo-600'}`} />
                    </div>
                    <span className={`font-bold ${isActive('/dashboard/games') ? 'text-indigo-900' : 'text-slate-700 group-hover:text-indigo-700'}`}>Games</span>
                  </Link>



                  <Link to="/dashboard/leaderboard" className={`flex items-center justify-center space-x-2 w-[160px] h-[56px] rounded-xl transition-all duration-300 group hover:-translate-y-0.5 shrink-0 ${isActive('/dashboard/leaderboard') ? 'bg-indigo-100 border-2 border-indigo-500 shadow-md scale-105' : 'bg-white border-2 border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300'}`}>
                    <div className={`p-1.5 rounded-lg shadow-sm transition-colors ${isActive('/dashboard/leaderboard') ? 'bg-indigo-200' : 'bg-slate-50 group-hover:bg-indigo-50'}`}>
                      <Trophy className={`w-4 h-4 ${isActive('/dashboard/leaderboard') ? 'text-indigo-800' : 'text-slate-500 group-hover:text-indigo-600'}`} />
                    </div>
                    <span className={`font-bold ${isActive('/dashboard/leaderboard') ? 'text-indigo-900' : 'text-slate-700 group-hover:text-indigo-700'}`}>Leaderboard</span>
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {/* User info removed from navbar as requested */}
              <Link to="/dashboard/profile" className="p-2 rounded-xl text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 hover:scale-110 border border-transparent hover:border-indigo-100">
                <User className="w-5 h-5" />
              </Link>
              <button onClick={handleLogout} className="p-2 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all duration-300 hover:scale-110 border border-transparent hover:border-red-100">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
