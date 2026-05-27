import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle, Circle, Skull, ArrowRight, Lock } from 'lucide-react';
import axios from 'axios';
import useGameStore from '../../store/gameStore';

const BugList = () => {
    const { zoneId } = useParams();
    const navigate = useNavigate();
    const { user } = useGameStore();
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBugs = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/game/bugs/${zoneId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBugs(response.data.bugs);
            } catch (error) {
                console.error('Error fetching bugs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBugs();
    }, [zoneId]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard/bug-hunter')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" /> Back to World Map
                </button>

                <header className="mb-12">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
                        Zone Challenges
                    </h1>
                    <p className="text-slate-400">Complete these bugs to unlock the boss!</p>
                </header>

                <div className="space-y-4">
                    {bugs.map((bug, index) => (
                        <motion.div
                            key={bug._id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => !bug.isLocked && navigate(`/dashboard/bug-hunter/play/${bug._id}`)}
                            className={`
                group relative p-6 rounded-xl border-2 transition-all duration-300
                flex items-center justify-between
                ${bug.isLocked
                                    ? 'bg-slate-900/10 border-slate-800 cursor-not-allowed opacity-60'
                                    : bug.isCompleted
                                        ? 'bg-slate-900/50 border-green-500/30 cursor-pointer hover:border-green-500'
                                        : bug.boss
                                            ? 'bg-rose-900/10 border-rose-500/30 cursor-pointer hover:border-rose-500'
                                            : 'bg-slate-900/30 border-slate-700 cursor-pointer hover:border-cyan-500'}
              `}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${bug.isLocked
                                        ? 'bg-slate-800 text-slate-600'
                                        : bug.isCompleted
                                            ? 'bg-green-500/20 text-green-400'
                                            : bug.boss
                                                ? 'bg-rose-500/20 text-rose-400'
                                                : 'bg-slate-800 text-slate-500 group-hover:bg-cyan-500/20 group-hover:text-cyan-400'}
                `}>
                                    {bug.isLocked ? <Lock className="w-5 h-5" /> :
                                        bug.boss ? <Skull className="w-6 h-6" /> :
                                            bug.isCompleted ? <CheckCircle className="w-6 h-6" /> :
                                                <Circle className="w-6 h-6" />}
                                </div>

                                <div>
                                    <h3 className={`text-xl font-bold flex items-center gap-2 ${bug.isLocked ? 'text-slate-600' :
                                        bug.boss ? 'text-rose-400' : ''
                                        }`}>
                                        {bug.title}
                                        {bug.boss && <span className="text-xs bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/50">BOSS</span>}
                                    </h3>
                                    <p className="text-sm text-slate-500">{bug.isLocked ? 'Complete previous challenge to unlock' : bug.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {!bug.isLocked && (
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-yellow-500">+{bug.xpReward} XP</div>
                                        <div className={`text-xs capitalize ${bug.difficulty === 'easy' ? 'text-green-400' :
                                            bug.difficulty === 'medium' ? 'text-yellow-400' :
                                                'text-rose-400'
                                            }`}>{bug.difficulty}</div>
                                    </div>
                                )}
                                {bug.isLocked ? (
                                    <Lock className="w-5 h-5 text-slate-700" />
                                ) : (
                                    <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BugList;
