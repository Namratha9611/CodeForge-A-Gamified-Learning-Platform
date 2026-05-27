/**
 * 6x6 Procedural Codeword Generator
 * Creates a valid crossword grid, maps letters to numbers (1-26), 
 * and provides clues.
 */

const GameState = {
    level: 1,
    gridSize: 6,
    grid: [],      // 6x6 array: { char: 'A', num: 1, isBlack: false, userChar: '' }
    cipher: {},    // Map 'A' -> 1
    acrossClues: [],
    downClues: [],
    selectedNum: null
};

// --- TECHNICAL INTERVIEW WORD DATABASE ---
// Organized by difficulty levels for progressive learning
const TECHNICAL_WORD_DB = {
    // Level 1: Very Easy (3-5 letters)
    1: [
        { w: "LOOP", d: "Basic programming construct that repeats code execution" },
        { w: "ARRAY", d: "Linear data structure that stores elements of same type" },
        { w: "CSS", d: "Language used for web styling" },
        { w: "SQL", d: "Relational database query language" },
        { w: "HTML", d: "Markup language for web pages" },
        { w: "JAVA", d: "Object-oriented programming language" },
        { w: "CODE", d: "Instructions written by programmers" },
        { w: "DATA", d: "Information processed by computers" },
        { w: "FILE", d: "Container for storing data" },
        { w: "HTTP", d: "Protocol for web communication" },
        { w: "JSON", d: "Lightweight data interchange format" },
        { w: "NODE", d: "JavaScript runtime environment" },
        { w: "PATH", d: "Location of a file or directory" },
        { w: "PORT", d: "Communication endpoint for network connections" },
        { w: "REPO", d: "Storage location for version control" },
        { w: "TREE", d: "Hierarchical data structure" },
        { w: "VIEW", d: "Virtual table in database" },
        { w: "WEB", d: "Network of interconnected documents" },
        { w: "XML", d: "Markup language for data storage" },
        { w: "API", d: "Interface for software communication" }
    ],
    
    // Level 2: Easy (4-6 letters)
    2: [
        { w: "STACK", d: "LIFO data structure" },
        { w: "QUEUE", d: "FIFO data structure" },
        { w: "CLASS", d: "Blueprint for creating objects" },
        { w: "METHOD", d: "Function belonging to a class" },
        { w: "OBJECT", d: "Instance of a class" },
        { w: "STRING", d: "Sequence of characters" },
        { w: "NUMBER", d: "Numeric data type" },
        { w: "BOOLEAN", d: "True/false data type" },
        { w: "SERVER", d: "Computer that provides services" },
        { w: "CLIENT", d: "Computer that requests services" },
        { w: "COOKIE", d: "Small piece of data stored in browser" },
        { w: "DOMAIN", d: "Website address on internet" },
        { w: "FRAME", d: "Container for web content" },
        { w: "HEADER", d: "Top section of HTTP request" },
        { w: "INDEX", d: "Data structure for fast lookup" },
        { w: "MODULE", d: "Reusable piece of code" },
        { w: "PARAM", d: "Variable passed to function" },
        { w: "SCHEMA", d: "Structure of a database" },
        { w: "SCRIPT", d: "Program written in scripting language" },
        { w: "TOKEN", d: "Security credential for authentication" }
    ],
    
    // Level 3: Medium (5-8 letters)
    3: [
        { w: "RECURSION", d: "Function that calls itself to solve problems" },
        { w: "BINARY", d: "Search algorithm with O(log n) complexity" },
        { w: "SORTING", d: "Process of arranging data in order" },
        { w: "HASHING", d: "Technique for fast data retrieval" },
        { w: "POINTER", d: "Variable that stores memory address" },
        { w: "THREAD", d: "Lightweight process within a program" },
        { w: "PROCESS", d: "Program in execution" },
        { w: "PACKAGE", d: "Collection of related classes" },
        { w: "ROUTER", d: "Device that forwards data packets" },
        { w: "SOCKET", d: "Endpoint for network communication" },
        { w: "BUFFER", d: "Temporary storage area" },
        { w: "CACHE", d: "High-speed memory storage" },
        { w: "DRIVER", d: "Software that controls hardware" },
        { w: "FILTER", d: "Program that processes data" },
        { w: "HANDLER", d: "Function that processes events" },
        { w: "LISTENER", d: "Object that waits for events" },
        { w: "MANAGER", d: "Program that coordinates resources" },
        { w: "PARSER", d: "Program that analyzes syntax" },
        { w: "RUNTIME", d: "Environment where code executes" },
        { w: "SERVICE", d: "Background process that performs tasks" }
    ],
    
    // Level 4: Hard (6-9 letters)
    4: [
        { w: "DEADLOCK", d: "OS condition where processes wait indefinitely for each other" },
        { w: "HASHMAP", d: "Hash-based data structure for key-value storage" },
        { w: "SHARDING", d: "Technique for distributing data across multiple servers" },
        { w: "TEMPLATE", d: "Predefined pattern for code generation" },
        { w: "INTERFACE", d: "Contract defining method signatures" },
        { w: "ABSTRACT", d: "Concept without concrete implementation" },
        { w: "OVERRIDE", d: "Replacing parent class method in child class" },
        { w: "OVERLOAD", d: "Multiple methods with same name but different parameters" },
        { w: "POLYMORPH", d: "Ability to take many forms" },
        { w: "ENCRYPTION", d: "Process of encoding data for security" },
        { w: "COMPRESSION", d: "Process of reducing data size" },
        { w: "SERIALIZATION", d: "Converting object to byte stream" },
        { w: "DESERIALIZATION", d: "Converting byte stream back to object" },
        { w: "CONTROLLER", d: "Component that handles user input" },
        { w: "MIDDLEWARE", d: "Software that bridges operating system and applications" },
        { w: "BACKEND", d: "Server-side of web application" },
        { w: "FRONTEND", d: "Client-side of web application" },
        { w: "DATABASE", d: "Organized collection of data" },
        { w: "ALGORITHM", d: "Step-by-step procedure for solving problems" },
        { w: "OPTIMIZATION", d: "Process of making code more efficient" }
    ],
    
    // Level 5: Advanced (7-10 letters)
    5: [
        { w: "INHERITANCE", d: "OOP principle where one class inherits from another" },
        { w: "FIREWALL", d: "Network security system that monitors traffic" },
        { w: "VIRTUALIZATION", d: "Creating virtual versions of computer resources" },
        { w: "CONTAINER", d: "Lightweight virtualization technology" },
        { w: "ORCHESTRATION", d: "Automated coordination of containers" },
        { w: "MICROSERVICES", d: "Architecture style with small independent services" },
        { w: "LOADBALANCER", d: "Device that distributes network traffic" },
        { w: "REPLICATION", d: "Process of copying data across servers" },
        { w: "PARTITIONING", d: "Dividing database into smaller parts" },
        { w: "NORMALIZATION", d: "Process of organizing database tables" },
        { w: "DENORMALIZATION", d: "Process of combining database tables" },
        { w: "TRANSACTION", d: "Unit of work performed on database" },
        { w: "CONCURRENCY", d: "Execution of multiple processes simultaneously" },
        { w: "PARALLELISM", d: "Simultaneous execution of multiple tasks" },
        { w: "ASYNCHRONOUS", d: "Non-blocking execution model" },
        { w: "SYNCHRONOUS", d: "Blocking execution model" },
        { w: "DISTRIBUTED", d: "System spread across multiple computers" },
        { w: "SCALABILITY", d: "Ability to handle increased workload" },
        { w: "AVAILABILITY", d: "System uptime and accessibility" },
        { w: "CONSISTENCYrech", d-rech:ervalidation",
    ],
    
базе
    // Level 6+: Expert (8-12 letters)
    6: [
        { w: "DOCKER", d: "Platform for containerization" },
        { w: "KUBERNETES", d: "Container orchestration platform" },
        { w: "JENKINS", d: "Continuous integration tool" },
        { w: "GITHUB", d: "Version control platform" },
        { w: "BITBUCKET", d: "Git-based source code repository" },
        { w: "JAVASCRIPT", d: "Programming language for web development" },
        { w: "TYPESCRIPT", d: "Typed superset of JavaScript" },
        { w: "PYTHON", d: "High-level programming language" },
        { w: "DJANGO", d: "Python web framework" },
        { w: "FLASK", d: "Lightweight Python web framework" },
        { w: "EXPRESS", d: "Node.js web framework" },
        { w: "REACT", d: "JavaScript library for building UIs" },
        { w: "ANGULAR", d: "JavaScript framework for web apps" },
        { w: "VUEJS", d: "Progressive JavaScript framework" },
        { w: "MONGODB", d: "NoSQL document database" },
        { w: "POSTGRESQL", d: "Advanced open-source relational database" },
        { w: "REDIS", d: "In-memory data structure store" },
        { w: "ELASTICSEARCH", d: "Distributed search engine" },
        { w: "KAFKA", d: "Distributed streaming platform" },
        { w: "RABBITMQ", d: "Message broker software" }
    ]
};

const TEMPLATES = [
    // 6x6 Symmetric Black-Out Patterns (1 = black, 0 = white)
    // Pattern 1: Simple Cross
    [
        [1, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0],
        [0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 1]
    ],
    // Pattern 2: Corners
    [
        [0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    // Pattern 3: Center Block
    [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0],
        [0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 1, 0]
    ],
    // Pattern 4: Stripes
    [
        [0, 0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 0]
    ]
];

document.addEventListener('DOMContentLoaded', () => {
    initLevel();

    // Keyboard Input
    document.addEventListener('keydown', handleKeyInput);

    // Continue Button
    document.getElementById('next-level-btn').addEventListener('click', nextLevel);
});

async function initLevel() {
    // 1. Setup Grid structure
    resetState();
    
    // 2. Generate Technical Puzzle based on level
    const success = generateTechnicalPuzzle();

    if (!success) {
        // Fallback: Retry generation
        console.warn("Generation retry...");
        initLevel();
        return;
    }

    // 3. Generate Cipher (Map letters to 1-26)
    generateCipher();

    // 4. Generate Clues from technical database
    generateTechnicalClues();

    // 5. Render
    renderGrid();
    renderClues();
    renderDecoder();

    // 6. Reveal Hints based on Level
    revealStartingHints();

    // 7. Log Level Info
    logLevelInfo();
    
    // 8. Auto-generate next level after delay
    setTimeout(() => {
        console.log("Generating next level...");
        GameState.level++;
        initLevel();
    }, 30000); // 30 seconds to next level
}

function resetState() {
    GameState.grid = [];
    GameState.cipher = {};
    GameState.acrossClues = [];
    GameState.downClues = [];
    GameState.selectedNum = null;
    document.getElementById('level-num').textContent = GameState.level;
    document.querySelector('.modal').style.display = 'none';

    // Clear styles
    document.querySelectorAll('.cell').forEach(c => c.remove());
}

/* --- Technical Puzzle Generator --- */
function generateTechnicalPuzzle() {
    // Get words appropriate for current level
    const difficulty = Math.min(GameState.level, 6);
    const wordPool = TECHNICAL_WORD_DB[difficulty] || TECHNICAL_WORD_DB[6];
    
    // Select 2-3 words for this puzzle (across and down)
    const selectedWords = [];
    const tempPool = [...wordPool];
    
    // Shuffle and select words that can fit in 6x6 grid
    tempPool.sort(() => 0.5 - Math.random());
    
    for (let word of tempPool) {
        if (word.w.length <= 6 && selectedWords.length < 4) {
            selectedWords.push(word);
        }
    }
    
    if (selectedWords.length < 2) {
        console.warn("Not enough suitable words for level");
        return false;
    }
    
    // Create a simple grid layout
    return createTechnicalGrid(selectedWords);
}

function createTechnicalGrid(words) {
    // Initialize empty 6x6 grid
    const grid = [];
    for (let r = 0; r < 6; r++) {
        const row = [];
        for (let c = 0; c < 6; c++) {
            row.push({
                char: '',
                isBlack: true,
                num: 0,
                userChar: '',
                wordInfo: null
            });
        }
        grid.push(row);
    }
    
    // Place words in grid
    let wordIndex = 0;
    
    // Place first word horizontally
    if (words[wordIndex]) {
        const word = words[wordIndex];
        const startRow = Math.floor(Math.random() * 3); // Top half
        const startCol = 0;
        
        for (let i = 0; i < Math.min(word.w.length, 6); i++) {
            grid[startRow][startCol + i] = {
                char: word.w[i],
                isBlack: false,
                num: 0,
                userChar: '',
                wordInfo: { word: word.w, clue: word.d, direction: 'across', index: wordIndex }
            };
        }
        wordIndex++;
    }
    
    // Place second word vertically if exists
    if (words[wordIndex]) {
        const word = words[wordIndex];
        const startRow = 0;
        const startCol = Math.floor(Math.random() * 3) + 2; // Right side
        
        for (let i = 0; i < Math.min(word.w.length, 6); i++) {
            if (startRow + i < 6) {
                grid[startRow + i][startCol] = {
                    char: word.w[i],
                    isBlack: false,
                    num: 0,
                    userChar: '',
                    wordInfo: { word: word.w, clue: word.d, direction: 'down', index: wordIndex }
                };
            }
        }
        wordIndex++;
    }
    
    // Place third word horizontally if exists
    if (words[wordIndex]) {
        const word = words[wordIndex];
        const startRow = Math.floor(Math.random() * 3) + 3; // Bottom half
        const startCol = 0;
        
        for (let i = 0; i < Math.min(word.w.length, 6); i++) {
            if (startCol + i < 6) {
                grid[startRow][startCol + i] = {
                    char: word.w[i],
                    isBlack: false,
                    num: 0,
                    userChar: '',
                    wordInfo: { word: word.w, clue: word.d, direction: 'across', index: wordIndex }
                };
            }
        }
        wordIndex++;
    }
    
    // Store the words for clue generation
    GameState.placedWords = words.slice(0, wordIndex);
    GameState.grid = grid;
    
    return true;
}

function getSlots(grid) {
    // Find all 'Across' and 'Down' slots
    // For generation, we just need a list of locations to fill. 
    // Optimization: Just finding Across slots is insufficient if Down are empty.
    // We need to fill all white cells.

    // Better strategy for this size:
    // 1. Identify all Across word locations (r, c, length)
    // 2. Identify all Down word locations
    // 3. Sort by constraints?

    // Let's just create a list of Across slots.
    const slots = [];
    // Across
    for (let r = 0; r < 6; r++) {
        let len = 0;
        for (let c = 0; c < 6; c++) {
            if (!grid[r][c].isBlack) len++;
            else {
                if (len >= 3) slots.push({ r, c: c - len, len, dir: 'across' });
                len = 0;
            }
        }
        if (len >= 3) slots.push({ r, c: 6 - len, len, dir: 'across' });
    }

    // Down
    for (let c = 0; c < 6; c++) {
        let len = 0;
        for (let r = 0; r < 6; r++) {
            if (!grid[r][c].isBlack) len++;
            else {
                if (len >= 3) slots.push({ r: r - len, c: c, len, dir: 'down' });
                len = 0;
            }
        }
        if (len >= 3) slots.push({ r: 6 - len, c: c, len, dir: 'down' });
    }

    // Sort slots by length (longest first = harder constraint)
    return slots.sort((a, b) => b.len - a.len);
}

function fillSlots(grid, slots, index) {
    if (index >= slots.length) return true; // All filled

    const slot = slots[index];

    // Check if slot is already effectively filled by intersecting words
    let isPreFilled = true;
    let currentPattern = "";
    for (let i = 0; i < slot.len; i++) {
        const r = slot.dir === 'across' ? slot.r : slot.r + i;
        const c = slot.dir === 'across' ? slot.c + i : slot.c;
        const cell = grid[r][c];
        if (cell.char === '.') {
            isPreFilled = false;
            currentPattern += ".";
        } else {
            currentPattern += cell.char;
        }
    }

    if (isPreFilled) {
        // Just validate if the word exists
        if (isValidWord(currentPattern)) return fillSlots(grid, slots, index + 1);
        return false;
    }

    // Find candidates for this pattern
    const candidates = getCandidates(currentPattern, slot.len);

    // Shuffle for variety
    candidates.sort(() => 0.5 - Math.random());

    for (let word of candidates) {
        // Apply word
        const backup = []; // Store state to backtrack
        for (let i = 0; i < slot.len; i++) {
            const r = slot.dir === 'across' ? slot.r : slot.r + i;
            const c = slot.dir === 'across' ? slot.c + i : slot.c;
            backup.push({ r, c, val: grid[r][c].char });
            grid[r][c].char = word[i];
        }

        // Recurse
        if (fillSlots(grid, slots, index + 1)) return true;

        // Backtrack
        for (let b of backup) {
            grid[b.r][b.c].char = b.val;
        }
    }

    return false;
}

function getCandidates(pattern, length) {
    // pattern e.g. "C.T"
    const regex = new RegExp("^" + pattern + "$");
    return WORD_DB.filter(w => w.w.length === length && regex.test(w.w)).map(w => w.w);
}

function isValidWord(word) {
    return WORD_DB.some(w => w.w === word);
}

/* --- Gameplay Logic --- */
function generateCipher() {
    // Get unique letters in grid
    const letters = new Set();
    GameState.grid.forEach(row => row.forEach(cell => {
        if (!cell.isBlack) letters.add(cell.char);
    }));

    // Map them to random numbers 1-26
    const availableNums = Array.from({ length: 26 }, (_, i) => i + 1);
    availableNums.sort(() => 0.5 - Math.random());

    GameState.cipher = {};
    let idx = 0;
    letters.forEach(char => {
        const num = availableNums[idx++];
        GameState.cipher[char] = num;

        // Update grid cells with numbers
        GameState.grid.forEach(row => row.forEach(cell => {
            if (cell.char === char) cell.num = num;
        }));
    });
}

function generateTechnicalClues() {
    // Generate clues from placed words
    let clueNum = 1;
    
    // Clear existing clues
    GameState.acrossClues = [];
    GameState.downClues = [];
    
    // Track used cells to avoid duplicate numbering
    const numberedCells = new Set();
    
    // Process grid cells to find word starts
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            if (GameState.grid[r][c].isBlack || numberedCells.has(`${r},${c}`)) continue;

            const cellKey = `${r},${c}`;
            let hasClue = false;

            // Check if this is start of an across word
            const startAcross = (c === 0 || GameState.grid[r][c - 1].isBlack) && 
                              (c + 1 < 6 && !GameState.grid[r][c + 1].isBlack);
            
            // Check if this is start of a down word  
            const startDown = (r === 0 || GameState.grid[r - 1][c].isBlack) && 
                            (r + 1 < 6 && !GameState.grid[r + 1][c].isBlack);

            if (startAcross || startDown) {
                numberedCells.add(cellKey);
                
                // Find the word info for this position
                const wordInfo = GameState.grid[r][c].wordInfo;
                
                if (startAcross && wordInfo && wordInfo.direction === 'across') {
                    GameState.acrossClues.push({ 
                        num: clueNum, 
                        text: wordInfo.clue,
                        word: wordInfo.word,
                        length: wordInfo.word.length
                    });
                    hasClue = true;
                }
                
                if (startDown && wordInfo && wordInfo.direction === 'down') {
                    GameState.downClues.push({ 
                        num: clueNum, 
                        text: wordInfo.clue,
                        word: wordInfo.word,
                        length: wordInfo.word.length
                    });
                    hasClue = true;
                }
                
                if (hasClue) {
                    clueNum++;
                }
            }
        }
    }
    
    // If no clues were generated from wordInfo, fallback to extraction
    if (GameState.acrossClues.length === 0 && GameState.downClues.length === 0) {
        generateFallbackClues();
    }
}

function generateFallbackClues() {
    // Fallback method if wordInfo is not available
    let clueNum = 1;
    
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            if (GameState.grid[r][c].isBlack) continue;

            const startAcross = (c === 0 || GameState.grid[r][c - 1].isBlack) && 
                              (c + 1 < 6 && !GameState.grid[r][c + 1].isBlack);
            
            const startDown = (r === 0 || GameState.grid[r - 1][c].isBlack) && 
                            (r + 1 < 6 && !GameState.grid[r + 1][c].isBlack);

            if (startAcross || startDown) {
                if (startAcross) {
                    const word = extractWord(r, c, 0, 1);
                    const difficulty = Math.min(GameState.level, 6);
                    const wordPool = TECHNICAL_WORD_DB[difficulty] || TECHNICAL_WORD_DB[6];
                    const def = wordPool.find(w => w.w === word)?.d || `Technical term: ${word}`;
                    GameState.acrossClues.push({ num: clueNum, text: def, word: word, length: word.length });
                }

                if (startDown) {
                    const word = extractWord(r, c, 1, 0);
                    const difficulty = Math.min(GameState.level, 6);
                    const wordPool = TECHNICAL_WORD_DB[difficulty] || TECHNICAL_WORD_DB[6];
                    const def = wordPool.find(w => w.w === word)?.d || `Technical term: ${word}`;
                    GameState.downClues.push({ num: clueNum, text: def, word: word, length: word.length });
                }

                clueNum++;
            }
        }
    }
}

function extractWord(r, c, dr, dc) {
    let word = "";
    while (r >= 0 && r < 6 && c >= 0 && c < 6 && !GameState.grid[r][c].isBlack) {
        word += GameState.grid[r][c].char;
        r += dr;
        c += dc;
    }
    return word;
}

function renderGrid() {
    const gridEl = document.getElementById('codeword-grid');
    gridEl.innerHTML = '';

    GameState.grid.forEach((row, r) => {
        row.forEach((cell, c) => {
            const el = document.createElement('div');
            el.className = 'cell';
            el.dataset.r = r;
            el.dataset.c = c;

            if (cell.isBlack) {
                el.classList.add('black');
            } else {
                el.dataset.num = cell.num;
                // Tiny number
                const numSpan = document.createElement('span');
                numSpan.className = 'cell-number';
                numSpan.textContent = cell.num;
                el.appendChild(numSpan);

                // User letter
                const letterSpan = document.createElement('span');
                letterSpan.className = 'user-letter';
                letterSpan.textContent = cell.userChar;
                el.appendChild(letterSpan);

                // Click event
                el.addEventListener('click', () => selectNumber(cell.num));
            }
            gridEl.appendChild(el);
        });
    });
}

function renderClues() {
    const acrossEl = document.getElementById('across-clues');
    const downEl = document.getElementById('down-clues');
    acrossEl.innerHTML = '';
    downEl.innerHTML = '';

    GameState.acrossClues.forEach(clue => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="clue-num">${clue.num}.</span> ${clue.text}`;
        acrossEl.appendChild(li);
    });

    GameState.downClues.forEach(clue => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="clue-num">${clue.num}.</span> ${clue.text}`;
        downEl.appendChild(li);
    });
}

function renderDecoder() {
    const container = document.getElementById('decoder-container');
    container.innerHTML = '';

    // A-Z
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    alphabet.forEach(letter => {
        const div = document.createElement('div');
        div.className = 'key-item';
        // We don't show the number for the letter unless the user found it,
        // Actually, typical codeword UI: User sees number, types letter.
        // The bar helps track "Which number is A?"
        // We'll show: [LETTER] -> [NUMBER Found or ?]

        let foundNum = '?';
        // Check if any grid cell with this letter is filled
        // Reverse lookup: What number corresponds to this letter?
        const num = GameState.cipher[letter];

        div.innerHTML = `
            <span class="key-letter">${letter}</span>
            <span class="key-val" id="key-${num}"></span>
        `;
        container.appendChild(div);
    });
}

function revealStartingHints() {
    // Difficulty logic:
    // Lvl 1: Reveal 3 letters
    // Lvl 2: Reveal 3 letters
    // Lvl 3+: Reveal 2 letters

    let count = (GameState.level <= 2) ? 3 : 2;

    const letters = Object.keys(GameState.cipher);
    letters.sort(() => 0.5 - Math.random());
    const hints = letters.slice(0, count);

    hints.forEach(char => fillLetter(char, GameState.cipher[char]));
}

function logLevelInfo() {
    console.group(`%c LEVEL ${GameState.level} — Technical Codeword`, 'font-weight: bold; font-size: 14px; background: #222; color: #fff; padding: 4px;');

    // 1. Grid
    let gridStr = "";
    GameState.grid.forEach(row => {
        gridStr += row.map(c => c.isBlack ? '■ ' : (c.num < 10 ? c.num + ' ' : c.num)).join(' ') + '\n';
    });
    console.log(`%cGRID:\n${gridStr}`, 'font-family: monospace');

    // 2. Clues
    console.log("%cACROSS:", 'font-weight:bold');
    GameState.acrossClues.forEach(c => console.log(`${c.num}. ${c.text}`));

    console.log("%cDOWN:", 'font-weight:bold');
    GameState.downClues.forEach(c => console.log(`${c.num}. ${c.text}`));

    // 3. Answer Key
    console.groupCollapsed("Answer Key (Spoiler)");
    let answerGrid = "";
    GameState.grid.forEach(row => {
        answerGrid += row.map(c => c.isBlack ? '■ ' : c.char + ' ').join(' ') + '\n';
    });
    console.log(answerGrid);
    console.log("Mapping:", GameState.cipher);
    console.groupEnd();

    console.groupEnd();
}

/* --- Interaction --- */
function selectNumber(num) {
    if (!num) return;
    GameState.selectedNum = num;

    // Highlight all cells with this number
    document.querySelectorAll('.cell').forEach(el => {
        el.classList.remove('selected', 'same-number');
        if (parseInt(el.dataset.num) === num) {
            el.classList.add('selected');
        }
    });
}

function handleKeyInput(e) {
    if (!GameState.selectedNum) return;

    const char = e.key.toUpperCase();
    if (char.length === 1 && char >= 'A' && char <= 'Z') {
        fillLetter(char, GameState.selectedNum);
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
        fillLetter('', GameState.selectedNum);
    }
}

function fillLetter(char, num) {
    if (!num) return;

    // Update Grid State
    GameState.grid.forEach(row => row.forEach(cell => {
        if (cell.num === num) {
            cell.userChar = char;
        }
    }));

    // Update DOM
    document.querySelectorAll(`.cell[data-num="${num}"] .user-letter`).forEach(span => {
        span.textContent = char;
    });

    // Update Decoder Bar
    // Find which letter this number maps to (truth) to verify?
    // No, standard gameplay: User maps it. We just show what they typed.
    // We need to find the slot in alphabetical key logic? 
    // Actually, usually the key is "1=A, 2=B...". 
    // Here we have "A = 5, B = 12".
    // Visual aid: "A used at 5" or "5 used as A"?
    // Let's just update the grid. The bar is less critical for minimal constraints.

    checkWin();
}

function checkWin() {
    let complete = true;
    let correct = true;

    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            const cell = GameState.grid[r][c];
            if (!cell.isBlack) {
                if (cell.userChar === '') complete = false;
                if (cell.userChar !== cell.char) correct = false;
            }
        }
    }

    if (complete && correct) {
        showWin();
    }
}

function showWin() {
    document.querySelector('.modal').style.display = 'flex';
}

function nextLevel() {
    GameState.level++;
    initLevel();
}
