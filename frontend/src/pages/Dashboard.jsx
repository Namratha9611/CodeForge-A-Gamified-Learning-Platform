import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useGameStore from '../store/gameStore.js'
import { TrendingUp, BookOpen, Trophy, Target, Zap, Gamepad2, Sparkles, Star, Flame, BarChart3, Sword, Brain, Globe } from 'lucide-react'
import PersonaAvatar from '../components/PersonaAvatar'

export default function Dashboard() {
  const { user, token } = useGameStore()
  const [displayQuests, setDisplayQuests] = useState([])

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/adaptive/panel', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          const sections = data.sections || {}
          // Priority: weak practice → daily challenge → next level
          const all = [
            ...(sections.weakPractice || []),
            sections.dailyChallenge ? { ...sections.dailyChallenge, _aiGenerated: true } : null,
            sections.nextLevelChallenge || null,
          ].filter(Boolean)
          if (all.length > 0) { setDisplayQuests(all.slice(0, 2)); return }
        }
      } catch (err) {
        console.error('Adaptive panel failed, falling back', err)
      }
      // Fallback
      try {
        const res = await fetch('http://localhost:5000/api/quests', { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) {
          const data = await res.json()
          const xp = user?.xp || 0
          if (xp <= 100) {
            const easy = data.filter(q => q.difficulty === 'easy')
            if (easy.length) { setDisplayQuests(easy.slice(0, 2)); return }
          }
          setDisplayQuests(data.slice(0, 2))
        }
      } catch {}
    }
    if (token) fetchQuests()
  }, [user, token])


  const getPersonaStage = (xp) => {
    if (xp <= 100) return 'Novice'
    if (xp <= 300) return 'Intermediate'
    if (xp <= 700) return 'Advanced'
    return 'Master'
  }

  const skillScores = user?.skillScores || {
    dsa: 0,
    dbms: 0,
    os: 0,
    cn: 0,
    web: 0,
  }

  return (
    <div className="min-h-screen bg-[#F0F9FF] p-4 sm:p-6 lg:p-8 font-sans text-slate-900 relative overflow-hidden">
      {/* High Energy Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-amber-200/40 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] bg-emerald-200/40 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[100px] animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">

        {/* Header - 3D Card Style */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-3xl p-8 border-2 border-indigo-100 border-b-[6px] shadow-sm relative overflow-hidden gap-6 md:gap-0 transform transition-transform hover:scale-[1.01] duration-300">

          <div className="relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-wider mb-3 transform -rotate-2 border border-indigo-200 shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>Daily Overview</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight mb-2">
              Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">{user?.name || 'Explorer'}</span>!
            </h1>
            <p className="text-slate-500 font-bold text-lg max-w-lg">
              Your learning streak is on fire! Keep pushing your limits. 🔥
            </p>
          </div>

          <div className="relative z-10 w-full md:w-auto">
            <Link to="/dashboard/assessment" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black text-lg border-b-[6px] border-indigo-800 active:border-b-0 active:translate-y-1.5 transition-all hover:bg-indigo-500 w-full md:w-auto shadow-xl shadow-indigo-200">
              <span className="relative z-10 flex items-center gap-2">
                <Target className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500 ease-out" />
                Take Assessment
              </span>
            </Link>
          </div>
        </div>

        {/* Stats Grid - Vibrant & 3D */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* XP Card - Yellow */}
          <div className="bg-amber-100 rounded-3xl p-6 border-b-[6px] border-amber-300 hover:-translate-y-1 hover:brightness-105 transition-all duration-200 cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white rounded-2xl text-amber-500 shadow-sm border-2 border-amber-100">
                <Zap className="w-8 h-8 fill-current" />
              </div>
              <span className="text-xs font-black text-amber-700 uppercase tracking-wider bg-white/50 px-2 py-1 rounded-lg">XP</span>
            </div>
            <div className="space-y-1">
              <p className="text-5xl font-black text-amber-900 tracking-tight">{user?.xp || 0}</p>
              <div className="h-3 w-full bg-white/50 rounded-full overflow-hidden mt-2 border border-amber-200">
                <div className="h-full bg-amber-400 w-full rounded-full border-r-4 border-amber-500"></div>
              </div>
            </div>
          </div>

          {/* Level Card - Teal */}
          <div className="bg-emerald-100 rounded-3xl p-6 border-b-[6px] border-emerald-300 hover:-translate-y-1 hover:brightness-105 transition-all duration-200 cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white rounded-2xl text-emerald-500 shadow-sm border-2 border-emerald-100">
                <TrendingUp className="w-8 h-8" />
              </div>
              <span className="text-xs font-black text-emerald-700 uppercase tracking-wider bg-white/50 px-2 py-1 rounded-lg">Level</span>
            </div>
            <div className="space-y-1">
              <p className="text-5xl font-black text-emerald-900 tracking-tight">{user?.level || 1}</p>
              <p className="text-sm font-bold text-emerald-700/80">Rank: {getPersonaStage(user?.xp || 0)}</p>
            </div>
          </div>

          {/* Quests Card - Blue */}
          <div className="bg-sky-100 rounded-3xl p-6 border-b-[6px] border-sky-300 hover:-translate-y-1 hover:brightness-105 transition-all duration-200 cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white rounded-2xl text-sky-500 shadow-sm border-2 border-sky-100">
                <BookOpen className="w-8 h-8" />
              </div>
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider bg-white/50 px-2 py-1 rounded-lg">Quests</span>
            </div>
            <div className="space-y-1">
              <p className="text-5xl font-black text-sky-900 tracking-tight">{user?.questsCompleted || 0}</p>
              <p className="text-sm font-bold text-sky-700/80">Completed</p>
            </div>
          </div>

          {/* Streak Card - Purple */}
          <div className="bg-purple-100 rounded-3xl p-6 border-b-[6px] border-purple-300 hover:-translate-y-1 hover:brightness-105 transition-all duration-200 cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white rounded-2xl text-purple-500 shadow-sm border-2 border-purple-100">
                <Flame className="w-8 h-8 fill-current" />
              </div>
              <span className="text-xs font-black text-purple-700 uppercase tracking-wider bg-white/50 px-2 py-1 rounded-lg">Streak</span>
            </div>
            <div className="space-y-1">
              <p className="text-5xl font-black text-purple-900 tracking-tight">{user?.streak || 0}</p>
              <p className="text-sm font-bold text-purple-700/80">Days Active</p>
            </div>
          </div>
        </div>

        {/* Feature Sections Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

          {/* Main Content Area - Left 2/3 */}
          <div className="lg:col-span-2 space-y-8">

            {/* Persona Progress - Premium 3D Card */}
            <div className="relative bg-white rounded-[2.5rem] p-8 border-2 border-indigo-100 border-b-[6px] shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">

              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left">
                <div className="relative group shrink-0">
                  <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></div>
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center p-1 border-4 border-indigo-50 shadow-xl relative z-10 transform group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center overflow-hidden">
                      <div className="transform scale-110">
                        <PersonaAvatar persona={getPersonaStage(user?.xp || 0)} />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 bg-slate-900 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg border-2 border-white whitespace-nowrap">
                    Lvl {user?.level || 1}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">
                      {getPersonaStage(user?.xp || 0)}
                    </h2>
                    <p className="text-slate-500 font-bold">
                      You're {50 - (user?.level || 1)} levels away from reaching <span className="text-indigo-600 font-black">Master</span> status. Keep climbing! 🧗
                    </p>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200">
                    <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                      <span>Progress</span>
                      <span>Master Tier</span>
                    </div>
                    <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-sm relative overflow-hidden border-r-4 border-indigo-700"
                        style={{ width: `${((user?.level || 1) / 50) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Grid - Sticker Style */}
            <div className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-200 border-b-[6px] shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-teal-100 text-teal-600 rounded-2xl border-2 border-teal-200">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-800">Skill Breakdown</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                {Object.entries(skillScores).map(([skill, score]) => (
                  <div key={skill} className="group relative flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-4 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 ease-out">
                      <svg className="w-full h-full -rotate-90 drop-shadow-md">
                        <circle cx="50%" cy="50%" r="42%" stroke="#F1F5F9" strokeWidth="10" fill="transparent" />
                        <circle
                          cx="50%" cy="50%" r="42%"
                          stroke="currentColor"
                          strokeWidth="10"
                          fill="transparent"
                          strokeDasharray={264}
                          strokeDashoffset={264 - (264 * score) / 100}
                          className={`${score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-rose-500'} transition-all duration-1000 ease-out`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-black text-slate-700">{score}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-slate-50 border-2 border-slate-200 text-slate-600 text-xs font-black uppercase rounded-xl group-hover:bg-indigo-50 group-hover:border-indigo-200 group-hover:text-indigo-600 transition-colors">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>

              {user?.weakAreas && user.weakAreas.length > 0 && (
                <div className="mt-8 p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl flex items-start gap-3">
                  <Target className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-sm font-bold text-rose-800">
                    <span className="block font-black mb-1 uppercase tracking-wide">Focus Needed</span>
                    Review your weak areas in: {user.weakAreas.join(', ')} to boost your overall score.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar - Right 1/3 */}
          <div className="space-y-6">

            {/* Quick Actions - Pop Style */}
            <div className="grid grid-cols-1 gap-4">
              {/* Game Modes Links */}



            </div>



            {/* Recommended - 3D List */}
            <div className="bg-white rounded-[2.5rem] p-6 border-2 border-slate-200 border-b-[6px] shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl border-2 border-indigo-200">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-800">Recommended</h3>
              </div>

              <div className="flex-1 space-y-4">
                {displayQuests.length > 0 ? (
                  displayQuests.map((quest) => (
                    <Link
                      key={quest._id}
                      to={`/dashboard/quests/${quest._id}`}
                      className="group block p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm hover:border-indigo-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-lg group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                          {quest.domain}
                        </span>
                        <Star className="w-4 h-4 text-slate-300 group-hover:text-amber-400 transition-colors" />
                      </div>
                      <h4 className="font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-indigo-700">{quest.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${quest.difficulty === 'Easy' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        <span className="text-xs font-bold text-slate-500">{quest.difficulty}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl animate-pulse">
                    <p className="font-bold">Loading recommendations...</p>
                  </div>
                )}
              </div>

              <Link to="/dashboard/quests" className="mt-6 block w-full py-4 rounded-xl bg-slate-100 text-slate-600 font-black text-center border-b-4 border-slate-200 hover:bg-slate-200 hover:border-slate-300 active:border-b-0 active:translate-y-1 transition-all">
                View All Quests
              </Link>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
