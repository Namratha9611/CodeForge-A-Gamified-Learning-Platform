import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { submitAssessment } from '../store/slices/userSlice'
import useGameStore from '../store/gameStore'
import { Brain, CheckCircle, XCircle, Loader } from 'lucide-react'
import api from '../utils/api'

export default function SkillAssessment() {
  const [currentDomain, setCurrentDomain] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [assessmentQuestions, setAssessmentQuestions] = useState(null)
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.user)

  const domains = ['dsa', 'dbms', 'os', 'cn', 'web']
  const domainNames = {
    dsa: 'Data Structures & Algorithms',
    dbms: 'Database Management Systems',
    os: 'Operating Systems',
    cn: 'Computer Networks',
    web: 'Web Development',
  }

  // Fetch random questions from backend on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoadingQuestions(true)
        setError(null)

        // Disable caching by adding timestamp
        const response = await api.get('/assessment/questions', {
          params: { _t: Date.now() },
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })

        setAssessmentQuestions(response.data.questions)
        setLoadingQuestions(false)
      } catch (err) {
        console.error('Error fetching questions:', err)
        setError('Failed to load assessment questions. Please try again.')
        setLoadingQuestions(false)
      }
    }

    fetchQuestions()
  }, []) // Empty dependency array - only fetch once on mount

  const handleAnswer = (domain, questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [`${domain}_${questionId}`]: answerIndex,
    })
  }

  const calculateScores = () => {
    const scores = {}
    domains.forEach((domain) => {
      const questions = assessmentQuestions[domain]
      let correct = 0
      questions.forEach((q) => {
        const answerKey = `${domain}_${q.id}`
        if (answers[answerKey] === q.correct) {
          correct++
        }
      })
      scores[domain] = Math.round((correct / questions.length) * 100)
    })
    return scores
  }

  const { updateUserAssessment } = useGameStore() // Get the action

  const handleSubmit = async () => {
    const scores = calculateScores()
    const result = await dispatch(submitAssessment({ scores }))
    if (!result.error) {
      // Update global store with new data
      updateUserAssessment(result.payload)

      // Update localStorage to prevent redirect loop
      localStorage.setItem('assessmentTaken', 'true');

      setShowResults(true)
      setTimeout(() => {
        navigate('/dashboard')
      }, 3000)
    }
  }

  // Show loading state
  if (loadingQuestions) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center py-12">
          <Loader className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold mb-2">Loading Assessment</h2>
          <p className="text-gray-600">Fetching random questions...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !assessmentQuestions) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center py-12">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Assessment</h2>
          <p className="text-gray-600 mb-4">{error || 'Failed to load questions'}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const currentDomainKey = domains[currentDomain]
  const questions = assessmentQuestions[currentDomainKey] || []

  if (showResults) {
    const scores = calculateScores()
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center">
          <Brain className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Assessment Complete!</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
            {Object.entries(scores).map(([domain, score]) => (
              <div key={domain} className="text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-2 ${score >= 80 ? 'bg-green-100 text-green-600' :
                  score >= 60 ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                  <span className="text-2xl font-bold">{score}</span>
                </div>
                <p className="text-sm font-medium uppercase">{domain}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Skill Assessment</h1>
          <p className="text-gray-600">Answer questions to assess your skills across different domains</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{domainNames[currentDomainKey]}</span>
            <span>{currentDomain + 1} / {domains.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentDomain + 1) / domains.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No questions available for this domain.
            </div>
          ) : (
            questions.map((q) => (
              <div key={q.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-4">{q.question}</h3>
                <div className="space-y-2">
                  {q.options.map((option, index) => {
                    const answerKey = `${currentDomainKey}_${q.id}`
                    const isSelected = answers[answerKey] === index
                    const isCorrect = index === q.correct
                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(currentDomainKey, q.id, index)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${isSelected
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </div>
            )))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentDomain(Math.max(0, currentDomain - 1))}
            disabled={currentDomain === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {currentDomain < domains.length - 1 ? (
            <button
              onClick={() => setCurrentDomain(currentDomain + 1)}
              className="btn-primary"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Submitting...' : 'Submit Assessment'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

