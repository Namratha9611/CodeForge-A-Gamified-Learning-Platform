const puzzles = [
    {
        level: 1,
        gridSize: { rows: 7, cols: 7 },
        grid: [
            "D#S#A##",
            "EXTENDS",
            "B#A#C#E",
            "U#C#H#L",
            "G#K#O#E",
            "####R#C",
            "######T"
        ],
        clues: {
            across: [
                { number: 4, answer: "EXTENDS", clue: "Java keyword used for inheritance", row: 1, col: 0 }
            ],
            down: [
                { number: 1, answer: "DEBUG", clue: "Process of finding and fixing errors", row: 0, col: 0 },
                { number: 2, answer: "STACK", clue: "Data structure that follows LIFO principle", row: 0, col: 2 },
                { number: 3, answer: "ANCHOR", clue: "HTML tag used to create a hyperlink", row: 0, col: 4 },
                { number: 5, answer: "SELECT", clue: "SQL command used to retrieve data", row: 1, col: 6 }
            ]
        }
    },
    {
        level: 2,
        gridSize: { rows: 7, cols: 7 },
        grid: [
            "###SQ##",
            "###QU##",
            "TUPLE##",
            "####ROW",
            "####Y##",
            "#######",
            "#######"
        ],
        clues: {
            across: [
                { number: 3, answer: "TUPLE", clue: "A single row in a database table", row: 2, col: 0 },
                { number: 5, answer: "ROW", clue: "Horizontal record in a table", row: 3, col: 4 }
            ],
            down: [
                { number: 1, answer: "SQL", clue: "Language for managing databases", row: 0, col: 3 },
                { number: 2, answer: "QUERY", clue: "Request to retrieve data", row: 0, col: 4 }
            ]
        }
    },
    {
        level: 3,
        gridSize: { rows: 7, cols: 7 },
        grid: [
            "CSS####",
            "##T####",
            "##Y####",
            "HTML###",
            "##E#I##",
            "####N##",
            "####K##"
        ],
        clues: {
            across: [
                { number: 1, answer: "CSS", clue: "Language for styling web pages", row: 0, col: 0 },
                { number: 3, answer: "HTML", clue: "Standard markup language for web", row: 3, col: 0 }
            ],
            down: [
                { number: 2, answer: "STYLE", clue: "Appearance or design of text/elements", row: 0, col: 2 },
                { number: 4, answer: "LINK", clue: "Element connecting web resources", row: 4, col: 4 }
            ]
        }
    }
];

// ========== GAME STATE ==========
let currentLevel = 0;
let score = 0;
const XP_PER_LEVEL = 50;

// ========== DOM ELEMENTS ==========
const gridContainer = document.getElementById('crosswordGrid');
const acrossCluesContainer = document.getElementById('acrossClues');
const downCluesContainer = document.getElementById('downClues');
const checkButton = document.getElementById('checkButton');
const levelDisplay = document.getElementById('levelDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const successModal = document.getElementById('successModal');
const completionModal = document.getElementById('completionModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const xpEarned = document.getElementById('xpEarned');
const finalScore = document.getElementById('finalScore');

// ========== INITIALIZE GAME ==========
function initGame() {
    if (currentLevel >= puzzles.length) {
        showCompletionModal();
        return;
    }

    const puzzle = puzzles[currentLevel];
    renderGrid(puzzle);
    renderClues(puzzle);
    updateDisplay();
}

// ========== RENDER CROSSWORD GRID ==========
function renderGrid(puzzle) {
    gridContainer.innerHTML = '';
    const { rows, cols } = puzzle.gridSize;

    // Set CSS Grid layout
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 50px)`;
    gridContainer.style.gridTemplateRows = `repeat(${rows}, 50px)`;

    // Get all clue numbers and their positions
    const cellNumbers = {};
    puzzle.clues.across.forEach(clue => {
        const key = `${clue.row}-${clue.col}`;
        cellNumbers[key] = clue.number;
    });
    puzzle.clues.down.forEach(clue => {
        const key = `${clue.row}-${clue.col}`;
        if (!cellNumbers[key]) {
            cellNumbers[key] = clue.number;
        }
    });

    // Create cells
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const char = puzzle.grid[row][col];
            const key = `${row}-${col}`;
            const cellNumber = cellNumbers[key];

            // Create cell container
            const cellContainer = document.createElement('div');
            cellContainer.className = 'cell-container';

            // Add number label if this cell starts a word
            if (cellNumber) {
                const numberLabel = document.createElement('span');
                numberLabel.className = 'cell-number';
                numberLabel.textContent = cellNumber;
                cellContainer.appendChild(numberLabel);
            }

            // Create input element
            const cell = document.createElement('input');
            cell.className = 'crossword-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.dataset.answer = char;

            if (char === '#') {
                // Blocked cell
                cell.disabled = true;
                cell.classList.add('blocked');
                cellContainer.classList.add('blocked');
            } else {
                // Active cell
                cell.maxLength = 1;
                cell.addEventListener('input', handleInput);
                cell.addEventListener('keydown', handleKeyNavigation);
            }

            cellContainer.appendChild(cell);
            gridContainer.appendChild(cellContainer);
        }
    }
}

// ========== HANDLE INPUT ==========
function handleInput(e) {
    const input = e.target;
    input.value = input.value.toUpperCase();

    // Auto-focus next cell
    if (input.value && !input.classList.contains('blocked')) {
        const nextCell = getNextCell(input);
        if (nextCell) nextCell.focus();
    }
}

// ========== KEYBOARD NAVIGATION ==========
function handleKeyNavigation(e) {
    const input = e.target;
    const row = parseInt(input.dataset.row);
    const col = parseInt(input.dataset.col);
    const puzzle = puzzles[currentLevel];
    const { rows, cols } = puzzle.gridSize;

    let newRow = row;
    let newCol = col;

    switch (e.key) {
        case 'ArrowUp':
            newRow = Math.max(0, row - 1);
            e.preventDefault();
            break;
        case 'ArrowDown':
            newRow = Math.min(rows - 1, row + 1);
            e.preventDefault();
            break;
        case 'ArrowLeft':
            newCol = Math.max(0, col - 1);
            e.preventDefault();
            break;
        case 'ArrowRight':
            newCol = Math.min(cols - 1, col + 1);
            e.preventDefault();
            break;
        case 'Backspace':
            if (!input.value) {
                const prevCell = getPrevCell(input);
                if (prevCell) {
                    prevCell.value = '';
                    prevCell.focus();
                }
            }
            return;
        default:
            return;
    }

    const targetCell = getCellAt(newRow, newCol);
    if (targetCell && !targetCell.disabled) {
        targetCell.focus();
    }
}

// ========== HELPER FUNCTIONS ==========
function getNextCell(currentCell) {
    const cells = Array.from(gridContainer.querySelectorAll('.crossword-cell:not(.blocked)'));
    const currentIndex = cells.indexOf(currentCell);
    return cells[currentIndex + 1] || null;
}

function getPrevCell(currentCell) {
    const cells = Array.from(gridContainer.querySelectorAll('.crossword-cell:not(.blocked)'));
    const currentIndex = cells.indexOf(currentCell);
    return cells[currentIndex - 1] || null;
}

function getCellAt(row, col) {
    return gridContainer.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

// ========== RENDER CLUES ==========
function renderClues(puzzle) {
    // Render Across clues
    acrossCluesContainer.innerHTML = '';
    puzzle.clues.across.forEach(clue => {
        const clueElement = document.createElement('div');
        clueElement.className = 'clue-item';
        clueElement.innerHTML = `
            <span class="clue-number">${clue.number}.</span>
            <span class="clue-text">${clue.clue}</span>
        `;
        acrossCluesContainer.appendChild(clueElement);
    });

    // Render Down clues
    downCluesContainer.innerHTML = '';
    puzzle.clues.down.forEach(clue => {
        const clueElement = document.createElement('div');
        clueElement.className = 'clue-item';
        clueElement.innerHTML = `
            <span class="clue-number">${clue.number}.</span>
            <span class="clue-text">${clue.clue}</span>
        `;
        downCluesContainer.appendChild(clueElement);
    });
}

// ========== CHECK ANSWERS ==========
function checkAnswers() {
    const cells = gridContainer.querySelectorAll('.crossword-cell:not(.blocked)');
    let allCorrect = true;

    cells.forEach(cell => {
        const userAnswer = cell.value.toUpperCase();
        const correctAnswer = cell.dataset.answer;

        // Remove previous classes
        cell.classList.remove('correct', 'incorrect');

        if (userAnswer === correctAnswer) {
            cell.classList.add('correct');
        } else {
            cell.classList.add('incorrect');
            allCorrect = false;
        }
    });

    if (allCorrect) {
        setTimeout(() => {
            levelComplete();
        }, 500);
    }
}

// ========== LEVEL COMPLETE ==========
function levelComplete() {
    score += XP_PER_LEVEL;
    updateDisplay();

    if (currentLevel < puzzles.length - 1) {
        // More levels available
        showSuccessModal();
        setTimeout(() => {
            currentLevel++;
            hideSuccessModal();
            initGame();
        }, 2500);
    } else {
        // All levels complete
        setTimeout(() => {
            showCompletionModal();
        }, 500);
    }
}

// ========== UPDATE DISPLAY ==========
function updateDisplay() {
    levelDisplay.textContent = currentLevel + 1;
    scoreDisplay.textContent = score;
    xpEarned.textContent = `+${XP_PER_LEVEL}`;
    finalScore.textContent = score;
}

// ========== MODAL FUNCTIONS ==========
function showSuccessModal() {
    modalTitle.textContent = `Level ${currentLevel + 1} Complete!`;
    modalMessage.textContent = 'Great job! Moving to next level...';
    successModal.classList.add('active');
}

function hideSuccessModal() {
    successModal.classList.remove('active');
}

function showCompletionModal() {
    completionModal.classList.add('active');
}

// ========== EVENT LISTENERS ==========
checkButton.addEventListener('click', checkAnswers);

// ========== START GAME ==========
initGame();
