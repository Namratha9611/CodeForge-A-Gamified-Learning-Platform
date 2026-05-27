import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Trophy, Zap, Brain, RotateCcw, Play } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateXP, updateLevel } from '../store/slices/userSlice';
import axios from 'axios';

// Card data for different topics and difficulties
const CARD_DATA = {
  dsa: {
    easy: [
      { id: 1, concept: 'Array', definition: 'Ordered collection of elements' },
      { id: 2, concept: 'Linked List', definition: 'Linear data structure with nodes' },
      { id: 3, concept: 'Stack', definition: 'LIFO data structure' },
      { id: 4, concept: 'Queue', definition: 'FIFO data structure' },
      { id: 5, concept: 'Tree', definition: 'Hierarchical data structure' },
      { id: 6, concept: 'Graph', definition: 'Nodes connected by edges' }
    ],
    medium: [
      { id: 1, concept: 'Binary Search', definition: 'O(log n) search algorithm' },
      { id: 2, concept: 'QuickSort', definition: 'Divide and conquer sorting' },
      { id: 3, concept: 'Hash Table', definition: 'Key-value pair storage' },
      { id: 4, concept: 'Heap', definition: 'Complete binary tree' },
      { id: 5, concept: 'Trie', definition: 'Prefix tree structure' },
      { id: 6, concept: 'Dynamic Programming', definition: 'Breaking problems into subproblems' }
    ],
    hard: [
      { id: 1, concept: 'Red-Black Tree', definition: 'Self-balancing binary search tree' },
      { id: 2, concept: 'Dijkstra\'s Algorithm', definition: 'Shortest path algorithm' },
      { id: 3, concept: 'KMP Algorithm', definition: 'Pattern matching algorithm' },
      { id: 4, concept: 'Segment Tree', definition: 'Range query data structure' },
      { id: 5, concept: 'Fenwick Tree', definition: 'Binary indexed tree' },
      { id: 6, concept: 'AVL Tree', definition: 'Self-balancing BST with height factor' }
    ]
  },
  oop: {
    easy: [
      { id: 1, concept: 'Class', definition: 'Blueprint for objects' },
      { id: 2, concept: 'Object', definition: 'Instance of a class' },
      { id: 3, concept: 'Encapsulation', definition: 'Bundling data and methods' },
      { id: 4, concept: 'Inheritance', definition: 'Deriving properties from parent' },
      { id: 5, concept: 'Polymorphism', definition: 'Multiple forms of same method' },
      { id: 6, concept: 'Abstraction', definition: 'Hiding implementation details' }
    ],
    medium: [
      { id: 1, concept: 'Interface', definition: 'Contract for classes' },
      { id: 2, concept: 'Abstract Class', definition: 'Cannot be instantiated' },
      { id: 3, concept: 'Method Overriding', definition: 'Redefining parent method' },
      { id: 4, concept: 'Method Overloading', definition: 'Same name, different parameters' },
      { id: 5, concept: 'Constructor', definition: 'Special method for initialization' },
      { id: 6, concept: 'Destructor', definition: 'Cleanup method' }
    ],
    hard: [
      { id: 1, concept: 'Virtual Function', definition: 'Runtime polymorphism' },
      { id: 2, concept: 'Friend Function', definition: 'Access to private members' },
      { id: 3, concept: 'Template', definition: 'Generic programming' },
      { id: 4, concept: 'Multiple Inheritance', definition: 'Class with multiple parents' },
      { id: 5, concept: 'Pure Virtual', definition: 'Must be overridden' },
      { id: 6, concept: 'Diamond Problem', definition: 'Ambiguity in multiple inheritance' }
    ]
  },
  os: {
    easy: [
      { id: 1, concept: 'Process', definition: 'Program in execution' },
      { id: 2, concept: 'Thread', definition: 'Lightweight process' },
      { id: 3, concept: 'Kernel', definition: 'Core of operating system' },
      { id: 4, concept: 'Scheduler', definition: 'Manages process execution' },
      { id: 5, concept: 'Semaphore', definition: 'Synchronization primitive' },
      { id: 6, concept: 'Mutex', definition: 'Mutual exclusion lock' }
    ],
    medium: [
      { id: 1, concept: 'Deadlock', definition: 'Circular wait condition' },
      { id: 2, concept: 'Thrashing', definition: 'Excessive paging' },
      { id: 3, concept: 'Fragmentation', definition: 'Broken memory spaces' },
      { id: 4, concept: 'Context Switch', definition: 'Saving process state' },
      { id: 5, concept: 'Race Condition', definition: 'Concurrent access issue' },
      { id: 6, concept: 'Critical Section', definition: 'Shared resource access' }
    ],
    hard: [
      { id: 1, concept: 'Banker\'s Algorithm', definition: 'Deadlock avoidance' },
      { id: 2, concept: 'LRU Cache', definition: 'Least recently used eviction' },
      { id: 3, concept: 'Page Replacement', definition: 'Memory management' },
      { id: 4, concept: 'Round Robin', definition: 'Time-sharing scheduler' },
      { id: 5, concept: 'Virtual Memory', definition: 'Memory abstraction' },
      { id: 6, concept: 'Demand Paging', definition: 'Load pages on demand' }
    ]
  },
  sql: {
    easy: [
      { id: 1, concept: 'SELECT', definition: 'Retrieve data from database' },
      { id: 2, concept: 'INSERT', definition: 'Add new records' },
      { id: 3, concept: 'UPDATE', definition: 'Modify existing records' },
      { id: 4, concept: 'DELETE', definition: 'Remove records' },
      { id: 5, concept: 'WHERE', definition: 'Filter conditions' },
      { id: 6, concept: 'ORDER BY', definition: 'Sort results' }
    ],
    medium: [
      { id: 1, concept: 'JOIN', definition: 'Combine tables' },
      { id: 2, concept: 'GROUP BY', definition: 'Aggregate rows' },
      { id: 3, concept: 'HAVING', definition: 'Filter groups' },
      { id: 4, concept: 'Subquery', definition: 'Query within query' },
      { id: 5, concept: 'Index', definition: 'Performance optimization' },
      { id: 6, concept: 'Transaction', definition: 'ACID operations' }
    ],
    hard: [
      { id: 1, concept: 'Window Function', definition: 'Row-based calculations' },
      { id: 2, concept: 'CTE', definition: 'Common table expression' },
      { id: 3, concept: 'Normalization', definition: 'Database design principles' },
      { id: 4, concept: 'Denormalization', definition: 'Performance optimization' },
      { id: 5, concept: 'Partitioning', definition: 'Divide large tables' },
      { id: 6, concept: 'Sharding', definition: 'Horizontal scaling' }
    ]
  },
  dbms: {
    easy: [
      { id: 1, concept: 'Database', definition: 'Organized data collection' },
      { id: 2, concept: 'Table', definition: 'Structured data storage' },
      { id: 3, concept: 'Primary Key', definition: 'Unique identifier' },
      { id: 4, concept: 'Foreign Key', definition: 'Reference to other table' },
      { id: 5, concept: 'Schema', definition: 'Database structure' },
      { id: 6, concept: 'Query', definition: 'Data request' }
    ],
    medium: [
      { id: 1, concept: 'ACID', definition: 'Database transaction properties' },
      { id: 2, concept: 'Normalization', definition: 'Reduce redundancy' },
      { id: 3, concept: 'Indexing', definition: 'Fast data retrieval' },
      { id: 4, concept: 'View', definition: 'Virtual table' },
      { id: 5, concept: 'Trigger', definition: 'Automatic action' },
      { id: 6, concept: 'Stored Procedure', definition: 'Reusable code block' }
    ],
    hard: [
      { id: 1, concept: 'Concurrency Control', definition: 'Manage simultaneous access' },
      { id: 2, concept: 'Two-Phase Locking', definition: 'Deadlock prevention' },
      { id: 3, concept: 'Timestamp Ordering', definition: 'Concurrency protocol' },
      { id: 4, concept: 'Checkpoint', definition: 'Recovery point' },
      { id: 5, concept: 'WAL Protocol', definition: 'Write-ahead logging' },
      { id: 6, concept: 'Distributed DB', definition: 'Multiple locations' }
    ]
  },
  web: {
    easy: [
      { id: 1, concept: 'HTML', definition: 'Markup language' },
      { id: 2, concept: 'CSS', definition: 'Styling language' },
      { id: 3, concept: 'JavaScript', definition: 'Programming language' },
      { id: 4, concept: 'DOM', definition: 'Document object model' },
      { id: 5, concept: 'HTTP', definition: 'Web protocol' },
      { id: 6, concept: 'URL', definition: 'Resource locator' }
    ],
    medium: [
      { id: 1, concept: 'REST API', definition: 'Architectural style' },
      { id: 2, concept: 'JSON', definition: 'Data format' },
      { id: 3, concept: 'Cookie', definition: 'Client storage' },
      { id: 4, concept: 'Session', definition: 'Server storage' },
      { id: 5, concept: 'CORS', definition: 'Cross-origin sharing' },
      { id: 6, concept: 'AJAX', definition: 'Async requests' }
    ],
    hard: [
      { id: 1, concept: 'WebSocket', definition: 'Real-time communication' },
      { id: 2, concept: 'Service Worker', definition: 'Offline functionality' },
      { id: 3, concept: 'WebRTC', definition: 'Peer-to-peer communication' },
      { id: 4, concept: 'CDN', definition: 'Content delivery network' },
      { id: 5, concept: 'SSR', definition: 'Server-side rendering' },
      { id: 6, concept: 'CSR', definition: 'Client-side rendering' }
    ]
  },
  networking: {
    easy: [
      { id: 1, concept: 'TCP', definition: 'Reliable protocol' },
      { id: 2, concept: 'UDP', definition: 'Fast protocol' },
      { id: 3, concept: 'IP Address', definition: 'Network identifier' },
      { id: 4, concept: 'DNS', definition: 'Domain resolution' },
      { id: 5, concept: 'Router', definition: 'Network traffic director' },
      { id: 6, concept: 'Switch', definition: 'Local network device' }
    ],
    medium: [
      { id: 1, concept: 'OSI Model', definition: '7-layer network model' },
      { id: 2, concept: 'Subnet Mask', definition: 'Network division' },
      { id: 3, concept: 'Gateway', definition: 'Network exit point' },
      { id: 4, concept: 'Firewall', definition: 'Security barrier' },
      { id: 5, concept: 'VPN', definition: 'Secure tunnel' },
      { id: 6, concept: 'NAT', definition: 'Address translation' }
    ],
    hard: [
      { id: 1, concept: 'BGP', definition: 'Exterior routing protocol' },
      { id: 2, concept: 'OSPF', definition: 'Interior routing protocol' },
      { id: 3, concept: 'MPLS', definition: 'Label switching' },
      { id: 4, concept: 'VLAN', definition: 'Virtual LAN' },
      { id: 5, concept: 'QoS', definition: 'Quality of service' },
      { id: 6, concept: 'SDN', definition: 'Software defined networking' }
    ]
  }
};

const MemoryGame = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.auth);
  
  const [gameState, setGameState] = useState('setup'); // setup, playing, completed
  const [topic, setTopic] = useState('dsa');
  const [difficulty, setDifficulty] = useState('easy');
  const [pairs, setPairs] = useState(6);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);

  const topics = Object.keys(CARD_DATA);
  const difficulties = ['easy', 'medium', 'hard'];
  const pairOptions = [4, 6, 8, 10];

  // Generate cards based on topic and difficulty
  const generateCards = useCallback(() => {
    const topicData = CARD_DATA[topic]?.[difficulty] || CARD_DATA.dsa.easy;
    const selectedData = topicData.slice(0, pairs);
    
    const gameCards = [];
    selectedData.forEach((item, index) => {
      // Create concept card
      gameCards.push({
        id: `concept-${index}`,
        content: item.concept,
        type: 'concept',
        pairId: item.id,
        definition: item.definition
      });
      // Create definition card
      gameCards.push({
        id: `definition-${index}`,
        content: item.definition,
        type: 'definition',
        pairId: item.id,
        concept: item.concept
      });
    });

    // Shuffle cards
    return gameCards.sort(() => Math.random() - 0.5);
  }, [topic, difficulty, pairs]);

  // Start game
  const startGame = () => {
    const newCards = generateCards();
    setCards(newCards);
    setGameState('playing');
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setScore(0);
    setCombo(0);
    setTimeLeft(120);
    setGameStartTime(Date.now());
  };

  // Reset game
  const resetGame = () => {
    setGameState('setup');
    setCards([]);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setScore(0);
    setCombo(0);
    setTimeLeft(120);
  };

  // Handle card click
  const handleCardClick = (cardId) => {
    if (isProcessing || gameState !== 'playing') return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || flippedCards.includes(cardId) || matchedCards.includes(cardId)) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsProcessing(true);
      setMoves(moves + 1);

      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      // Check if cards match
      if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        // Match found!
        setTimeout(() => {
          setMatchedCards([...matchedCards, firstId, secondId]);
          setFlippedCards([]);
          setIsProcessing(false);
          
          // Update score with combo
          const comboMultiplier = Math.max(1, combo);
          const points = 10 * comboMultiplier;
          setScore(score + points);
          setCombo(combo + 1);

          // Check if game is completed
          if (matchedCards.length + 2 === cards.length) {
            // Save score before marking as completed
            saveGameScore().then(() => {
              setGameState('completed');
            });
          }
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([]);
          setIsProcessing(false);
          setCombo(0);
        }, 1000);
      }
    }
  };

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('completed');
    }
  }, [timeLeft, gameState]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate final score
  const calculateFinalScore = () => {
    const timeBonus = timeLeft * 2;
    const movePenalty = Math.max(0, moves - cards.length) * 5;
    return Math.max(0, score + timeBonus - movePenalty);
  };

  // Save game score to backend
  const saveGameScore = async () => {
    try {
      const finalScore = calculateFinalScore();
      const timeSpent = gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0;
      
      const response = await axios.post(
        'http://localhost:5000/api/memory-game/save-score',
        {
          score: finalScore,
          moves,
          topic,
          difficulty,
          timeSpent
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update user profile with new XP and level
      if (response.data.newLevel !== profile.level) {
        dispatch(updateLevel(response.data.newLevel));
        dispatch(updateXP(response.data.totalXP - (profile.xp || 0)));
      }

      return response.data;
    } catch (error) {
      console.error('Error saving game score:', error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Brain className="w-12 h-12" />
            Memory Match
            <Brain className="w-12 h-12" />
          </h1>
          <p className="text-blue-200 text-lg">Match technical concepts with their definitions!</p>
        </div>

        {gameState === 'setup' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Game Setup</h2>
            
            {/* Topic Selection */}
            <div className="mb-6">
              <label className="text-white font-semibold mb-2 block">Select Topic:</label>
              <div className="grid grid-cols-4 gap-3">
                {topics.map(t => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      topic === t
                        ? 'bg-blue-500 text-white scale-105'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="mb-6">
              <label className="text-white font-semibold mb-2 block">Select Difficulty:</label>
              <div className="grid grid-cols-3 gap-3">
                {difficulties.map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                      difficulty === d
                        ? 'bg-green-500 text-white scale-105'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Pairs */}
            <div className="mb-8">
              <label className="text-white font-semibold mb-2 block">Number of Pairs:</label>
              <div className="grid grid-cols-4 gap-3">
                {pairOptions.map(p => (
                  <button
                    key={p}
                    onClick={() => setPairs(p)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      pairs === p
                        ? 'bg-purple-500 text-white scale-105'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {p} Pairs
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 text-lg"
            >
              <Play className="w-6 h-6" />
              Start Game
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <div>
            {/* Game Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
                <Timer className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                <div className="text-white font-bold">{formatTime(timeLeft)}</div>
                <div className="text-blue-200 text-sm">Time Left</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
                <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                <div className="text-white font-bold">{score}</div>
                <div className="text-blue-200 text-sm">Score</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
                <Zap className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                <div className="text-white font-bold">{combo}x</div>
                <div className="text-blue-200 text-sm">Combo</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
                <div className="text-white font-bold">{moves}</div>
                <div className="text-blue-200 text-sm">Moves</div>
              </div>
            </div>

            {/* Game Board */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {cards.map(card => (
                <motion.div
                  key={card.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardClick(card.id)}
                  className={`aspect-square rounded-xl cursor-pointer relative ${
                    matchedCards.includes(card.id)
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                      : flippedCards.includes(card.id)
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                      : 'bg-gradient-to-br from-gray-600 to-gray-700'
                  }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center p-3">
                    {(flippedCards.includes(card.id) || matchedCards.includes(card.id)) ? (
                      <div className="text-white text-center">
                        <div className="text-xs font-semibold mb-1 opacity-75">
                          {card.type === 'concept' ? 'CONCEPT' : 'DEFINITION'}
                        </div>
                        <div className="text-sm font-medium leading-tight">
                          {card.content}
                        </div>
                      </div>
                    ) : (
                      <div className="text-white/50 text-4xl font-bold">?</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={resetGame}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Game
            </button>
          </div>
        )}

        {gameState === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
          >
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Game Completed!</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-white font-bold text-xl">{calculateFinalScore()}</div>
                <div className="text-blue-200">Final Score</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-white font-bold text-xl">{moves}</div>
                <div className="text-blue-200">Total Moves</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={startGame}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Play Again
              </button>
              <button
                onClick={resetGame}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                New Setup
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MemoryGame;
