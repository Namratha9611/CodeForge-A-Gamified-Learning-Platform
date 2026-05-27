import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'
import { Trophy, Medal, Award, TrendingUp, Crown, Zap, Flame, Star, Search } from 'lucide-react'

export default function Leaderboard() {
  const { profile } = useSelector((state) => state.user)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('xp') // xp, streak, quests

  useEffect(() => {
    fetchLeaderboard()
  }, [filter])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/leaderboard?sortBy=${filter}`)
      setLeaderboard(response.data)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const TopThree = ({ users }) => {
    const [first, second, third] = users
    return (
      <div className="flex flex-col md:flex-row justify-center items-end gap-3 md:gap-4 mb-8 min-h-[220px]">
        {/* Second Place */}
        {second && (
          <div className="order-2 md:order-1 w-full md:w-1/3 flex flex-col items-center">
            <div className="relative w-full bg-slate-100 rounded-3xl p-4 border-b-[6px] border-slate-300 flex flex-col items-center shadow-md transform hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute -top-4 w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center border-2 border-white shadow-sm font-black text-slate-500 text-sm">2</div>
              <div className="w-14 h-14 bg-slate-300 rounded-full mb-2 flex items-center justify-center text-lg font-black text-white border-2 border-white shadow-sm">
                {second.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-bold text-slate-700 text-sm mb-1 truncate max-w-full px-2">{second.name}</h3>
              <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full shadow-sm border border-slate-200">
                <Zap className="w-3 h-3 text-slate-400 fill-current" />
                <span className="font-bold text-slate-600 text-xs">{second.xp}</span>
              </div>
            </div>
            <div className="h-16 w-full bg-slate-200/50 rounded-t-2xl mt-2 mx-3"></div>
          </div>
        )}

        {/* First Place */}
        {first && (
          <div className="order-1 md:order-2 w-full md:w-1/3 flex flex-col items-center z-10">
            <div className="relative w-full bg-yellow-100 rounded-3xl p-6 border-b-[6px] border-yellow-400 flex flex-col items-center shadow-lg transform scale-105 hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute -top-8">
                <Crown className="w-12 h-12 text-yellow-500 fill-yellow-300 drop-shadow-sm animate-[bounce_2s_infinite]" />
              </div>
              <div className="w-16 h-16 bg-yellow-400 rounded-full mb-3 flex items-center justify-center text-2xl font-black text-white border-4 border-white shadow-sm mt-2">
                {first.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-black text-yellow-900 text-lg mb-1 truncate max-w-full px-2">{first.name}</h3>
              <div className="flex items-center gap-1.5 bg-yellow-500 text-white px-3 py-1 rounded-full shadow-md">
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span className="font-black text-sm">{first.xp}</span>
              </div>
              <div className="absolute -bottom-7 w-full flex justify-center">
                <div className="bg-yellow-400 text-yellow-800 text-[10px] font-black px-3 py-0.5 rounded-b-lg border-x-2 border-b-2 border-yellow-500 shadow-sm uppercase tracking-widest">
                  Champion
                </div>
              </div>
            </div>
            <div className="h-24 w-full bg-yellow-200/50 rounded-t-2xl mt-5 mx-3"></div>
          </div>
        )}

        {/* Third Place */}
        {third && (
          <div className="order-3 w-full md:w-1/3 flex flex-col items-center">
            <div className="relative w-full bg-orange-50 rounded-3xl p-4 border-b-[6px] border-orange-200 flex flex-col items-center shadow-md transform hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute -top-4 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm font-black text-orange-400 text-sm">3</div>
              <div className="w-14 h-14 bg-orange-300 rounded-full mb-2 flex items-center justify-center text-lg font-black text-white border-2 border-white shadow-sm">
                {third.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-bold text-orange-800 text-sm mb-1 truncate max-w-full px-2">{third.name}</h3>
              <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full shadow-sm border border-orange-100">
                <Zap className="w-3 h-3 text-orange-400 fill-current" />
                <span className="font-bold text-orange-600 text-xs">{third.xp}</span>
              </div>
            </div>
            <div className="h-10 w-full bg-orange-100/50 rounded-t-2xl mt-2 mx-3"></div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F0F9FF] p-3 sm:p-4 lg:p-6 font-sans text-slate-900 relative">
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] bg-indigo-200/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-200/30 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" />
            Leaderboard
          </h1>

          {/* 3D Filter Toggle - Compact */}
          <div className="flex items-center p-1 bg-white rounded-xl border-2 border-slate-200 shadow-sm mt-2 w-full md:w-auto overflow-x-auto">
            {[
              { id: 'xp', label: 'XP', icon: Zap },
              { id: 'streak', label: 'Streak', icon: Flame },
              { id: 'quests', label: 'Quests', icon: Star }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-black text-xs transition-all duration-200 whitespace-nowrap ${filter === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
              >
                <tab.icon className={`w-3.5 h-3.5 ${filter === tab.id ? 'fill-current' : ''}`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-indigo-500"></div>
            <p className="mt-2 font-bold text-xs text-slate-400">Finding champions...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="font-bold text-slate-400 text-sm">No data found</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {leaderboard.length > 0 && <TopThree users={leaderboard.slice(0, 3)} />}

            {/* Ranking List (4+) */}
            <div className="space-y-2">
              {leaderboard.slice(3).map((user, index) => {
                const rank = index + 4
                const isCurrentUser = profile && user._id === profile._id

                return (
                  <div
                    key={user._id}
                    className={`group relative flex items-center gap-3 p-3 bg-white rounded-xl border-b-[3px] border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${isCurrentUser ? 'ring-2 ring-indigo-500 border-indigo-200 bg-indigo-50/50' : ''
                      }`}
                  >
                    <div className="w-8 text-center font-black text-slate-400 text-sm">#{rank}</div>

                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-inner">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold text-sm truncate ${isCurrentUser ? 'text-indigo-900' : 'text-slate-700'}`}>
                        {user.name} {isCurrentUser && <span className="text-[10px] bg-indigo-200 text-indigo-800 px-1.5 py-px rounded-full ml-1">You</span>}
                      </h4>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-base text-slate-800">
                        {filter === 'xp' ? user.xp : filter === 'streak' ? user.streak : user.questsCompleted || 0}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
