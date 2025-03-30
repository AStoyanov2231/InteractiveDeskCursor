import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '@/components/GameContext';

// Define the grid size
const GRID_SIZE = 4;
const BOX_SIZE = 2; // 2x2 boxes in our 4x4 grid

// Level configuration
// Each level has a different number of initially filled cells
const levelConfig = {
  easy: [
    { filledCells: 10, basePoints: 50 },
    { filledCells: 10, basePoints: 60 },
    { filledCells: 9, basePoints: 70 },
    { filledCells: 9, basePoints: 80 },
    { filledCells: 8, basePoints: 90 },
    { filledCells: 8, basePoints: 100 },
    { filledCells: 7, basePoints: 110 },
    { filledCells: 7, basePoints: 120 },
    { filledCells: 6, basePoints: 130 },
    { filledCells: 6, basePoints: 150 },
  ],
  medium: [
    { filledCells: 8, basePoints: 100 },
    { filledCells: 8, basePoints: 110 },
    { filledCells: 7, basePoints: 120 },
    { filledCells: 7, basePoints: 130 },
    { filledCells: 6, basePoints: 140 },
    { filledCells: 6, basePoints: 150 },
    { filledCells: 5, basePoints: 160 },
    { filledCells: 5, basePoints: 170 },
    { filledCells: 4, basePoints: 180 },
    { filledCells: 4, basePoints: 200 },
  ],
  hard: [
    { filledCells: 6, basePoints: 150 },
    { filledCells: 6, basePoints: 160 },
    { filledCells: 5, basePoints: 170 },
    { filledCells: 5, basePoints: 180 },
    { filledCells: 4, basePoints: 190 },
    { filledCells: 4, basePoints: 200 },
    { filledCells: 3, basePoints: 220 },
    { filledCells: 3, basePoints: 240 },
    { filledCells: 2, basePoints: 260 },
    { filledCells: 2, basePoints: 300 },
  ]
};

// Generate a puzzle with some filled cells
const generatePuzzle = (difficulty: 'easy' | 'medium' | 'hard', level: number) => {
  // Create a solved puzzle
  const emptyGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
  const solvedPuzzle = solveSudoku(emptyGrid);
  
  if (!solvedPuzzle) {
    // If we can't solve the puzzle (shouldn't happen), create a default one
    return { 
      puzzle: emptyGrid, 
      solution: [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]]
    };
  }
  
  // Make a copy of the solved puzzle
  const puzzle = solvedPuzzle.map(row => [...row]);
  
  // Get the number of cells to keep based on level config
  const cellsToKeep = levelConfig[difficulty][level].filledCells;
  
  // Randomly remove numbers
  const totalCells = GRID_SIZE * GRID_SIZE;
  const cellsToRemove = totalCells - cellsToKeep;
  
  let removedCount = 0;
  
  while (removedCount < cellsToRemove) {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);
    
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removedCount++;
    }
  }
  
  return { puzzle, solution: solvedPuzzle };
};

// Sudoku solver function (backtracking algorithm)
const solveSudoku = (grid: number[][]): number[][] | false => {
  const emptyCell = findEmptyCell(grid);
  
  // If no empty cell is found, the puzzle is solved
  if (!emptyCell) {
    return grid.map(row => [...row]); // Return a copy of the grid
  }
  
  const [row, col] = emptyCell;
  
  // Try placing numbers 1-4 in the empty cell
  for (let num = 1; num <= GRID_SIZE; num++) {
    // Check if it's valid to place the number
    if (isValid(grid, row, col, num)) {
      // Place the number
      grid[row][col] = num;
      
      // Recursively try to solve the rest of the puzzle
      const result = solveSudoku(grid);
      if (result) {
        return result;
      }
      
      // If we get here, the current placement didn't work, so backtrack
      grid[row][col] = 0;
    }
  }
  
  // No solution found with current configuration
  return false;
};

// Find an empty cell (value 0)
const findEmptyCell = (grid: number[][]) => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        return [row, col];
      }
    }
  }
  return null; // No empty cells
};

// Check if it's valid to place a number at a specific position
const isValid = (grid: number[][], row: number, col: number, num: number) => {
  // Check row
  for (let i = 0; i < GRID_SIZE; i++) {
    if (grid[row][i] === num) {
      return false;
    }
  }
  
  // Check column
  for (let i = 0; i < GRID_SIZE; i++) {
    if (grid[i][col] === num) {
      return false;
    }
  }
  
  // Check box
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (grid[boxRow + i][boxCol + j] === num) {
        return false;
      }
    }
  }
  
  return true;
};

// Check if the current grid is valid (no duplicates in rows, columns, boxes)
const validateGrid = (grid: number[][]) => {
  // Check rows
  for (let row = 0; row < GRID_SIZE; row++) {
    const seen = new Set<number>();
    for (let col = 0; col < GRID_SIZE; col++) {
      const value = grid[row][col];
      if (value !== 0) {
        if (seen.has(value)) {
          return false;
        }
        seen.add(value);
      }
    }
  }
  
  // Check columns
  for (let col = 0; col < GRID_SIZE; col++) {
    const seen = new Set<number>();
    for (let row = 0; row < GRID_SIZE; row++) {
      const value = grid[row][col];
      if (value !== 0) {
        if (seen.has(value)) {
          return false;
        }
        seen.add(value);
      }
    }
  }
  
  // Check boxes
  for (let boxRow = 0; boxRow < GRID_SIZE; boxRow += BOX_SIZE) {
    for (let boxCol = 0; boxCol < GRID_SIZE; boxCol += BOX_SIZE) {
      const seen = new Set<number>();
      for (let row = 0; row < BOX_SIZE; row++) {
        for (let col = 0; col < BOX_SIZE; col++) {
          const value = grid[boxRow + row][boxCol + col];
          if (value !== 0) {
            if (seen.has(value)) {
              return false;
            }
            seen.add(value);
          }
        }
      }
    }
  }
  
  return true;
};

// Check if the puzzle is completed (no empty cells and valid)
const isPuzzleComplete = (grid: number[][]) => {
  // Check for empty cells
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        return false;
      }
    }
  }
  
  // Check if the grid is valid
  return validateGrid(grid);
};

export default function LogicPuzzle() {
  const { updateScore, setGameCompleted } = useGameContext();
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [level, setLevel] = useState<number>(0);
  const [puzzle, setPuzzle] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [userGrid, setUserGrid] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [message, setMessage] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [initialCells, setInitialCells] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [levelLocked, setLevelLocked] = useState<Record<'easy' | 'medium' | 'hard', boolean[]>>({
    easy: Array(10).fill(true).fill(false, 0, 1), // Only first level unlocked initially
    medium: Array(10).fill(true).fill(false, 0, 1),
    hard: Array(10).fill(true).fill(false, 0, 1)
  });
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isCompactView, setIsCompactView] = useState(true);

  // Initialize or reset the game
  useEffect(() => {
    initializeGame();
  }, [difficulty, level]);

  const initializeGame = () => {
    const { puzzle, solution } = generatePuzzle(difficulty, level);
    
    setPuzzle(puzzle);
    setSolution(solution);
    setUserGrid(puzzle.map(row => [...row]));
    setSelectedCell(null);
    setMessage('');
    setIsComplete(false);
    setMistakes(0);
    setHintUsed(false);
    
    // Track which cells were initially filled
    const initialCellsSet = new Set<string>();
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (puzzle[row][col] !== 0) {
          initialCellsSet.add(`${row},${col}`);
        }
      }
    }
    setInitialCells(initialCellsSet);
  };

  // Handle cell selection
  const handleCellClick = (row: number, col: number) => {
    // Don't allow editing of initial cells
    if (initialCells.has(`${row},${col}`)) {
      return;
    }
    
    setSelectedCell([row, col]);
  };

  // Handle number input
  const handleNumberInput = (num: number) => {
    if (!selectedCell || isComplete) return;
    
    const [row, col] = selectedCell;
    
    // Check if this is a fixed cell
    if (initialCells.has(`${row},${col}`)) return;
    
    // Update the user grid
    const newGrid = [...userGrid];
    newGrid[row][col] = num;
    setUserGrid(newGrid);
    
    // Check if the input is correct
    if (num !== 0 && num !== solution[row][col]) {
      // Increment mistakes
      setMistakes(mistakes + 1);
      setMessage('Това число е неправилно. Опитайте друго.');
    } else {
      setMessage('');
    }
    
    // Check if the puzzle is complete
    checkPuzzleCompletion(newGrid);
  };

  // Check if the puzzle is complete
  const checkPuzzleCompletion = (grid: number[][]) => {
    // Check if all cells are filled
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col] === 0 || grid[row][col] !== solution[row][col]) {
          // Puzzle not complete yet
          return;
        }
      }
    }
    
    // If we get here, the puzzle is complete
    setIsComplete(true);
    
    // Calculate score
    const config = levelConfig[difficulty][level];
    const mistakePenalty = mistakes * 10;
    const hintPenalty = hintUsed ? 20 : 0;
    const finalScore = Math.max(0, config.basePoints - mistakePenalty - hintPenalty);
    
    // Award points
    updateScore(finalScore);
    
    // Set completion bonus based on difficulty
    const levelCompletionBonus = 
      difficulty === 'easy' ? 20 :
      difficulty === 'medium' ? 40 : 60;
    
    // Award bonus points for completing the level
    updateScore(levelCompletionBonus);
    
    // Update message
    setMessage(`Пъзелът е завършен! Вие спечелихте ${finalScore} точки и ${levelCompletionBonus} бонус точки за завършване на ниво!`);
    
    // Unlock next level
    const newLevelLocked = { ...levelLocked };
    
    if (level < 9) {
      // Unlock next level in current difficulty
      newLevelLocked[difficulty][level + 1] = false;
    } else if (difficulty !== 'hard') {
      // If we completed all levels in current difficulty, unlock first level of next difficulty
      const nextDifficulty = difficulty === 'easy' ? 'medium' : 'hard';
      newLevelLocked[nextDifficulty][0] = false;
    }
    
    setLevelLocked(newLevelLocked);
  };

  // Get a hint for the selected cell
  const getHint = () => {
    if (!selectedCell || isComplete) return;
    
    const [row, col] = selectedCell;
    
    // Check if this is a fixed cell
    if (initialCells.has(`${row},${col}`)) {
      setMessage("Всички ваши отговори са правилни досега!");
      return;
    }
    
    // Reveal the correct number
    const newGrid = [...userGrid];
    newGrid[row][col] = solution[row][col];
    setUserGrid(newGrid);
    
    // Increment hints used
    setHintUsed(true);
    setMessage("Използвана е подсказка. Това ще намали крайния ви резултат.");
    
    // Check if the puzzle is complete
    checkPuzzleCompletion(newGrid);
  };

  // Change level
  const changeLevel = (newLevel: number) => {
    if (!levelLocked[difficulty][newLevel]) {
      setLevel(newLevel);
      initializeGame();
      setGameStarted(true);
    } else {
      setMessage('Това ниво все още е заключено. Завършете предишното ниво първо!');
    }
  };

  // Get difficulty display name
  const getDifficultyDisplay = (diff: 'easy' | 'medium' | 'hard'): string => {
    switch (diff) {
      case 'easy': return 'Лесно';
      case 'medium': return 'Средно';
      case 'hard': return 'Сложно';
    }
  };

  // Get grid size display
  const getGridDisplay = (): string => {
    return `${GRID_SIZE}x${GRID_SIZE}`;
  };

  // Get cell background color based on state
  const getCellStyle = (row: number, col: number) => {
    const isSelected = selectedCell && selectedCell[0] === row && selectedCell[1] === col;
    const isInitial = initialCells.has(`${row},${col}`);
    const sameRowOrCol = selectedCell && (selectedCell[0] === row || selectedCell[1] === col);
    const sameBox = selectedCell && 
      Math.floor(row / BOX_SIZE) === Math.floor(selectedCell[0] / BOX_SIZE) && 
      Math.floor(col / BOX_SIZE) === Math.floor(selectedCell[1] / BOX_SIZE);
    
    if (isSelected) {
      return 'bg-indigo-200 border-indigo-500 shadow-inner';
    } else if (isInitial) {
      return 'bg-gray-100 font-bold text-indigo-700';
    } else if (sameRowOrCol || sameBox) {
      return 'bg-indigo-50 border-indigo-100';
    }
    return 'bg-white hover:bg-gray-50';
  };

  const config = levelConfig[difficulty][level];
  
  return (
    <div className={`w-full ${isCompactView ? 'max-w-full' : 'max-w-5xl mx-auto'}`}>
      {!gameStarted ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center space-y-4"
        >
          
          <div className="w-full">
            <h3 className={`${isCompactView ? 'text-lg' : 'text-xl'} font-semibold mb-8 flex items-center justify-center w-full`}>
              <span className="bg-indigo-100 p-1 rounded-md text-indigo-600 mr-2 text-sm">01</span>
              Избери тип пъзел
            </h3>
            <div className={`flex justify-center ${isCompactView ? 'gap-2' : 'gap-4'} mb-8`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-lg transition-all shadow-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium flex items-center justify-center"
              >
                <span className="mr-2">🧩</span>
                Судоку
              </motion.button>
            </div>
          </div>
          
          <div className="w-full">
            <h3 className={`${isCompactView ? 'text-lg' : 'text-xl'} font-semibold mb-8 flex items-center justify-center w-full`}>
              <span className="bg-indigo-100 p-1 rounded-md text-indigo-600 mr-2 text-sm">02</span>
              Избери трудност
            </h3>
            <div className={`flex justify-center ${isCompactView ? 'gap-2' : 'gap-4'} mb-8`}>
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <motion.button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-3 rounded-lg transition-all shadow-sm ${
                    difficulty === diff
                      ? diff === 'easy' 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white font-medium'
                        : diff === 'medium'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium'
                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white font-medium'
                      : 'bg-white border border-gray-200 text-gray-800 hover:border-indigo-300'
                  } flex items-center justify-center`}
                >
                  <span className="mr-2">
                    {diff === 'easy' ? '😊' : diff === 'medium' ? '😐' : '😰'}
                  </span>
                  {getDifficultyDisplay(diff)}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="w-full">
            <h3 className={`${isCompactView ? 'text-lg' : 'text-xl'} font-semibold mb-8 flex items-center justify-center w-full`}>
              <span className="bg-indigo-100 p-1 rounded-md text-indigo-600 mr-2 text-sm">03</span>
              Избери ниво
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: 10 }, (_, i) => i).map((lvl) => (
                <motion.button
                  key={lvl}
                  onClick={() => {
                    if (!levelLocked[difficulty][lvl]) {
                      setLevel(lvl);
                      initializeGame();
                      setGameStarted(true);
                    }
                  }}
                  whileHover={!levelLocked[difficulty][lvl] ? { scale: 1.05 } : {}}
                  whileTap={!levelLocked[difficulty][lvl] ? { scale: 0.98 } : {}}
                  className={`py-3 rounded-lg transition-all shadow-sm relative ${
                    level === lvl && !levelLocked[difficulty][lvl]
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium'
                      : levelLocked[difficulty][lvl]
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      : 'bg-white border border-gray-200 text-gray-800 hover:border-indigo-300'
                  }`}
                >
                  {levelLocked[difficulty][lvl] && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  )}
                  <span className={levelLocked[difficulty][lvl] ? "opacity-30" : ""}>
                    {lvl + 1}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
          
        </motion.div>
      ) : isComplete ? (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-8 relative overflow-hidden"
        >
          {/* Confetti animation */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ y: -50, opacity: 0 }}
                animate={{ 
                  y: [null, Math.random() * 400 + 100], 
                  opacity: [0, 1, 0], 
                  x: [null, (Math.random() - 0.5) * 200],
                  rotate: [0, Math.random() * 360]
                }}
                transition={{ 
                  duration: Math.random() * 2 + 2, 
                  ease: "easeOut",
                  delay: Math.random() * 0.5,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 3
                }}
              />
            ))}
          </div>

          {/* Stars and flashes */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 1.5, 
                  ease: "easeOut",
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 4
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                        fill={`rgb(${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)})`} />
                </svg>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-5xl mx-auto mb-6 shadow-lg relative"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
              boxShadow: ["0px 0px 0px rgba(0,0,0,0.1)", "0px 0px 30px rgba(255,215,0,0.6)", "0px 0px 0px rgba(0,0,0,0.1)"]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            <motion.span
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.5 }}
            >
              🏆
            </motion.span>
            <motion.div
              className="absolute -inset-4"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0, 0.5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ 
                background: "radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(255,215,0,0) 70%)",
                borderRadius: "50%"
              }}
            />
          </motion.div>
          
          <motion.h3 
            className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-transparent bg-clip-text"
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
            }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{ backgroundSize: "200% 100%" }}
          >
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 0, repeat: Infinity, repeatDelay: 3 }}
              style={{ display: "inline-block" }}
            >Н</motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 0.1, repeat: Infinity, repeatDelay: 3 }}
              style={{ display: "inline-block" }}
            >и</motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 0.2, repeat: Infinity, repeatDelay: 3 }}
              style={{ display: "inline-block" }}
            >в</motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 0.3, repeat: Infinity, repeatDelay: 3 }}
              style={{ display: "inline-block" }}
            >о</motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 0.4, repeat: Infinity, repeatDelay: 3 }}
              style={{ display: "inline-block" }}
            >т</motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 0.5, repeat: Infinity, repeatDelay: 3 }}
              style={{ display: "inline-block" }}
            >о</motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 0.6, repeat: Infinity, repeatDelay: 3 }}
              style={{ display: "inline-block", marginLeft: "8px" }}
            >е</motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 0.7, repeat: Infinity, repeatDelay: 3 }}
              style={{ display: "inline-block" }}
            >&nbsp;</motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 0.8, repeat: Infinity, repeatDelay: 3 }}
              style={{ display: "inline-block" }}
            >з</motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 0.9, repeat: Infinity, repeatDelay: 3 }}
              style={{ display: "inline-block" }}
            >а</motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 1, repeat: Infinity, repeatDelay: 3 }}
              style={{ display: "inline-block" }}
            >в</motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 1.1, repeat: Infinity, repeatDelay: 3 }}
              style={{ display: "inline-block" }}
            >ъ</motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 1.2, repeat: Infinity, repeatDelay: 3 }}
              style={{ display: "inline-block" }}
            >р</motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 1.3, repeat: Infinity, repeatDelay: 3 }}
              style={{ display: "inline-block" }}
            >ш</motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 1.4, repeat: Infinity, repeatDelay: 3 }}
              style={{ display: "inline-block" }}
            >е</motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 1.5, repeat: Infinity, repeatDelay: 3 }}
              style={{ display: "inline-block" }}
            >н</motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 1.6, repeat: Infinity, repeatDelay: 3 }}
              style={{ display: "inline-block" }}
            >о</motion.span>
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 1.7, repeat: Infinity, repeatDelay: 3 }}
              style={{ display: "inline-block" }}
            >!</motion.span>
          </motion.h3>

          <motion.p 
            className="mb-6 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {message}
          </motion.p>

          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <div className="bg-blue-50 px-3 py-2 rounded-lg flex items-center text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Грешки: <span className="font-bold">{mistakes}</span></span>
            </div>
            
            <div className="bg-purple-50 px-3 py-2 rounded-lg flex items-center text-purple-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Подсказки: <span className="font-bold">{hintUsed ? "Използвана" : "Не е използвана"}</span></span>
            </div>
          </div>
          
          {level < 9 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => changeLevel(level + 1)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-lg transition-all shadow-md font-medium flex items-center mx-auto"
            >
              Следващо ниво
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
          )}
          {level === 9 && difficulty !== 'hard' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setDifficulty(difficulty === 'easy' ? 'medium' : 'hard');
                setLevel(0);
                setIsComplete(false);
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-lg transition-all shadow-md font-medium flex items-center mx-auto"
            >
              Следваща трудност
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
          )}
          
          <motion.button
            className="mt-6 px-5 py-2 bg-white hover:bg-gray-50 shadow-sm rounded-lg border border-gray-200 text-gray-600 font-medium flex items-center mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setIsComplete(false);
              setGameStarted(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Обратно към менюто
          </motion.button>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center space-y-8"
        >
          <div className="mb-2 flex items-center justify-center">
            <span className="text-3xl mr-2">🧠</span>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Логически пъзели</h2>
          </div>

          {/* Main game area with side-by-side layout */}
          <div className="flex flex-col lg:flex-row w-full gap-6 justify-center">
            {/* Left side - Main puzzle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center"
            >
              <div className="flex justify-between items-center mb-4 w-full">
                <div className="flex items-center">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800`}>
                    {getDifficultyDisplay(difficulty)}
                  </span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-600">Ниво {level + 1}</span>
                </div>
                <div className="flex items-center">
                  <div className="p-1.5 rounded-md mr-1.5 bg-indigo-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Грешки</p>
                    <p className={`font-bold ${mistakes > 0 ? 'text-red-600' : 'text-gray-800'}`}>{mistakes}</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-center">
                Ниво {level + 1}: Попълнете мрежата
              </h3>
              
              <motion.div 
                className="mb-6 relative p-1.5 rounded-xl overflow-hidden"
                initial={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
                animate={{ 
                  boxShadow: [
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    "0 10px 15px -3px rgba(79, 70, 229, 0.2), 0 4px 6px -2px rgba(79, 70, 229, 0.1)",
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-80"></div>
                <div className="relative grid grid-cols-4 gap-1 border-2 border-gray-300 p-1 rounded-lg bg-white">
                  {Array(GRID_SIZE).fill(0).map((_, rowIndex) => (
                    Array(GRID_SIZE).fill(0).map((_, colIndex) => (
                      <motion.button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        whileHover={!initialCells.has(`${rowIndex},${colIndex}`) && !isComplete ? { scale: 1.05 } : {}}
                        whileTap={!initialCells.has(`${rowIndex},${colIndex}`) && !isComplete ? { scale: 0.95 } : {}}
                        className={`w-16 h-16 text-2xl font-medium flex items-center justify-center border transition-colors ${
                          getCellStyle(rowIndex, colIndex)
                        } ${
                          (colIndex + 1) % BOX_SIZE === 0 && colIndex !== GRID_SIZE - 1 ? 'border-r-2 border-r-gray-400' : ''
                        } ${
                          (rowIndex + 1) % BOX_SIZE === 0 && rowIndex !== GRID_SIZE - 1 ? 'border-b-2 border-b-gray-400' : ''
                        } rounded`}
                        disabled={initialCells.has(`${rowIndex},${colIndex}`) || isComplete}
                      >
                        {userGrid[rowIndex]?.[colIndex] !== 0 ? userGrid[rowIndex]?.[colIndex] : ''}
                      </motion.button>
                    ))
                  ))}
                </div>
              </motion.div>

              <div className="flex justify-center gap-3 mb-6">
                {[1, 2, 3, 4].map(num => (
                  <motion.button
                    key={num}
                    onClick={() => handleNumberInput(num)}
                    disabled={isComplete || !selectedCell}
                    whileHover={!isComplete && selectedCell ? { scale: 1.1 } : {}}
                    whileTap={!isComplete && selectedCell ? { scale: 0.9 } : {}}
                    className={`w-12 h-12 text-xl font-bold rounded-lg flex items-center justify-center shadow-sm ${
                      !isComplete && selectedCell
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {num}
                  </motion.button>
                ))}
                <motion.button
                  onClick={() => handleNumberInput(0)}
                  disabled={isComplete || !selectedCell}
                  whileHover={!isComplete && selectedCell ? { scale: 1.1 } : {}}
                  whileTap={!isComplete && selectedCell ? { scale: 0.9 } : {}}
                  className={`w-12 h-12 text-xl font-bold rounded-lg flex items-center justify-center shadow-sm ${
                    !isComplete && selectedCell
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  ⌫
                </motion.button>
              </div>
              
              <div className="flex justify-between w-full">
                <motion.button
                  onClick={getHint}
                  disabled={isComplete || !selectedCell}
                  whileHover={!isComplete && selectedCell ? { scale: 1.05 } : {}}
                  whileTap={!isComplete && selectedCell ? { scale: 0.98 } : {}}
                  className={`px-4 py-2 rounded-lg flex items-center transition-all shadow-sm ${
                    !isComplete && selectedCell
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Вземете подсказка
                </motion.button>
                
                <motion.button
                  onClick={initializeGame}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-white hover:bg-gray-50 shadow-sm rounded-lg border border-gray-200 text-gray-600 font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Нулирайте пъзела
                </motion.button>
              </div>
            </motion.div>
          </div>

          {message && !isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg max-w-xl text-center bg-amber-50 text-amber-800 border border-amber-200"
            >
              <div className="font-medium relative z-10">{message}</div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
} 