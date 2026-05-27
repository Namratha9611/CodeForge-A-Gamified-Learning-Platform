import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchQuestDetail, submitQuest, clearError, clearCurrentQuest } from '../store/slices/questSlice'
import { Code, Play, CheckCircle, XCircle, Lightbulb, Save, Brain, Zap, Target, ChevronRight, Clock, Star, TrendingUp, BarChart2 } from 'lucide-react'
import api from '../utils/api'
import useGameStore from '../store/gameStore'

const languageOptions = ['python', 'java', 'cpp', 'javascript']

// ── XP Breakdown Popup ────────────────────────────────────────────────────────
function XPBreakdown({ breakdown, total }) {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-4 border-2 border-amber-200">
      <p className="text-xs font-black uppercase tracking-wider text-amber-700 mb-3">XP Breakdown</p>
      {breakdown.map((item, i) => (
        <div key={i} className="flex justify-between text-sm font-bold mb-1">
          <span className="text-slate-600">{item.label}</span>
          <span className={item.value.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}>{item.value}</span>
        </div>
      ))}
      <div className="border-t-2 border-amber-200 mt-2 pt-2 flex justify-between font-black text-base">
        <span className="text-amber-800">Total XP</span>
        <span className="text-amber-600">+{total}</span>
      </div>
    </div>
  )
}

// ── AI Hint Panel ─────────────────────────────────────────────────────────────
function HintPanel({ topic, hintsUsed, onHintUsed }) {
  const [hints, setHints] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalHints, setTotalHints] = useState(3)

  const fetchHint = async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await api.post('/adaptive/hint', {
        topic: topic || 'dsa',
        hintIndex: hints.length,
      })
      setHints(prev => [...prev, res.data.hint])
      setTotalHints(res.data.totalHints)
      onHintUsed()
    } catch (e) {
      setHints(prev => [...prev, 'Break the problem into smaller steps and solve them one by one.'])
      onHintUsed()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-yellow-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h3 className="font-black text-slate-800">AI Hints</h3>
        <span className="ml-auto text-xs text-slate-400 font-bold">{hints.length}/{totalHints} used (-2 XP each)</span>
      </div>

      {hints.length === 0 && (
        <p className="text-sm text-slate-500 mb-3 italic">Stuck? Get a progressive hint from the AI tutor.</p>
      )}

      <div className="space-y-2 mb-3">
        {hints.map((h, i) => (
          <div key={i} className="flex gap-2 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
            <span className="font-black text-yellow-600 text-sm">#{i + 1}</span>
            <p className="text-sm text-slate-700">{h}</p>
          </div>
        ))}
      </div>

      {hints.length < totalHints && (
        <button
          onClick={fetchHint}
          disabled={loading}
          className="w-full py-2 rounded-xl bg-yellow-100 text-yellow-800 font-black text-sm border-b-4 border-yellow-300 hover:bg-yellow-200 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50"
        >
          {loading ? 'Thinking...' : `💡 Get Hint ${hints.length + 1}`}
        </button>
      )}
    </div>
  )
}

// ── Code Analysis Panel ───────────────────────────────────────────────────────
function CodeAnalysis({ analysis }) {
  if (!analysis) return null
  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <BarChart2 className="w-5 h-5 text-indigo-500" />
        <h3 className="font-black text-slate-800">AI Code Analysis</h3>
        <span className={`ml-auto text-xs font-black px-2 py-1 rounded-lg ${analysis.isOptimized ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          Score: {analysis.qualityScore}/100
        </span>
      </div>
      <div className="space-y-2">
        {analysis.feedbackLines?.map((line, i) => (
          <p key={i} className="text-sm text-slate-700">{line}</p>
        ))}
      </div>
    </div>
  )
}

// ── Similar Questions Panel ───────────────────────────────────────────────────
function SimilarQuestions({ questions, onSelect }) {
  if (!questions || questions.length === 0) return null
  const typeColors = { similar: 'bg-blue-100 text-blue-700', harder: 'bg-red-100 text-red-700', timed: 'bg-purple-100 text-purple-700' }

  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-5 h-5 text-emerald-500" />
        <h3 className="font-black text-slate-800">What's Next?</h3>
      </div>
      <div className="space-y-2">
        {questions.map((q, i) => (
          <div key={i} onClick={() => onSelect(q)} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all cursor-pointer group">
            <div>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full mr-2 ${typeColors[q.type] || 'bg-slate-200 text-slate-600'}`}>
                {q.type}
              </span>
              <span className="text-sm font-bold text-slate-700">{q.title}</span>
              <p className="text-xs text-slate-400 mt-0.5">{q.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
function QuestDetailInner() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentQuest, loading, error } = useSelector(state => state.quest)
  const { updateUserXP } = useGameStore()

  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const [isGeneratingNext, setIsGeneratingNext] = useState(false)

  // Adaptive state restored
  const [hintsUsed, setHintsUsed] = useState(0)
  const [startTime] = useState(Date.now())
  const [codeAnalysis, setCodeAnalysis] = useState(null)
  const [similarQuestions, setSimilarQuestions] = useState([])
  const [showSuccess, setShowSuccess] = useState(false)

  const topic = currentQuest?.tags?.[0] || currentQuest?.domain || 'dsa'

  const handleNextProblem = async (q) => {
    if (isGeneratingNext) return
    setIsGeneratingNext(true)
    try {
      const res = await api.post('/adaptive/generate-specific', { 
        title: q.title, 
        domain: topic, 
        difficulty: q.difficulty 
      })
      navigate(`/dashboard/quests/${res.data._id}`)
      setShowSuccess(false)
    } catch (err) {
      console.error("Failed to generate next problem", err)
    } finally {
      setIsGeneratingNext(false)
    }
  }

  const handleAutoNext = async () => {
    if (isGeneratingNext) return
    setIsGeneratingNext(true)
    try {
      const res = await api.get('/adaptive/next-problem')
      if (res.data?.nextProblem?._id) {
        navigate(`/dashboard/quests/${res.data.nextProblem._id}`)
        setShowSuccess(false)
        setCode('')
      } else {
        navigate('/dashboard/quests') // Fallback if no problem found
      }
    } catch (err) {
      console.error("Failed to load next problem", err)
      navigate('/dashboard/quests')
    } finally {
      setIsGeneratingNext(false)
    }
  }

  useEffect(() => {
    dispatch(clearError())
    dispatch(clearCurrentQuest())
    dispatch(fetchQuestDetail(id))

    // Fully reset local state on new quest load
    setCode('')
    setProgress(null)
    setHintsUsed(0)
    setCodeAnalysis(null)
    setSimilarQuestions([])
    setResult(null)
    setShowSuccess(false)

    const fetchProgress = async () => {
      try {
        const res = await api.get(`/quests/${id}/progress`)
        if (res.data) setProgress(res.data)
      } catch {}
    }
    fetchProgress()

    const savedDraft = localStorage.getItem(`quest_draft_${id}`)
    if (savedDraft) {
      try {
        const { code: dc, language: dl } = JSON.parse(savedDraft)
        if (dl) setLanguage(dl)
        if (dc) setCode(dc)
      } catch {}
    }
  }, [dispatch, id])

  useEffect(() => {
    if (code) {
      const timer = setTimeout(() => {
        setIsSaving(true)
        localStorage.setItem(`quest_draft_${id}`, JSON.stringify({ code, language }))
        setTimeout(() => setIsSaving(false), 1000)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [code, language, id])

  useEffect(() => {
    if (currentQuest?.starterCode) {
      const isStarterCode = Object.values(currentQuest.starterCode).includes(code)
      if (code && !isStarterCode) return
      if (progress?.code && progress.language === language) { setCode(progress.code); return }
      if (currentQuest.domain === 'dbms') { setLanguage('sql'); setCode('SELECT * FROM employees;'); return }
      if (currentQuest.starterCode[language]) setCode(currentQuest.starterCode[language])
    }
  }, [currentQuest, language, progress])

  const handleSubmit = async () => {
    setSubmitting(true)
    setResult(null)
    setCodeAnalysis(null)
    setSimilarQuestions([])
    const timeTakenSeconds = Math.round((Date.now() - startTime) / 1000)

    try {
      const response = await dispatch(submitQuest({
        questId: id, code, language,
        timeTakenSeconds, hintsUsed,
      }))

      if (response.payload) {
        const payload = response.payload
        setResult(payload)
        if (payload.codeAnalysis) setCodeAnalysis(payload.codeAnalysis)
        if (payload.similarQuestions) setSimilarQuestions(payload.similarQuestions)
        if (payload.progress) setProgress(payload.progress)
        if (payload.success) {
          updateUserXP(payload.xpEarned || 0)
          setShowSuccess(true)
        }
      }
    } catch (err) {
      setResult({ success: false, message: err.message || 'An error occurred' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && !currentQuest) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-slate-500">Loading quest...</p>
        </div>
      </div>
    )
  }

  if (!currentQuest && !loading) {
    return (
      <div className="card text-center py-12">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 font-bold mb-4">{error || 'Quest not found'}</p>
        <button onClick={() => navigate('/dashboard/quests')} className="btn-secondary">Back to Quests</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header Bar ────────────────────────────────────────────────── */}
      <div className="bg-white border-b-2 border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/quests')} className="text-slate-400 hover:text-slate-700 font-bold text-sm">← Back</button>
          <h1 className="text-xl font-black text-slate-800">{currentQuest?.title}</h1>
          {progress?.status === 'completed' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black">
              <CheckCircle className="w-3 h-3" /> Completed
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border-2 ${currentQuest?.difficulty === 'easy' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : currentQuest?.difficulty === 'medium' ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-red-50 border-red-300 text-red-700'}`}>
            {currentQuest?.difficulty}
          </span>
          <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full border-2 border-amber-200">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="font-black text-amber-700 text-sm">{currentQuest?.xpReward || 10} XP</span>
          </div>
        </div>
      </div>

      {/* ── Main Layout ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-full">

        {/* Left: Problem + Editor */}
        <div className="lg:col-span-2 p-6 space-y-4">

          {/* Problem Statement */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
            <h2 className="font-black text-slate-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" /> Problem Statement
            </h2>
            <div className="prose max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: currentQuest?.problemStatement }} />

            {currentQuest?.examples?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-bold mb-2 text-slate-700">Examples</h3>
                {currentQuest.examples.map((ex, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-4 mb-2 border border-slate-200 text-sm font-mono">
                    <div className="text-slate-600">Input: {JSON.stringify(ex.input)}</div>
                    <div className="text-slate-600">Output: {JSON.stringify(ex.output)}</div>
                    {ex.explanation && <div className="text-slate-400 mt-1">{ex.explanation}</div>}
                  </div>
                ))}
              </div>
            )}

            {currentQuest?.constraints?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-bold mb-2 text-slate-700">Constraints</h3>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  {currentQuest.constraints.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{language}</span>
                {isSaving && <span className="text-xs text-emerald-400 animate-pulse flex items-center gap-1"><Save className="w-3 h-3" /> Saved</span>}
              </div>
              <select value={language} onChange={e => setLanguage(e.target.value)} className="bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-600 focus:outline-none">
                {languageOptions.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
              </select>
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full h-72 px-4 py-4 font-mono text-sm bg-slate-900 text-green-400 focus:outline-none resize-none"
              placeholder={`Write your ${language} solution here...`}
              spellCheck={false}
              style={{ tabSize: 4, lineHeight: 1.6 }}
            />
            <div className="px-4 py-3 bg-slate-800 border-t border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                <Clock className="w-3 h-3" />
                <span>Timer running...</span>
                {hintsUsed > 0 && <span className="text-yellow-400">• {hintsUsed} hint{hintsUsed > 1 ? 's' : ''} used</span>}
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting || !code.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-black rounded-xl border-b-4 border-indigo-800 hover:bg-indigo-500 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                {submitting ? 'Running...' : 'Run & Submit'}
              </button>
            </div>
          </div>

          {/* Failure Feedback */}
          {result && !result.success && (
            <div className="bg-red-50 rounded-2xl border-2 border-red-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="font-black text-red-800">Not Quite Right</span>
              </div>
              {result.message && <p className="text-sm text-red-700 mb-3">{result.message}</p>}
              {result.output && (
                <pre className="bg-slate-900 text-green-400 p-4 rounded-xl text-xs overflow-x-auto mb-3">{result.output}</pre>
              )}
              {result.explanation && (
                <div className="flex gap-2 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                  <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">{result.explanation}</p>
                </div>
              )}
              {/* Code Analysis on failure */}
              {codeAnalysis && <div className="mt-3"><CodeAnalysis analysis={codeAnalysis} /></div>}
            </div>
          )}
        </div>

        {/* Right: AI Sidebar */}
        <div className="border-l-2 border-slate-200 bg-white p-4 space-y-4 lg:max-h-[calc(100vh-73px)] lg:overflow-y-auto lg:sticky lg:top-0">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-slate-100">
            <Brain className="w-5 h-5 text-indigo-500" />
            <h2 className="font-black text-slate-800">AI Tutor</h2>
          </div>

          {/* Persona Hint */}
          {currentQuest?.personaHint && (
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
              <p className="text-xs font-black text-indigo-700 uppercase mb-1">Mentor Advice</p>
              <p className="text-sm text-indigo-800">{currentQuest.personaHint}</p>
            </div>
          )}

          {/* Hint System */}
          <HintPanel topic={topic} hintsUsed={hintsUsed} onHintUsed={() => setHintsUsed(h => h + 1)} />

          {/* Code Analysis (shown after attempt) */}
          {codeAnalysis && <CodeAnalysis analysis={codeAnalysis} />}

          {/* Similar Questions (shown after success) */}
          {similarQuestions.length > 0 && <SimilarQuestions questions={similarQuestions} onSelect={handleNextProblem} />}

          {/* Quest Tags */}
          {currentQuest?.tags?.length > 0 && (
            <div>
              <p className="text-xs font-black text-slate-500 uppercase mb-2">Topics</p>
              <div className="flex flex-wrap gap-1">
                {currentQuest.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Success Modal ──────────────────────────────────────────────── */}
      {showSuccess && result?.success && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border-4 border-emerald-300 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-black text-emerald-800 mb-1">🎉 Quest Complete!</h3>
              <p className="text-emerald-600 font-bold">Outstanding work, champion!</p>
            </div>

            <XPBreakdown breakdown={result.xpBreakdown || [{ label: 'Base XP', value: `+${result.xpEarned}` }]} total={result.xpEarned} />

            {result.newPersona && (
              <div className="mt-4 text-center">
                <span className="text-sm font-black text-indigo-600">🏆 Rank: {result.newPersona} · Level {result.newLevel}</span>
              </div>
            )}

            {/* Results are now shown in the AI sidebar instead of crowding the modal */}

            <div className="flex gap-3 mt-6">
              <button onClick={handleAutoNext} disabled={isGeneratingNext} className="flex-1 bg-emerald-600 text-white font-black py-3 rounded-xl hover:bg-emerald-500 transition-all disabled:opacity-50">
                {isGeneratingNext ? 'Finding...' : 'Next Quest'}
              </button>
              <button onClick={() => setShowSuccess(false)} className="flex-1 bg-white text-emerald-600 font-black py-3 rounded-xl border-2 border-emerald-600 hover:bg-emerald-50 transition-all">
                Stay Here
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function QuestDetail() {
  const { id } = useParams()
  return <QuestDetailInner key={id} />
}
