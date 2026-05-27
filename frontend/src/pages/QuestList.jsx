import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchQuests, clearError } from '../store/slices/questSlice'
import useGameStore from '../store/gameStore'
import { BookOpen, Code, Database, Globe, Server, Filter, Search, Zap, Star, Sparkles, Loader } from 'lucide-react'
import api from '../utils/api'

const domainIcons = {
  dsa: Code,
  dbms: Database,
  web: Globe,
}

const difficultyStyles = {
  easy: {
    border: 'border-emerald-300',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    icon: 'text-emerald-500',
    dot: 'bg-emerald-400'
  },
  medium: {
    border: 'border-amber-300',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    icon: 'text-amber-500',
    dot: 'bg-amber-400'
  },
  hard: {
    border: 'border-rose-300',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    icon: 'text-rose-500',
    dot: 'bg-rose-400'
  },
}

export default function QuestList() {
  const { user } = useGameStore()
  const dispatch = useDispatch()
  const { quests, loading, error } = useSelector((state) => state.quest)
  const [filters, setFilters] = useState({
    domain: '',
    difficulty: '',
  })
  const [completedQuests, setCompletedQuests] = useState(new Set())

  useEffect(() => {
    dispatch(clearError())
    dispatch(fetchQuests(filters))

    // Fetch user's completed quests
    const fetchCompletedQuests = async () => {
      try {
        console.log('Fetching completed quests...')
        const response = await api.get('/quests/progress/all')
        console.log('Progress response:', response.data)
        const completed = new Set(
          response.data
            .filter(p => p.status === 'completed')
            .map(p => p.quest)
        )
        console.log('Completed quest IDs:', Array.from(completed))
        setCompletedQuests(completed)
      } catch (error) {
        console.error('Failed to fetch completed quests:', error)
      }
    }
    fetchCompletedQuests()
  }, [dispatch, filters])

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
  }


  return (
    <div className="min-h-screen bg-[#F0F9FF] p-4 sm:p-6 lg:p-8 font-sans text-slate-900 relative overflow-hidden">
      {/* High Energy Background - Matching Dashboard */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-amber-200/40 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] bg-emerald-200/40 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[100px] animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">

        {/* Header - 3D Banner Style */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-[2rem] p-8 border-2 border-indigo-100 border-b-[6px] shadow-sm relative overflow-hidden gap-6 md:gap-0 transform transition-transform hover:scale-[1.01] duration-300">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]"></div>

          <div className="relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-black uppercase tracking-wider mb-3 border-2 border-sky-200 shadow-sm transform -rotate-2">
              <BookOpen className="w-3 h-3" />
              <span>Adventure awaits</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-2">
              Quest <span className="text-indigo-600">Library</span>
            </h1>
            <p className="text-slate-500 font-bold text-lg max-w-lg">
              Choose your challenge and level up your skills! 🚀
            </p>
          </div>
        </div>

        {/* Filters Section - Chunky Style */}
        <div className="bg-white rounded-[2rem] p-6 border-2 border-slate-200 border-b-[6px] shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600 border-2 border-indigo-200">
              <Filter className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-800">Filter Quests</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Difficulty</label>
              <div className="relative">
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full appearance-none bg-slate-50 border-2 border-slate-200 text-slate-700 font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 focus:bg-white transition-colors cursor-pointer"
                >
                  <option value="">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-full text-rose-500">
              <Zap className="w-5 h-5" />
            </div>
            <p className="font-bold text-rose-700">{error}</p>
          </div>
        )}

        {/* Quest Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-500"></div>
            <p className="mt-4 font-bold text-slate-400">Loading your training...</p>
          </div>
        ) : !quests || quests.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-300">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-700 mb-2">No quests found</h3>
            <p className="text-slate-500 font-medium">Try adjusting your filters to find more challenges.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quests.map((quest) => {
              const Icon = domainIcons[quest.domain] || BookOpen
              const style = difficultyStyles[quest.difficulty] || difficultyStyles.medium

              return (
                <Link
                  key={quest._id}
                  to={`/dashboard/quests/${quest._id}`}
                  className={`group bg-white rounded-[2rem] p-6 border-2 ${completedQuests.has(quest._id)
                    ? 'bg-green-50 border-green-300 border-b-[6px]'
                    : `${style.border} border-b-[6px]`
                    } shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 ${completedQuests.has(quest._id) ? 'bg-green-100' : style.bg
                    } rounded-bl-[4rem] -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-3 bg-slate-50 rounded-2xl border-2 border-slate-100 group-hover:bg-white group-hover:border-indigo-100 transition-colors">
                          <Icon className="w-6 h-6 text-slate-500 group-hover:text-indigo-500 transition-colors" />
                        </div>
                        {completedQuests.has(quest._id) && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border-2 ${style.border} ${style.bg} ${style.text}`}>
                        {quest.difficulty}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight group-hover:text-indigo-700 transition-colors min-h-[3.5rem] line-clamp-2">
                      {quest.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{quest.domain}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Zap className="w-3 h-3 fill-current" />
                        <span className="text-xs font-black">{quest.xpReward || 10} XP</span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="w-full py-3 rounded-xl bg-slate-100 text-slate-500 font-black text-center border-b-4 border-slate-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-800 transition-all duration-300 group-active:border-b-0 group-active:translate-y-1">
                        Start Quest
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
