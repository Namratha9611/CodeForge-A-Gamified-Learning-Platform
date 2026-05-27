import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Unlock, Star, Map, Trophy } from 'lucide-react';
import axios from 'axios';
import useGameStore from '../../store/gameStore';

const WorldMap = () => {
    const navigate = useNavigate();
    const { user } = useGameStore();
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchZones = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/game/zones', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setZones(response.data.zones);
            } catch (error) {
                console.error('Error fetching zones:', error);
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    // Redirect to login if unauthorized
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchZones();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center]"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <motion.h1
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-4"
                    >
                        Bug Hunter Universe
                    </motion.h1>
                    <p className="text-slate-400 text-xl">Select a zone to begin your debugging adventure</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {zones.map((zone, index) => (
                        <motion.div
                            key={zone._id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => zone.isUnlocked && navigate(`/dashboard/bug-hunter/zone/${zone._id}`)}
                            className={`
                relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300
                ${zone.isUnlocked
                                    ? 'bg-slate-900/50 border-cyan-500/30 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20'
                                    : 'bg-slate-900/30 border-slate-700 opacity-70 grayscale'}
              `}
                        >
                            <div className="absolute top-4 right-4">
                                {zone.isUnlocked ? (
                                    <Unlock className="w-6 h-6 text-cyan-400" />
                                ) : (
                                    <Lock className="w-6 h-6 text-slate-500" />
                                )}
                            </div>

                            <div className="mb-6">
                                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center mb-4
                  ${zone.isUnlocked ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}
                `}>
                                    <Map className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{zone.name}</h3>
                                <p className="text-sm text-slate-400">{zone.description}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Progress</span>
                                    <span className="text-cyan-400">{zone.completedBugs} / {zone.totalBugs} Bugs</span>
                                </div>
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                        style={{ width: `${(zone.completedBugs / (zone.totalBugs || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            {zone.hasBoss && (
                                <div className="mt-4 flex items-center gap-2 text-rose-400 text-sm font-semibold">
                                    <Trophy className="w-4 h-4" />
                                    <span>Boss Battle Available</span>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorldMap;
