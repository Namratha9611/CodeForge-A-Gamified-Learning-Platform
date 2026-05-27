import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env') })

// Import AssessmentQuestion model
const AssessmentQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true, min: 0 },
  domain: { type: String, enum: ['dsa', 'dbms', 'os', 'cn', 'web'], required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  explanation: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

const AssessmentQuestion = mongoose.models.AssessmentQuestion || mongoose.model('AssessmentQuestion', AssessmentQuestionSchema)

const questions = [
  // DSA Questions
  { question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correctAnswer: 1, domain: 'dsa' },
  { question: 'Which data structure follows LIFO principle?', options: ['Queue', 'Stack', 'Tree', 'Graph'], correctAnswer: 1, domain: 'dsa' },
  { question: 'What is the best case time complexity of quicksort?', options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'], correctAnswer: 0, domain: 'dsa' },
  { question: 'What is the time complexity of inserting an element at the beginning of an array?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 1, domain: 'dsa' },
  { question: 'Which algorithm uses divide and conquer approach?', options: ['Bubble Sort', 'Merge Sort', 'Selection Sort', 'Insertion Sort'], correctAnswer: 1, domain: 'dsa' },
  { question: 'What is the space complexity of recursive binary search?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctAnswer: 1, domain: 'dsa' },
  { question: 'Which data structure is used in BFS?', options: ['Stack', 'Queue', 'Heap', 'Tree'], correctAnswer: 1, domain: 'dsa' },
  { question: 'What is the worst case time complexity of hash table lookup?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctAnswer: 2, domain: 'dsa' },
  { question: 'Which sorting algorithm is stable?', options: ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort'], correctAnswer: 2, domain: 'dsa' },
  { question: 'What is the height of a balanced binary tree with n nodes?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], correctAnswer: 1, domain: 'dsa' },
  { question: 'Which data structure is best for implementing a priority queue?', options: ['Array', 'Linked List', 'Heap', 'Stack'], correctAnswer: 2, domain: 'dsa' },
  { question: 'What is the time complexity of finding an element in a hash table?', options: ['O(1) average', 'O(log n)', 'O(n)', 'O(n²)'], correctAnswer: 0, domain: 'dsa' },
  { question: 'Which traversal visits root, left, right?', options: ['Inorder', 'Preorder', 'Postorder', 'Level order'], correctAnswer: 1, domain: 'dsa' },
  { question: 'What is the time complexity of Dijkstra\'s algorithm?', options: ['O(V)', 'O(V log V + E)', 'O(V²)', 'O(E log V)'], correctAnswer: 1, domain: 'dsa' },
  { question: 'Which data structure is used for recursion?', options: ['Queue', 'Stack', 'Heap', 'Tree'], correctAnswer: 1, domain: 'dsa' },

  // DBMS Questions
  { question: 'What does ACID stand for in database transactions?', options: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Integrity, Data', 'Analysis, Control, Integration, Design', 'None of the above'], correctAnswer: 0, domain: 'dbms' },
  { question: 'Which SQL command is used to modify data?', options: ['SELECT', 'UPDATE', 'INSERT', 'DELETE'], correctAnswer: 1, domain: 'dbms' },
  { question: 'What is a primary key?', options: ['A foreign key', 'A unique identifier', 'An index', 'A constraint'], correctAnswer: 1, domain: 'dbms' },
  { question: 'Which normal form eliminates transitive dependencies?', options: ['1NF', '2NF', '3NF', 'BCNF'], correctAnswer: 2, domain: 'dbms' },
  { question: 'What is the purpose of an index?', options: ['Store data', 'Speed up queries', 'Enforce constraints', 'Backup data'], correctAnswer: 1, domain: 'dbms' },
  { question: 'Which join returns all rows from both tables?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'], correctAnswer: 3, domain: 'dbms' },
  { question: 'What is a foreign key?', options: ['Primary key of another table', 'Unique identifier', 'Index', 'Constraint'], correctAnswer: 0, domain: 'dbms' },
  { question: 'Which isolation level prevents dirty reads?', options: ['READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'], correctAnswer: 1, domain: 'dbms' },
  { question: 'What is normalization?', options: ['Adding redundancy', 'Removing redundancy', 'Indexing', 'Backing up'], correctAnswer: 1, domain: 'dbms' },
  { question: 'Which SQL clause is used for filtering?', options: ['SELECT', 'FROM', 'WHERE', 'GROUP BY'], correctAnswer: 2, domain: 'dbms' },
  { question: 'What is a view in SQL?', options: ['Physical table', 'Virtual table', 'Index', 'Constraint'], correctAnswer: 1, domain: 'dbms' },
  { question: 'Which constraint ensures uniqueness?', options: ['PRIMARY KEY', 'FOREIGN KEY', 'CHECK', 'NOT NULL'], correctAnswer: 0, domain: 'dbms' },
  { question: 'What is a transaction?', options: ['Single query', 'Sequence of operations', 'Table', 'Index'], correctAnswer: 1, domain: 'dbms' },
  { question: 'Which command removes all rows from a table?', options: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'], correctAnswer: 2, domain: 'dbms' },
  { question: 'What is the purpose of GROUP BY?', options: ['Filter rows', 'Group rows', 'Sort rows', 'Join tables'], correctAnswer: 1, domain: 'dbms' },

  // OS Questions
  { question: 'What is the purpose of an operating system?', options: ['To manage hardware resources', 'To compile programs', 'To design databases', 'None of the above'], correctAnswer: 0, domain: 'os' },
  { question: 'Which scheduling algorithm is preemptive?', options: ['FCFS', 'SJF', 'Round Robin', 'All of the above'], correctAnswer: 2, domain: 'os' },
  { question: 'What is virtual memory?', options: ['Physical RAM', 'Disk storage', 'Memory abstraction', 'Cache memory'], correctAnswer: 2, domain: 'os' },
  { question: 'Which page replacement algorithm replaces the least recently used page?', options: ['FIFO', 'LRU', 'Optimal', 'Random'], correctAnswer: 1, domain: 'os' },
  { question: 'What is a process?', options: ['Program in execution', 'Program file', 'Memory location', 'CPU register'], correctAnswer: 0, domain: 'os' },
  { question: 'Which synchronization primitive prevents race conditions?', options: ['Variable', 'Semaphore', 'Array', 'Function'], correctAnswer: 1, domain: 'os' },
  { question: 'What is deadlock?', options: ['Process termination', 'Resource contention', 'Circular wait', 'Memory leak'], correctAnswer: 2, domain: 'os' },
  { question: 'Which memory management technique uses pages?', options: ['Segmentation', 'Paging', 'Contiguous', 'Linked'], correctAnswer: 1, domain: 'os' },
  { question: 'What is context switching?', options: ['Changing CPU', 'Saving process state', 'Loading program', 'Memory allocation'], correctAnswer: 1, domain: 'os' },
  { question: 'Which scheduling algorithm has the shortest average waiting time?', options: ['FCFS', 'SJF', 'Round Robin', 'Priority'], correctAnswer: 1, domain: 'os' },
  { question: 'What is a thread?', options: ['Lightweight process', 'Heavy process', 'Memory unit', 'CPU core'], correctAnswer: 0, domain: 'os' },
  { question: 'Which IPC method uses shared memory?', options: ['Pipes', 'Sockets', 'Shared Memory', 'Signals'], correctAnswer: 2, domain: 'os' },
  { question: 'What is thrashing?', options: ['High CPU usage', 'Excessive paging', 'Memory leak', 'Deadlock'], correctAnswer: 1, domain: 'os' },
  { question: 'Which file system is used in Linux?', options: ['NTFS', 'FAT32', 'ext4', 'HFS+'], correctAnswer: 2, domain: 'os' },
  { question: 'What is the purpose of a semaphore?', options: ['Process scheduling', 'Synchronization', 'Memory management', 'File access'], correctAnswer: 1, domain: 'os' },

  // CN Questions
  { question: 'What does TCP stand for?', options: ['Transmission Control Protocol', 'Transfer Control Protocol', 'Transport Control Protocol', 'None'], correctAnswer: 0, domain: 'cn' },
  { question: 'Which layer is responsible for routing?', options: ['Physical', 'Network', 'Transport', 'Application'], correctAnswer: 1, domain: 'cn' },
  { question: 'What is the default port for HTTP?', options: ['80', '443', '8080', '21'], correctAnswer: 0, domain: 'cn' },
  { question: 'Which protocol is connection-oriented?', options: ['UDP', 'TCP', 'IP', 'HTTP'], correctAnswer: 1, domain: 'cn' },
  { question: 'What is the purpose of DNS?', options: ['Domain Name Resolution', 'Data transfer', 'Encryption', 'Compression'], correctAnswer: 0, domain: 'cn' },
  { question: 'Which layer handles error detection?', options: ['Physical', 'Data Link', 'Network', 'Transport'], correctAnswer: 1, domain: 'cn' },
  { question: 'What is the maximum size of an IPv4 packet?', options: ['64 KB', '1500 bytes', '65535 bytes', '1 MB'], correctAnswer: 2, domain: 'cn' },
  { question: 'Which protocol is used for secure web communication?', options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'], correctAnswer: 1, domain: 'cn' },
  { question: 'What is a subnet mask?', options: ['Network identifier', 'Host identifier', 'Router address', 'Gateway address'], correctAnswer: 0, domain: 'cn' },
  { question: 'Which routing algorithm finds the shortest path?', options: ['RIP', 'OSPF', 'BGP', 'Dijkstra'], correctAnswer: 3, domain: 'cn' },
  { question: 'What is the purpose of ARP?', options: ['Address Resolution', 'Name Resolution', 'Error Detection', 'Flow Control'], correctAnswer: 0, domain: 'cn' },
  { question: 'Which protocol is stateless?', options: ['TCP', 'UDP', 'HTTP', 'FTP'], correctAnswer: 2, domain: 'cn' },
  { question: 'What is the default port for HTTPS?', options: ['80', '443', '8080', '8443'], correctAnswer: 1, domain: 'cn' },
  { question: 'Which layer provides end-to-end communication?', options: ['Network', 'Transport', 'Session', 'Application'], correctAnswer: 1, domain: 'cn' },
  { question: 'What is the purpose of a firewall?', options: ['Speed up network', 'Block unauthorized access', 'Encrypt data', 'Compress data'], correctAnswer: 1, domain: 'cn' },

  // Web Development Questions
  { question: 'What is React?', options: ['A database', 'A JavaScript library', 'A programming language', 'A framework'], correctAnswer: 1, domain: 'web' },
  { question: 'What does DOM stand for?', options: ['Document Object Model', 'Data Object Model', 'Dynamic Object Model', 'None'], correctAnswer: 0, domain: 'web' },
  { question: 'Which method is used to update state in React?', options: ['setState', 'updateState', 'changeState', 'modifyState'], correctAnswer: 0, domain: 'web' },
  { question: 'What is the purpose of useEffect in React?', options: ['State management', 'Side effects', 'Rendering', 'Styling'], correctAnswer: 1, domain: 'web' },
  { question: 'Which HTTP method is used for creating resources?', options: ['GET', 'POST', 'PUT', 'DELETE'], correctAnswer: 1, domain: 'web' },
  { question: 'What is the purpose of CSS?', options: ['Structure', 'Styling', 'Logic', 'Data'], correctAnswer: 1, domain: 'web' },
  { question: 'Which JavaScript feature is used for asynchronous operations?', options: ['Promises', 'Loops', 'Functions', 'Variables'], correctAnswer: 0, domain: 'web' },
  { question: 'What is the purpose of localStorage?', options: ['Server storage', 'Client storage', 'Database', 'Cache'], correctAnswer: 1, domain: 'web' },
  { question: 'Which HTML tag is used for navigation?', options: ['<nav>', '<div>', '<span>', '<section>'], correctAnswer: 0, domain: 'web' },
  { question: 'What is the purpose of REST API?', options: ['Real-time communication', 'Resource representation', 'File transfer', 'Email'], correctAnswer: 1, domain: 'web' },
  { question: 'Which CSS property is used for flexbox layout?', options: ['display: grid', 'display: flex', 'display: block', 'display: inline'], correctAnswer: 1, domain: 'web' },
  { question: 'What is the purpose of npm?', options: ['Node Package Manager', 'Network Protocol', 'Name Protocol', 'None'], correctAnswer: 0, domain: 'web' },
  { question: 'Which JavaScript framework is used for building UIs?', options: ['jQuery', 'React', 'Express', 'MongoDB'], correctAnswer: 1, domain: 'web' },
  { question: 'What is the purpose of CORS?', options: ['Cross-Origin Resource Sharing', 'Cache Optimization', 'Code Organization', 'None'], correctAnswer: 0, domain: 'web' },
  { question: 'Which HTTP status code indicates success?', options: ['200', '400', '404', '500'], correctAnswer: 0, domain: 'web' },
]

async function seedQuestions() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-platform'
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing questions (optional - comment out if you want to keep existing)
    // await AssessmentQuestion.deleteMany({})
    // console.log('🗑️  Cleared existing questions')

    // Insert questions
    const result = await AssessmentQuestion.insertMany(questions)
    console.log(`✅ Inserted ${result.length} assessment questions`)

    // Count questions by domain
    const counts = await AssessmentQuestion.aggregate([
      { $group: { _id: '$domain', count: { $sum: 1 } } }
    ])
    console.log('\n📊 Questions by domain:')
    counts.forEach(({ _id, count }) => {
      console.log(`   ${_id}: ${count} questions`)
    })

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding questions:', error)
    process.exit(1)
  }
}

seedQuestions()

