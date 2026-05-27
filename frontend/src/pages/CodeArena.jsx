import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code, Play, Sword, Trophy, Zap, ChevronLeft, Bot, Wifi } from 'lucide-react'
import { io } from 'socket.io-client'

import useGameStore from '../store/gameStore'

export default function CodeArena() {
    const { user } = useGameStore()
    const [gameState, setGameState] = useState('lobby') // lobby, searching, battling, victory, defeat
    const [myProgress, setMyProgress] = useState(0)
    const [opponentProgress, setOpponentProgress] = useState(0)
    const [opponentName, setOpponentName] = useState("Unknown Opponent")
    const [code, setCode] = useState("def solve(arr):\n    # Write your code here\n    pass")
    const [roomId, setRoomId] = useState(null)
    const socketRef = useRef(null)

    useEffect(() => {
        // Connect to Socket.io
        socketRef.current = io('http://localhost:5000')

        socketRef.current.on('connect', () => {
            console.log('Connected to server')
        })

        socketRef.current.on('match_found', ({ opponentId, opponentName, roomId }) => {
            setRoomId(roomId)
            setOpponentName(opponentName || `Opponent #${opponentId.substr(0, 4)}`)
            setGameState('battling')
            setMyProgress(0)
            setOpponentProgress(0)
        })

        socketRef.current.on('opponent_progress', ({ progress }) => {
            setOpponentProgress(progress)
        })

        socketRef.current.on('game_over', ({ result }) => {
            setGameState(result)
        })

        return () => {
            socketRef.current.disconnect()
        }
    }, [])

    const findMatch = () => {
        setGameState('searching')
        socketRef.current.emit('join_lobby', { name: user?.name || 'Anonymous Player' })
    }



    const handleCodeChange = (e) => {
        const newCode = e.target.value
        setCode(newCode)
        // Simple progress heuristic (Mock logic for now, usually backend evaluates)
        const lengthProgress = Math.min((newCode.length / 50) * 100, 95)
        setMyProgress(lengthProgress)

        if (gameState === 'battling' && roomId) {
            socketRef.current.emit('code_update', { roomId, progress: lengthProgress })
        }
    }
    const [error, setError] = useState(null)
    const [isChecking, setIsChecking] = useState(false)

    const handleSubmit = () => {
        // Validation: Don't allow empty or default code
        if (!code || code.trim() === "" || code.includes("pass")) {
            setError("⚠️ Please write some actual code before submitting (don't leave 'pass')")
            setTimeout(() => setError(null), 3000)
            return
        }

        setIsChecking(true)
        setError(null)

        // Simulate "Running Tests..."
        setTimeout(() => {
            setIsChecking(false)
            // In a real app, we'd send code to backend for execution
            // For now, we assume non-empty code is "Correct" for the game flow
            if (roomId) {
                setMyProgress(100)
                socketRef.current.emit('game_won', { roomId })
                setGameState('victory')
            }
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-white relative overflow-hidden">

            {/* Background FX */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px] animate-pulse delay-1000"></div>

            <div className="relative z-10 p-6 max-w-7xl mx-auto h-screen flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link to="/dashboard" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full border border-red-500/50">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="font-bold uppercase tracking-widest text-xs">Live Arena</span>
                    </div>
                    <div className="w-8"></div> {/* Spacer */}
                </div>

                {gameState === 'lobby' || gameState === 'searching' ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-fade-in-up">
                        <div className="p-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl shadow-purple-500/20 border-4 border-white/10">
                            <Sword className="w-24 h-24 text-white mb-4 mx-auto animate-pulse" />
                            <h1 className="text-5xl font-black mb-2">Code Arena</h1>
                            <p className="text-xl text-purple-100 font-medium">1v1 Real-Time Algorithm Battles</p>
                        </div>

                        <button
                            onClick={findMatch}
                            disabled={gameState === 'searching'}
                            className={`group relative px-12 py-5 rounded-2xl font-black text-2xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] 
                                ${gameState === 'searching' ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-900 hover:bg-slate-50 hover:scale-105 active:scale-95'}`}
                        >
                            {gameState === 'searching' ? (
                                <span className="flex items-center gap-3">
                                    <Wifi className="w-6 h-6 animate-ping" /> SEARCHING...
                                </span>
                            ) : (
                                "FIND ONLINE MATCH"
                            )}
                            {gameState !== 'searching' && (
                                <span className="absolute -top-2 -right-2 flex h-6 w-6">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500"></span>
                                </span>
                            )}
                        </button>
                        <p className="text-slate-500">
                            {gameState === 'searching' ? "Waiting for opponent..." : <><span className="text-green-400 font-bold">●</span> Online Mode Active</>}
                        </p>
                    </div>
                ) : null}

                {gameState === 'battling' && (
                    <div className="flex-1 flex flex-col gap-6 animate-scale-in">

                        {/* Battle HUD */}
                        <div className="flex items-center justify-between gap-8 bg-slate-900/50 p-6 rounded-3xl border border-white/10 backdrop-blur-md">

                            {/* Player (You) */}
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-cyan-400 flex items-center gap-2"><Zap className="w-4 h-4" /> YOU</span>
                                    <span className="font-mono">{Math.round(myProgress)}%</span>
                                </div>
                                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${myProgress}%` }}
                                        className="h-full bg-cyan-400 box-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                    ></motion.div>
                                </div>
                            </div>

                            {/* VS Badge */}
                            <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-red-500 rounded-xl font-black italic transform -rotate-12 shadow-lg z-10">VS</div>

                            {/* Opponent */}
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-red-400 flex items-center gap-2"><Bot className="w-4 h-4" /> {opponentName}</span>
                                    <span className="font-mono">{Math.round(opponentProgress)}%</span>
                                </div>
                                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${opponentProgress}%` }}
                                        className="h-full bg-red-500"
                                    ></motion.div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
                            {/* Task Panel */}
                            <div className="bg-slate-800/80 rounded-3xl p-6 border border-white/10 overflow-y-auto">
                                <div className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs font-bold mb-4">MEDIUM CHALLENGE</div>
                                <h3 className="text-2xl font-bold mb-4">Reverse a Linked List</h3>
                                <p className="text-slate-300 leading-relaxed mb-6">
                                    Given the head of a singly linked list, reverse the list, and return the reversed list.
                                    <br /><br />
                                    Example 1:<br />
                                    <span className="font-mono bg-black/30 p-1 rounded">Input: head = [1,2,3,4,5]</span><br />
                                    <span className="font-mono bg-black/30 p-1 rounded">Output: [5,4,3,2,1]</span>
                                </p>
                            </div>

                            {/* Editor Panel */}
                            <div className="bg-slate-900 rounded-3xl border border-white/10 flex flex-col overflow-hidden">
                                <div className="bg-slate-950 p-2 flex items-center gap-2 border-b border-white/5">
                                    <div className="flex gap-1.5 ml-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                    </div>
                                    <span className="text-xs text-slate-500 font-mono ml-4">solution.py</span>
                                </div>
                                <textarea
                                    value={code}
                                    onChange={handleCodeChange}
                                    className="flex-1 bg-transparent p-4 font-mono text-sm resize-none focus:outline-none"
                                    spellCheck={false}
                                />
                                {error && (
                                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm font-bold text-center animate-shake">
                                        {error}
                                    </div>
                                )}
                                <div className="p-4 border-t border-white/5 bg-slate-950/50">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isChecking}
                                        className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-wider transition-all
                                        ${isChecking ? 'bg-slate-700 text-slate-400 cursor-wait' : 'bg-green-500 hover:bg-green-400 text-green-950 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] active:scale-[0.98]'}`}
                                    >
                                        {isChecking ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="w-5 h-5 border-2 border-green-900/30 border-t-green-900 rounded-full animate-spin"></div>
                                                Running Tests...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                <Play className="w-5 h-5 fill-current" /> SUBMIT SOLUTION
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {(gameState === 'victory' || gameState === 'defeat') && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                        <div className="bg-slate-900 p-8 rounded-[3rem] border-4 border-white/10 text-center max-w-md w-full shadow-2xl scale-125">
                            {gameState === 'victory' ? (
                                <>
                                    <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-bounce" />
                                    <h2 className="text-4xl font-black text-white mb-2">VICTORY!</h2>
                                    <p className="text-slate-400 mb-6 font-bold">+500 XP Earned</p>
                                    <button onClick={() => setGameState('lobby')} className="btn-primary w-full py-4 text-lg">Play Again</button>
                                </>
                            ) : (
                                <>
                                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Sword className="w-10 h-10 text-red-500" />
                                    </div>
                                    <h2 className="text-4xl font-black text-white mb-2">DEFEAT</h2>
                                    <p className="text-slate-400 mb-6">The bot was faster!</p>
                                    <button onClick={() => setGameState('lobby')} className="bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl w-full py-4 text-lg transition-all">Try Again</button>
                                </>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
