import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserProfile, fetchUserProgress } from '../store/slices/userSlice'
import PersonaAvatar from '../components/PersonaAvatar'
import { Award, Calendar, Target, TrendingUp, Zap, Star, Mail, Shield, Sword, Activity, Cpu } from 'lucide-react'
import { motion } from 'framer-motion'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

export default function Profile() {
  const dispatch = useDispatch()
  const { profile } = useSelector((state) => state.user)
  const { progress } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchUserProfile())
    dispatch(fetchUserProgress())
  }, [dispatch])

  // Helper for Radar Data
  const skillData = progress?.skillScores ? [
    { subject: 'DSA', A: progress.skillScores.dsa || 0, fullMark: 100 },
    { subject: 'DBMS', A: progress.skillScores.dbms || 0, fullMark: 100 },
    { subject: 'OS', A: progress.skillScores.os || 0, fullMark: 100 },
    { subject: 'Network', A: progress.skillScores.cn || 0, fullMark: 100 },
    { subject: 'Web', A: progress.skillScores.web || 0, fullMark: 100 },
  ] : []



  const getPersonaStage = (level) => {
    if (level < 5) return 'Novice'
    if (level < 15) return 'Explorer'
    if (level < 30) return 'Prodigy'
    return 'Master'
  }

  const xpForNextLevel = (level) => level * 100
  const xpProgress = profile ? ((profile.xp % xpForNextLevel(profile.level)) / xpForNextLevel(profile.level)) * 100 : 0

  // We need to actually implement the API call. Let's do it inside the component for now.
  const updateProfilePic = async (base64) => {
    try {
      const token = localStorage.getItem('token')
      await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profilePicture: base64 })
      })
      dispatch(fetchUserProfile()) // Reload profile
    } catch (err) {
      console.error("Failed to update profile", err)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 font-sans text-white relative overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10 animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* Hero Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>

              <div className="w-40 h-40 bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-700 group-hover:border-blue-500 transition-colors shadow-2xl relative overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => updateProfilePic(reader.result)
                      reader.readAsDataURL(file)
                    }
                  }}
                />

                {profile?.profilePicture ? (
                  <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="transform scale-125 z-10 pointer-events-none">
                    <PersonaAvatar persona={getPersonaStage(profile?.level || 1)} />
                  </div>
                )}

                {/* Overlay for Edit Hint */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                  <span className="text-white font-bold text-xs uppercase">Change Photo</span>
                </div>
              </div>

              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 text-blue-400 text-xs font-black px-4 py-1 rounded-full border border-blue-500/50 shadow-lg whitespace-nowrap uppercase tracking-wider">
                Rank: {getPersonaStage(profile?.level || 1)}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight mb-2">
                  {profile?.name || 'Explorer'}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-4 text-sm font-medium text-slate-400 bg-slate-800/50 inline-flex px-4 py-2 rounded-full border border-slate-700/50 backdrop-blur-sm">
                  <Mail className="w-4 h-4 text-blue-400" />
                  {profile?.email}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="px-5 py-2.5 bg-blue-500/10 text-blue-300 rounded-xl font-bold border border-blue-500/20 flex items-center gap-3">
                  <Star className="w-5 h-5 fill-current" />
                  LVL {profile?.level || 1}
                </div>
                <div className="px-5 py-2.5 bg-purple-500/10 text-purple-300 rounded-xl font-bold border border-purple-500/20 flex items-center gap-3">
                  <Zap className="w-5 h-5 fill-current" />
                  {profile?.xp || 0} XP
                </div>
                <div className="px-5 py-2.5 bg-orange-500/10 text-orange-300 rounded-xl font-bold border border-orange-500/20 flex items-center gap-3">
                  <Activity className="w-5 h-5" />
                  {profile?.streak || 0} Day Streak
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Stats & Radar */}
          <div className="lg:col-span-1 space-y-8">

            {/* Skill Matrix (Radar Chart) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-800 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Skill Matrix</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Performance Analysis</p>
                </div>
              </div>

              <div className="h-[300px] w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Skills"
                      dataKey="A"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>


          </div>

          {/* Right Column: Progress & Badges */}
          <div className="lg:col-span-2 space-y-8">

            {/* Level Progress Bar */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 group-hover:bg-indigo-500/20 transition-colors"></div>

              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">Level Progress</h2>
                  <p className="text-slate-400">Keep completing quests to evolve!</p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{Math.round(xpProgress)}%</span>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Next Level: {xpForNextLevel(profile?.level || 1)} XP</p>
                </div>
              </div>

              <div className="w-full h-6 bg-slate-800 rounded-full overflow-hidden shadow-inner relative">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full shadow-lg relative"
                  style={{ width: `${xpProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </motion.div>

            {/* Badges Collection */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-800 shadow-xl min-h-[300px]"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-500/20 text-yellow-500 rounded-xl">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Hall of Glory</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Earned Achievements</p>
                </div>
              </div>

              {progress?.badges && progress.badges.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {progress.badges.map((badge, idx) => (
                    <div key={idx} className="group relative bg-slate-800/50 p-4 rounded-2xl border border-slate-700 hover:border-yellow-500/50 transition-all hover:-translate-y-1">
                      <div className="absolute inset-0 bg-yellow-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-yellow-900/30 flex items-center justify-center border border-yellow-700/50 group-hover:scale-110 transition-transform">
                          <Award className="w-6 h-6 text-yellow-500" />
                        </div>
                        <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{badge}</span>
                      </div>
                    </div>
                  ))}
                  {/* Empty slots placeholders */}
                  {[...Array(Math.max(0, 4 - progress.badges.length))].map((_, i) => (
                    <div key={`empty-${i}`} className="bg-slate-800/20 p-4 rounded-2xl border border-slate-800 border-dashed flex items-center justify-center opacity-50">
                      <LockIcon className="w-6 h-6 text-slate-600" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                  <Shield className="w-12 h-12 mb-3 opacity-20" />
                  <p className="font-bold">No Badges Yet</p>
                  <p className="text-xs">Complete Quests & Challenges to fill this shelf!</p>
                </div>
              )}
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  )
}

function LockIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  )
}
