import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '@/components/GameContext';

// Define the different pattern types
type PatternType = 'number' | 'color' | 'shape';
type DifficultyLevel = 1 | 2 | 3;

// Level configuration
interface LevelConfig {
  patternTypes: PatternType[];
  complexityFactor: number;
  pointsPerCorrect: number;
  required: number; // Number of correct answers required to clear the level
  timeLimit?: number; // Optional time limit in seconds (for harder levels)
}

const levels: Record<DifficultyLevel, LevelConfig[]> = {
  1: [ // Easy levels
    { patternTypes: ['number'], complexityFactor: 1, pointsPerCorrect: 10, required: 3 },
    { patternTypes: ['number'], complexityFactor: 1, pointsPerCorrect: 15, required: 3 },
    { patternTypes: ['color'], complexityFactor: 1, pointsPerCorrect: 10, required: 3 },
    { patternTypes: ['color'], complexityFactor: 1, pointsPerCorrect: 15, required: 3 },
    { patternTypes: ['shape'], complexityFactor: 1, pointsPerCorrect: 10, required: 3 },
    { patternTypes: ['shape'], complexityFactor: 1, pointsPerCorrect: 15, required: 3 },
    { patternTypes: ['number', 'color'], complexityFactor: 1, pointsPerCorrect: 20, required: 4 },
    { patternTypes: ['number', 'shape'], complexityFactor: 1, pointsPerCorrect: 20, required: 4 },
    { patternTypes: ['color', 'shape'], complexityFactor: 1, pointsPerCorrect: 20, required: 4 },
    { patternTypes: ['number', 'color', 'shape'], complexityFactor: 1, pointsPerCorrect: 25, required: 5 },
  ],
  2: [ // Medium levels
    { patternTypes: ['number'], complexityFactor: 2, pointsPerCorrect: 20, required: 4 },
    { patternTypes: ['number'], complexityFactor: 2, pointsPerCorrect: 25, required: 4 },
    { patternTypes: ['color'], complexityFactor: 2, pointsPerCorrect: 20, required: 4 },
    { patternTypes: ['color'], complexityFactor: 2, pointsPerCorrect: 25, required: 4 },
    { patternTypes: ['shape'], complexityFactor: 2, pointsPerCorrect: 20, required: 4 },
    { patternTypes: ['shape'], complexityFactor: 2, pointsPerCorrect: 25, required: 4 },
    { patternTypes: ['number', 'color'], complexityFactor: 2, pointsPerCorrect: 30, required: 5, timeLimit: 120 },
    { patternTypes: ['number', 'shape'], complexityFactor: 2, pointsPerCorrect: 30, required: 5, timeLimit: 120 },
    { patternTypes: ['color', 'shape'], complexityFactor: 2, pointsPerCorrect: 30, required: 5, timeLimit: 120 },
    { patternTypes: ['number', 'color', 'shape'], complexityFactor: 2, pointsPerCorrect: 35, required: 5, timeLimit: 90 },
  ],
  3: [ // Hard levels
    { patternTypes: ['number'], complexityFactor: 3, pointsPerCorrect: 30, required: 5, timeLimit: 90 },
    { patternTypes: ['number'], complexityFactor: 3, pointsPerCorrect: 35, required: 5, timeLimit: 80 },
    { patternTypes: ['color'], complexityFactor: 3, pointsPerCorrect: 30, required: 5, timeLimit: 90 },
    { patternTypes: ['color'], complexityFactor: 3, pointsPerCorrect: 35, required: 5, timeLimit: 80 },
    { patternTypes: ['shape'], complexityFactor: 3, pointsPerCorrect: 30, required: 5, timeLimit: 90 },
    { patternTypes: ['shape'], complexityFactor: 3, pointsPerCorrect: 35, required: 5, timeLimit: 80 },
    { patternTypes: ['number', 'color'], complexityFactor: 3, pointsPerCorrect: 40, required: 6, timeLimit: 70 },
    { patternTypes: ['number', 'shape'], complexityFactor: 3, pointsPerCorrect: 40, required: 6, timeLimit: 70 },
    { patternTypes: ['color', 'shape'], complexityFactor: 3, pointsPerCorrect: 40, required: 6, timeLimit: 70 },
    { patternTypes: ['number', 'color', 'shape'], complexityFactor: 3, pointsPerCorrect: 50, required: 7, timeLimit: 60 },
  ],
};

// Pattern generators
const patterns = {
  number: [
    // Arithmetic sequences
    {
      name: 'Add',
      generate: (difficulty: number) => {
        const increment = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 5;
        const start = Math.floor(Math.random() * 10) + 1;
        return Array(6).fill(0).map((_, i) => start + increment * i);
      }
    },
    {
      name: 'Subtract',
      generate: (difficulty: number) => {
        const decrement = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 5;
        const start = 30 + Math.floor(Math.random() * 20);
        return Array(6).fill(0).map((_, i) => start - decrement * i);
      }
    },
    {
      name: 'Multiply',
      generate: (difficulty: number) => {
        const multiplier = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
        const start = Math.floor(Math.random() * 5) + 1;
        return Array(6).fill(0).map((_, i) => start * Math.pow(multiplier, i));
      }
    },
    {
      name: 'Fibonacci-like',
      generate: (difficulty: number) => {
        const a = difficulty === 1 ? 1 : difficulty === 2 ? 2 : 3;
        const b = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 5;
        const sequence = [a, b];
        for (let i = 2; i < 6; i++) {
          sequence.push(sequence[i-1] + sequence[i-2]);
        }
        return sequence;
      }
    },
    {
      name: 'Square',
      generate: (difficulty: number) => {
        const start = difficulty === 1 ? 1 : difficulty === 2 ? 2 : 3;
        return Array(6).fill(0).map((_, i) => Math.pow(start + i, 2));
      }
    }
  ],
  color: [
    {
      name: 'Rainbow',
      generate: () => {
        const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
        return colors;
      }
    },
    {
      name: 'Primary & Secondary',
      generate: () => {
        const colors = ['red', 'yellow', 'blue', 'orange', 'green', 'purple'];
        return colors;
      }
    },
    {
      name: 'Alternating',
      generate: () => {
        const colorSet = [
          ['red', 'blue', 'red', 'blue', 'red', 'blue'],
          ['green', 'yellow', 'green', 'yellow', 'green', 'yellow'],
          ['purple', 'orange', 'purple', 'orange', 'purple', 'orange']
        ];
        return colorSet[Math.floor(Math.random() * colorSet.length)];
      }
    }
  ],
  shape: [
    {
      name: 'Basic Shapes',
      generate: () => {
        const shapes = ['circle', 'square', 'triangle', 'star', 'hexagon', 'diamond'];
        return shapes;
      }
    },
    {
      name: 'Alternating',
      generate: () => {
        const shapeSet = [
          ['circle', 'square', 'circle', 'square', 'circle', 'square'],
          ['triangle', 'star', 'triangle', 'star', 'triangle', 'star'],
          ['hexagon', 'diamond', 'hexagon', 'diamond', 'hexagon', 'diamond']
        ];
        return shapeSet[Math.floor(Math.random() * shapeSet.length)];
      }
    },
    {
      name: 'Growing Sides',
      generate: () => {
        // Shapes ordered by increasing number of sides
        return ['circle', 'triangle', 'square', 'pentagon', 'hexagon', 'octagon'];
      }
    }
  ]
};

// Color mapping for the UI
const colorMap = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500'
};

// Shape mapping for the UI
const shapeMap = {
  circle: '●',
  square: '■',
  triangle: '▲',
  star: '★',
  hexagon: '⬡',
  diamond: '◆',
  pentagon: '⬠',
  octagon: '⏧'
};

export default function PatternRecognition() {
  const { updateScore, setGameCompleted } = useGameContext();
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
  const [level, setLevel] = useState<number>(0);
  const [patternType, setPatternType] = useState<PatternType>('number');
  const [sequence, setSequence] = useState<(number | string)[]>([]);
  const [hiddenIndex, setHiddenIndex] = useState<number>(-1);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [levelLocked, setLevelLocked] = useState<Record<DifficultyLevel, boolean[]>>({
    1: Array(10).fill(true).fill(false, 0, 1), // Only first level unlocked initially
    2: Array(10).fill(true).fill(false, 0, 1),
    3: Array(10).fill(true).fill(false, 0, 1)
  });
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [levelComplete, setLevelComplete] = useState(false);
  const [levelFailed, setLevelFailed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isCompactView, setIsCompactView] = useState(true);

  // Generate a new pattern
  const generatePattern = () => {
    // Reset state
    setUserAnswer('');
    setIsCorrect(null);
    
    // Get the current level config
    const currentLevelConfig = levels[difficulty][level];
    
    // Choose a random pattern type from the available types for this level
    const randomPatternType = currentLevelConfig.patternTypes[
      Math.floor(Math.random() * currentLevelConfig.patternTypes.length)
    ];
    setPatternType(randomPatternType);
    
    let newSequence: (number | string)[] = [];
    let patternIndex: number = 0;
    
    // Generate sequence based on pattern type
    if (randomPatternType === 'number') {
      patternIndex = Math.floor(Math.random() * patterns.number.length);
      newSequence = patterns.number[patternIndex].generate(difficulty);
    } else if (randomPatternType === 'color') {
      patternIndex = Math.floor(Math.random() * patterns.color.length);
      newSequence = patterns.color[patternIndex].generate();
    } else if (randomPatternType === 'shape') {
      patternIndex = Math.floor(Math.random() * patterns.shape.length);
      newSequence = patterns.shape[patternIndex].generate();
    }
    
    // Choose a random index to hide (either index 3, 4, or 5)
    const newHiddenIndex = 3 + Math.floor(Math.random() * 3);
    
    setSequence(newSequence);
    setHiddenIndex(newHiddenIndex);
    
    // Increment total attempts
    setTotalAttempts(prev => prev + 1);
    
    // Initialize time limit if applicable
    if (currentLevelConfig.timeLimit) {
      setRemainingTime(currentLevelConfig.timeLimit);
    } else {
      setRemainingTime(null);
    }
  };

  // Initialize the game
  useEffect(() => {
    // Reset level state
    setCorrectAnswers(0);
    setTotalAttempts(0);
    setLevelComplete(false);
    setMessage('');
    setLevelFailed(false);
    
    if (gameStarted) {
      generatePattern();
    }
  }, [difficulty, level, gameStarted]);

  // Countdown timer for timed levels
  useEffect(() => {
    if (gameStarted && levels[difficulty][level].timeLimit) {
      setRemainingTime(levels[difficulty][level].timeLimit);
      
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev && prev > 0) {
            return prev - 1;
          } else {
            clearInterval(timer);
            setLevelFailed(true);
            setMessage("Времето изтече! Нивото не е завършено.");
            return 0;
          }
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gameStarted, difficulty, level]);

  // Check the user's answer
  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    
    let isAnswerCorrect = false;
    
    if (patternType === 'number') {
      // For number patterns, compare the numerical value
      isAnswerCorrect = userAnswer === sequence[hiddenIndex].toString();
    } else {
      // For color and shape patterns, compare the string value
      isAnswerCorrect = userAnswer === sequence[hiddenIndex];
    }
    
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      const newCorrectAnswers = correctAnswers + 1;
      setCorrectAnswers(newCorrectAnswers);
      
      // Calculate points to award
      const points = currentLevelConfig.pointsPerCorrect;
      updateScore(points);
      
      // Check if level is complete
      if (newCorrectAnswers >= currentLevelConfig.required) {
        setLevelComplete(true);
        
        // Unlock next level
        if (level < 9) {
          const newLevelLocked = { ...levelLocked };
          newLevelLocked[difficulty][level + 1] = false;
          setLevelLocked(newLevelLocked);
        }
        
        // If this is the last level, unlock first level of next difficulty
        if (level === 9 && difficulty < 3) {
          const newLevelLocked = { ...levelLocked };
          newLevelLocked[(difficulty + 1) as DifficultyLevel][0] = false;
          setLevelLocked(newLevelLocked);
        }
        
        // Award level completion bonus
        const levelBonus = 20 * difficulty;
        updateScore(levelBonus);
        
        setMessage(`Нивото е завършено! +${points} точки и ${levelBonus} бонус за ниво!`);
      } else {
        setMessage(`Правилно! +${points} точки (${newCorrectAnswers}/${currentLevelConfig.required} необходими)`);
        
        // Generate a new pattern after a delay
        setTimeout(() => {
          generatePattern();
        }, 1500);
      }
    } else {
      setMessage('Неправилно. Опитайте отново!');
    }
  };

  // Change level if unlocked
  const changeLevel = (newLevel: number) => {
    if (!levelLocked[difficulty][newLevel]) {
      setLevel(newLevel);
      setCorrectAnswers(0);
      setRemainingTime(null);
      setUserAnswer('');
      setIsCorrect(null);
      setLevelComplete(false);
      setMessage('');
      generatePattern();
      setGameStarted(true);
    } else {
      setMessage('Това ниво все още е заключено. Завършете предишното ниво първо!');
    }
  };

  // Get options for user to select based on pattern type
  const getOptions = () => {
    if (patternType === 'number') {
      // For numbers, don't provide options
      return null;
    } else if (patternType === 'color') {
      // Return all available colors
      return Object.keys(colorMap);
    } else if (patternType === 'shape') {
      // Return all available shapes
      return Object.keys(shapeMap);
    }
    return [];
  };

  // Render pattern item based on type
  const renderPatternItem = (item: number | string, index: number) => {
    if (index === hiddenIndex) {
      return (
        <div className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg">
          ?
        </div>
      );
    }
    
    if (patternType === 'number') {
      return (
        <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-lg">
          <span className="text-xl font-bold">{item}</span>
        </div>
      );
    } else if (patternType === 'color') {
      return (
        <div className={`w-16 h-16 rounded-lg ${colorMap[item as keyof typeof colorMap]}`}></div>
      );
    } else if (patternType === 'shape') {
      return (
        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg">
          <span className="text-3xl">{shapeMap[item as keyof typeof shapeMap]}</span>
        </div>
      );
    }
    return null;
  };

  // Get display name for difficulty
  const getDifficultyDisplay = (diff: DifficultyLevel): string => {
    switch (diff) {
      case 1: return 'Лесно';
      case 2: return 'Средно';
      case 3: return 'Сложно';
    }
  };

  // Get pattern type display name
  const getPatternTypeDisplay = (type: PatternType): string => {
    switch (type) {
      case 'number': return 'Числа';
      case 'color': return 'Цветове';
      case 'shape': return 'Форми';
    }
  };

  // Get pattern type emoji
  const getPatternTypeEmoji = (type: PatternType): string => {
    switch (type) {
      case 'number': return '🔢';
      case 'color': return '🎨';
      case 'shape': return '⭐';
    }
  };

  const options = getOptions();
  const currentLevelConfig = levels[difficulty][level];

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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
              Избери тип закономерност
            </h3>
            <div className={`flex justify-center ${isCompactView ? 'gap-2' : 'gap-4'} mb-8`}>
              {(['number', 'color', 'shape'] as PatternType[]).map((typeOption) => (
                <motion.button
                  key={typeOption}
                  onClick={() => setPatternType(typeOption)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-3 rounded-lg transition-all shadow-sm ${
                    patternType === typeOption
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium'
                      : 'bg-white border border-gray-200 text-gray-800 hover:border-indigo-300'
                  } flex items-center justify-center`}
                >
                  <span className="mr-2">
                    {getPatternTypeEmoji(typeOption)}
                  </span>
                  {getPatternTypeDisplay(typeOption)}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="w-full">
            <h3 className={`${isCompactView ? 'text-lg' : 'text-xl'} font-semibold mb-8 flex items-center justify-center w-full`}>
              <span className="bg-indigo-100 p-1 rounded-md text-indigo-600 mr-2 text-sm">02</span>
              Избери трудност
            </h3>
            <div className={`flex justify-center ${isCompactView ? 'gap-2' : 'gap-4'} mb-4`}>
              {[1, 2, 3].map((diff) => (
                <motion.button
                  key={diff}
                  onClick={() => {
                    setDifficulty(diff as DifficultyLevel);
                    setLevel(0);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-3 rounded-lg transition-all shadow-sm ${
                    difficulty === diff
                      ? diff === 1 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white font-medium'
                        : diff === 2
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium'
                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white font-medium'
                      : 'bg-white border border-gray-200 text-gray-800 hover:border-indigo-300'
                  } flex items-center justify-center`}
                >
                  <span className="mr-2">
                    {diff === 1 ? '😊' : diff === 2 ? '😐' : '😰'}
                  </span>
                  {getDifficultyDisplay(diff as DifficultyLevel)}
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
                  onClick={() => !levelLocked[difficulty][lvl] && changeLevel(lvl)}
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
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center space-y-8"
        >
          <div className="mb-2 flex items-center justify-center">
            <span className="text-3xl mr-2">🧩</span>
            <h2 className={`${isCompactView ? 'text-xl' : 'text-2xl'} font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text`}>Разпознаване на закономерности</h2>
          </div>
          
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg w-full"
          >
            <div className="flex justify-between mb-4">
              <div className="flex items-center">
                <span className={`px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800`}>
                  {getDifficultyDisplay(difficulty)}
                </span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600">Ниво {level + 1}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <div className="p-1.5 rounded-md mr-1.5 bg-indigo-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Прогрес</p>
                    <p className="font-bold text-gray-800">{correctAnswers}/{currentLevelConfig.required}</p>
                  </div>
                </div>
                {remainingTime !== null && (
                  <div className="flex items-center">
                    <div className={`p-1.5 rounded-md mr-1.5 ${remainingTime <= 10 ? 'bg-red-100' : 'bg-green-100'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${remainingTime <= 10 ? 'text-red-600' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Време</p>
                      <motion.p 
                        animate={remainingTime && remainingTime <= 10 ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ repeat: remainingTime && remainingTime <= 10 ? Infinity : 0, duration: 1 }}
                        className={`font-bold ${remainingTime && remainingTime <= 10 ? 'text-red-600' : 'text-gray-800'}`}
                      >
                        {remainingTime}с
                      </motion.p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <motion.h2 
              className="text-xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Довършете модела
            </motion.h2>
            
            <div className="flex justify-center gap-4 mb-8">
              {sequence.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-lg shadow-sm ${index === hiddenIndex ? 'border-2 border-dashed border-indigo-300 bg-indigo-50' : ''}`}
                >
                  {renderPatternItem(item, index)}
                </motion.div>
              ))}
            </div>
            
            {!levelComplete ? (
              <form onSubmit={checkAnswer} className="flex flex-col items-center">
                {patternType === 'number' ? (
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Вашият отговор"
                    className={`w-60 text-center text-2xl p-3 border-2 rounded-lg mb-6 ${
                      isCorrect === true
                        ? 'border-green-500 bg-green-50'
                        : isCorrect === false
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 focus:border-indigo-500'
                    } outline-none`}
                  />
                ) : (
                  <div className="grid grid-cols-3 gap-3 mb-6 max-w-md mx-auto">
                    {options?.map((option) => (
                      <motion.button
                        key={option}
                        type="button"
                        onClick={() => setUserAnswer(option)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          userAnswer === option 
                            ? 'border-indigo-500 bg-indigo-50' 
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        {patternType === 'color' ? (
                          <div className={`w-10 h-10 rounded-full mx-auto ${colorMap[option as keyof typeof colorMap]}`}></div>
                        ) : (
                          <div className="text-3xl">{shapeMap[option as keyof typeof shapeMap]}</div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-lg transition-all shadow-md font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Проверете отговора
                </motion.button>
              </form>
            ) : (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center py-6 relative overflow-hidden"
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
                  Успешно идентифицирахте достатъчно модели, за да продължите напред.
                </motion.p>
                
                {level < 9 ? (
                  <motion.button
                    onClick={() => {
                      setLevel(level + 1);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-lg transition-all shadow-md font-medium flex items-center"
                  >
                    Към следващото ниво
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                ) : difficulty < 3 ? (
                  <motion.button
                    onClick={() => {
                      setDifficulty((difficulty + 1) as DifficultyLevel);
                      setLevel(0);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-lg transition-all shadow-md font-medium flex items-center"
                  >
                    Към следваща трудност
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                ) : (
                  <p className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Всички нива са завършени!</p>
                )}
              </motion.div>
            )}
            
            {message && !levelComplete && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-lg text-center max-w-md mx-auto ${
                  isCorrect === true
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : isCorrect === false
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                }`}
              >
                <div className="font-medium">{message}</div>
              </motion.div>
            )}
            
            <div className="flex justify-center mt-6">
              <motion.button
                onClick={generatePattern}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                disabled={levelComplete}
                className={`flex items-center px-5 py-2 rounded-lg ${
                  levelComplete
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white hover:bg-gray-50 shadow-sm border border-gray-200 text-gray-600'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Пропуснете този модел
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}