import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Bug, Gamepad2, Sparkles, Puzzle, Sword } from 'lucide-react'

export default function Games() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700/50 backdrop-blur-md mb-4 text-cyan-400 text-sm font-medium">
            <Sparkles size={16} />
            <span>Interactive Learning Zone</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Game Arcade
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Break from coding and sharpen your mind with our collection of developer-focused mini-games.
          </p>
        </motion.header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Code Arena Card */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="group">
            <Link to="/dashboard/arena" className="block h-full relative overflow-hidden rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-red-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent group-hover:from-red-600/20 transition-all" />
              {/* Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
                PVP BATTLE
              </div>

              <div className="p-8 h-full flex flex-col items-center text-center relative z-10">
                <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sword className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Code Arena</h3>
                <p className="text-slate-400 mb-6 flex-grow">
                  Challenge your friends to real-time coding battles and climb the ranks.
                </p>
                <div className="w-full py-3 rounded-xl bg-red-600/20 text-red-300 font-semibold group-hover:bg-red-600 group-hover:text-white transition-colors">
                  Enter Arena
                </div>
              </div>
            </Link>
          </motion.div>
          {/* Memory Game Card */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="group">
            <Link to="/dashboard/memory-game" className="block h-full relative overflow-hidden rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent group-hover:from-blue-600/20 transition-all" />
              <div className="p-8 h-full flex flex-col items-center text-center relative z-10">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                  <Brain className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Memory Matrix</h3>
                <p className="text-slate-400 mb-6 flex-grow">
                  Test your cognitive recall with computer science concept matching cards.
                </p>
                <div className="w-full py-3 rounded-xl bg-blue-600/20 text-blue-300 font-semibold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  Play Now
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Bug Hunter Card */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="group">
            <Link to="/dashboard/bug-hunter" className="block h-full relative overflow-hidden rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent group-hover:from-purple-600/20 transition-all" />
              {/* Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                INFINITE MODE
              </div>

              <div className="p-8 h-full flex flex-col items-center text-center relative z-10">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:-rotate-6 transition-transform">
                  <Bug className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Bug Hunter</h3>
                <p className="text-slate-400 mb-6 flex-grow">
                  Analyze code, spot errors, and defeat bosses in this debugging RPG adventure.
                </p>
                <div className="w-full py-3 rounded-xl bg-purple-600/20 text-purple-300 font-semibold group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  Start Hunting
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Crossword Card */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="group">
            <a href="/games/crossword-puzzle/index.html" className="block h-full relative overflow-hidden rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent group-hover:from-emerald-600/20 transition-all" />
              {/* Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                LEVEL BASED
              </div>

              <div className="p-8 h-full flex flex-col items-center text-center relative z-10">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Puzzle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Tech Crossword</h3>
                <p className="text-slate-400 mb-6 flex-grow">
                  Master technical vocabulary with auto-generating crossword levels.
                </p>
                <div className="w-full py-3 rounded-xl bg-emerald-600/20 text-emerald-300 font-semibold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  Solve Puzzle
                </div>
              </div>
            </a>
          </motion.div>

          {/* Coming Soon Card */}
          <motion.div variants={itemVariants} className="group relative opacity-60">
            <div className="h-full rounded-3xl bg-slate-900/30 border border-slate-800 border-dashed p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                <Gamepad2 className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-300 mb-1">More Coming Soon</h3>
              <p className="text-slate-500 text-sm">We are building more awesome games!</p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}
