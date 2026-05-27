import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Lightbulb, ChevronLeft, Bug as BugIcon, Check, X, Code2, Terminal, Shield } from 'lucide-react';
import axios from 'axios';
import useGameStore from '../../store/gameStore';

const BugChallenge = () => {
    const { bugId } = useParams();
    const navigate = useNavigate();
    const { user } = useGameStore();

    const [bug, setBug] = useState(null);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('Ready to run...');
    const [status, setStatus] = useState('idle'); // idle, running, success, error
    const [hint, setHint] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBug = async () => {
            try {
                const token = localStorage.getItem('token');
                // Use the new single bug endpoint we added
                const response = await axios.get(`http://localhost:5000/api/game/bug/${bugId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBug(response.data.bug);
                setCode(response.data.bug.brokenCode);
            } catch (error) {
                console.error('Error fetching bug:', error);
                setOutput('Error loading challenge. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (bugId) fetchBug();
    }, [bugId]);

    const handleRunCode = async () => {
        setStatus('running');
        setOutput('Compiling and running tests...');

        try {
            const token = localStorage.getItem('token');
            // send trimmed code to backend, or ensure backend trims it. 
            // The backend does .trim(), but let's be safe and send what user sees.
            const response = await axios.post(`http://localhost:5000/api/game/solve/${bugId}`, {
                userCode: code
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setStatus('success');
                setOutput(response.data.message);

                // Wait a moment then handle navigation
                setTimeout(() => {
                    if (response.data.nextBugId) {
                        // Navigate to next bug
                        navigate(`/dashboard/bug-hunter/play/${response.data.nextBugId}`);
                    } else {
                        // End of zone!
                        if (response.data.nextZoneUnlocked) {
                            // Show unlocking message if we can, or just go back
                        }
                        // Navigate back to map after short delay
                        setTimeout(() => {
                            navigate(`/dashboard/bug-hunter/zone/${bug.zoneId._id}`);
                        }, 1500);
                    }
                }, 2000);

            } else {
                setStatus('error');
                setOutput(response.data.message);
            }
        } catch (error) {
            setStatus('error');
            setOutput(error.response?.data?.message || 'Error connecting to server.');
        }
    };

    const handleGetHint = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:5000/api/game/hint/${bugId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHint(response.data.hint);
        } catch (error) {
            setHint('Unlock the Hint Tool to see clues!');
        }
    };

    const handleReset = () => {
        if (bug) {
            setCode(bug.brokenCode);
            setStatus('idle');
            setOutput('Code reset to initial state.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-500">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current"></div>
            </div>
        );
    }

    if (!bug) return <div className="p-8 text-white">Bug not found.</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(`/dashboard/bug-hunter/zone/${bug.zoneId._id}`)}
                        className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <BugIcon className="w-5 h-5 text-rose-500" />
                        {bug.title}
                    </h1>
                    <span className={`text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700 capitalize ${bug.difficulty === 'easy' ? 'text-green-400' :
                        bug.difficulty === 'medium' ? 'text-yellow-400' : 'text-rose-400'
                        }`}>
                        {bug.difficulty}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
                        <Shield className="w-4 h-4" />
                        <span className="font-bold">+{bug.xpReward} XP</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Left Panel - Description */}
                <div className="w-1/3 border-r border-slate-800 bg-slate-900/50 flex flex-col">
                    <div className="p-6 overflow-y-auto flex-1">
                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-lg font-bold text-cyan-400 mb-4">Mission Brief</h3>
                            <p className="mb-6 text-slate-300 leading-relaxed">{bug.description}</p>

                            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-6">
                                <h4 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Bug Profile</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Type:</span>
                                        <span className="text-slate-300 capitalize">{bug.category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Language:</span>
                                        <span className="text-slate-300 capitalize">{bug.language || 'JavaScript'}</span>
                                    </div>
                                </div>
                            </div>

                            {hint && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex gap-3 text-yellow-200"
                                >
                                    <Lightbulb className="w-5 h-5 shrink-0" />
                                    <p className="text-sm">{hint}</p>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Tools Bar */}
                    <div className="p-4 border-t border-slate-800 bg-slate-900">
                        <div className="flex gap-2">
                            <button
                                onClick={handleGetHint}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-700"
                            >
                                <Lightbulb className="w-4 h-4" />
                                Use Hint
                            </button>
                            <button
                                onClick={handleReset}
                                className="px-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors border border-slate-700"
                                title="Reset Code"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Editor & Output */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                    {/* Editor Toolbar */}
                    <div className="h-10 bg-[#252526] flex items-center justify-between px-4 border-b border-[#3e3e42]">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <Code2 className="w-4 h-4" />
                            <span>main.js</span>
                        </div>
                    </div>

                    {/* Monaco Editor */}
                    <div className="flex-1 relative">
                        <Editor
                            height="100%"
                            defaultLanguage="javascript"
                            theme="vs-dark"
                            value={code}
                            onChange={(value) => setCode(value)}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: "'Fira Code', monospace",
                                padding: { top: 20 },
                                scrollBeyondLastLine: false,
                            }}
                        />
                    </div>

                    {/* Output Console */}
                    <div className="h-48 bg-slate-950 border-t border-slate-800 flex flex-col">
                        <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <Terminal className="w-4 h-4" />
                                Console Output
                            </div>
                            <button
                                onClick={handleRunCode}
                                disabled={status === 'running'}
                                className={`
                                    flex items-center gap-2 px-6 py-1.5 rounded-full text-sm font-bold transition-all
                                    ${status === 'running'
                                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20'}
                                `}
                            >
                                {status === 'running' ? (
                                    <>Running...</>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 fill-current" />
                                        Run Code
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={status + output}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`
                                        ${status === 'success' ? 'text-green-400' :
                                            status === 'error' ? 'text-rose-400' :
                                                'text-slate-400'}
                                    `}
                                >
                                    {status === 'success' && <Check className="w-4 h-4 inline mr-2" />}
                                    {status === 'error' && <X className="w-4 h-4 inline mr-2" />}
                                    {output}
                                </motion.div>
                            </AnimatePresence>

                            {status === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center"
                                >
                                    <p className="text-green-400 font-bold mb-2">🎉 Challenge Complete!</p>
                                    <button
                                        onClick={() => navigate(`/dashboard/bug-hunter/zone/${bug.zoneId._id}`)}
                                        className="text-sm underline text-green-300 hover:text-green-200"
                                    >
                                        Return to Zone Map
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BugChallenge;
