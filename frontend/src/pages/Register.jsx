import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useGameStore from '../store/gameStore.js'
import axios from 'axios'
import { Gamepad2, Sparkles, User, Mail, Lock, ArrowRight, Loader2, Rocket } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, setLoading, setError, loading, error } = useGameStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      })

      const { user, accessToken } = response.data
      localStorage.setItem('token', accessToken);
      localStorage.setItem('assessmentTaken', 'false'); // New users haven't taken it
      login(user, accessToken)
      navigate('/dashboard/assessment')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="w-full max-w-md relative z-10">

        {/* Logo/Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 mb-4 transform -rotate-3 hover:-rotate-6 transition-transform">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Start Adventure
          </h1>
          <p className="text-slate-400">Begin your coding journey</p>
        </div>

        {/* Register Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
        >
          <form className="space-y-5" onSubmit={handleSubmit}>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                <div>
                  <strong>Mission Failed:</strong> {error}
                  {error.includes('MongoDB') && (
                    <div className="mt-1 text-xs opacity-80">Check server connection.</div>
                  )}
                </div>
              </motion.div>
            )}

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                  Codename (Name)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-4 bg-slate-950/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all outline-none placeholder:text-slate-600"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-4 bg-slate-950/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none placeholder:text-slate-600"
                    placeholder="hero@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                  Secret Key (Password)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    className="w-full pl-11 pr-4 py-4 bg-slate-950/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all outline-none placeholder:text-slate-600"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-600/20 hover:shadow-cyan-600/40 active:scale-[0.98] flex items-center justify-center gap-2 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Initializing...</span>
                </>
              ) : (
                <>
                  <span className="relative z-10">Create Character</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-slate-400 text-sm">
                Already have a character?{' '}
                <Link to="/login" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 group">
                  Resume Quest
                  <Sparkles className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                </Link>
              </span>
            </div>
          </form>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-8">
          CodeForge: A Gamified Learning Platform &copy; 2025
        </p>
      </div>
    </div>
  )
}

