import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '@/components/GameContext';

type DifficultyLevel = 1 | 2 | 3;
type OperationType = '+' | '-' | '*' | '/';

interface LevelConfig {
  operations: OperationType[];
  maxNumber: number;
  numQuestions: number;
  timeLimit: number;
  points: number;
  allowNegatives?: boolean;
}

const levelConfigs: Record<DifficultyLevel, LevelConfig[]> = {
  1: [ // Easy levels
    { operations: ['+'], maxNumber: 10, numQuestions: 5, timeLimit: 60, points: 10 },
    { operations: ['+'], maxNumber: 20, numQuestions: 6, timeLimit: 60, points: 15 },
    { operations: ['+', '-'], maxNumber: 10, numQuestions: 6, timeLimit: 70, points: 20 },
    { operations: ['+', '-'], maxNumber: 15, numQuestions: 7, timeLimit: 70, points: 25 },
    { operations: ['+', '-'], maxNumber: 20, numQuestions: 7, timeLimit: 80, points: 30 },
    { operations: ['*'], maxNumber: 5, numQuestions: 5, timeLimit: 60, points: 35 },
    { operations: ['*'], maxNumber: 10, numQuestions: 6, timeLimit: 70, points: 40 },
    { operations: ['+', '-', '*'], maxNumber: 10, numQuestions: 7, timeLimit: 80, points: 45 },
    { operations: ['+', '-', '*'], maxNumber: 12, numQuestions: 8, timeLimit: 80, points: 50 },
    { operations: ['+', '-', '*'], maxNumber: 15, numQuestions: 8, timeLimit: 90, points: 60 },
  ],
  2: [ // Medium levels
    { operations: ['+', '-', '*'], maxNumber: 20, numQuestions: 8, timeLimit: 90, points: 70 },
    { operations: ['+', '-', '*'], maxNumber: 25, numQuestions: 9, timeLimit: 100, points: 80 },
    { operations: ['+', '-', '*', '/'], maxNumber: 20, numQuestions: 8, timeLimit: 100, points: 90 },
    { operations: ['+', '-', '*', '/'], maxNumber: 25, numQuestions: 9, timeLimit: 110, points: 100 },
    { operations: ['+', '-', '*', '/'], maxNumber: 30, numQuestions: 10, timeLimit: 120, points: 110, allowNegatives: true },
    { operations: ['+', '-', '*', '/'], maxNumber: 40, numQuestions: 10, timeLimit: 120, points: 120, allowNegatives: true },
    { operations: ['+', '-', '*', '/'], maxNumber: 50, numQuestions: 12, timeLimit: 130, points: 130, allowNegatives: true },
    { operations: ['+', '-', '*', '/'], maxNumber: 60, numQuestions: 12, timeLimit: 140, points: 140, allowNegatives: true },
    { operations: ['+', '-', '*', '/'], maxNumber: 75, numQuestions: 14, timeLimit: 150, points: 150, allowNegatives: true },
    { operations: ['+', '-', '*', '/'], maxNumber: 100, numQuestions: 15, timeLimit: 180, points: 180, allowNegatives: true },
  ],
  3: [ // Hard levels
    { operations: ['+', '-', '*', '/'], maxNumber: 100, numQuestions: 12, timeLimit: 120, points: 200, allowNegatives: true },
    { operations: ['+', '-', '*', '/'], maxNumber: 150, numQuestions: 15, timeLimit: 150, points: 220, allowNegatives: true },
    { operations: ['+', '-', '*', '/'], maxNumber: 200, numQuestions: 15, timeLimit: 150, points: 240, allowNegatives: true },
    { operations: ['+', '-', '*', '/'], maxNumber: 250, numQuestions: 18, timeLimit: 180, points: 260, allowNegatives: true },
    { operations: ['+', '-', '*', '/'], maxNumber: 300, numQuestions: 20, timeLimit: 200, points: 280, allowNegatives: true },
    { operations: ['+', '-', '*', '/'], maxNumber: 350, numQuestions: 20, timeLimit: 200, points: 300, allowNegatives: true },
    { operations: ['+', '-', '*', '/'], maxNumber: 400, numQuestions: 25, timeLimit: 220, points: 350, allowNegatives: true },
    { operations: ['+', '-', '*', '/'], maxNumber: 450, numQuestions: 25, timeLimit: 220, points: 400, allowNegatives: true },
    { operations: ['+', '-', '*', '/'], maxNumber: 500, numQuestions: 30, timeLimit: 240, points: 450, allowNegatives: true },
    { operations: ['+', '-', '*', '/'], maxNumber: 1000, numQuestions: 30, timeLimit: 300, points: 500, allowNegatives: true },
  ]
};

export default function MathPuzzle() {
  const { updateScore, setGameCompleted } = useGameContext();
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
  const [level, setLevel] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [questions, setQuestions] = useState<Array<{
    question: string;
    answer: number;
  }>>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [levelComplete, setLevelComplete] = useState<boolean>(false);
  const [levelLocked, setLevelLocked] = useState<Record<DifficultyLevel, boolean[]>>({
    1: Array(10).fill(true).fill(false, 0, 1), // Only first level unlocked initially
    2: Array(10).fill(true).fill(false, 0, 1),
    3: Array(10).fill(true).fill(false, 0, 1)
  });
  const [isCompactView, setIsCompactView] = useState(true);

  // Generate a math problem based on difficulty and operation
  const generateQuestion = (config: LevelConfig) => {
    const { operations, maxNumber, allowNegatives } = config;
    
    // Randomly select an operation
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2, answer;
    
    // Generate valid numbers for this operation
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * maxNumber) + 1;
        num2 = Math.floor(Math.random() * maxNumber) + 1;
        answer = num1 + num2;
        break;
      case '-':
        if (allowNegatives) {
          // Allow negative answers
          num1 = Math.floor(Math.random() * maxNumber) + 1;
          num2 = Math.floor(Math.random() * maxNumber) + 1;
        } else {
          // Ensure positive answers
          num2 = Math.floor(Math.random() * maxNumber) + 1;
          num1 = num2 + Math.floor(Math.random() * (maxNumber - num2)) + 1;
        }
        answer = num1 - num2;
        break;
      case '*':
        // Keep multiplication manageable
        const max = Math.min(maxNumber, 12);
        num1 = Math.floor(Math.random() * max) + 1;
        num2 = Math.floor(Math.random() * max) + 1;
        answer = num1 * num2;
        break;
      case '/':
        // Ensure division results in a whole number
        num2 = Math.floor(Math.random() * 10) + 1;
        num1 = num2 * (Math.floor(Math.random() * 10) + 1);
        if (num1 > maxNumber) {
          num1 = Math.floor(maxNumber / 10) * 10;
          num2 = Math.floor(num1 / (Math.floor(Math.random() * 5) + 1));
        }
        answer = num1 / num2;
        break;
    }
    
    return {
      question: `${num1} ${operation} ${num2} = ?`,
      answer
    };
  };

  // Generate a set of questions
  const generateQuestions = () => {
    const config = levelConfigs[difficulty][level];
    const newQuestions = [];
    
    for (let i = 0; i < config.numQuestions; i++) {
      newQuestions.push(generateQuestion(config));
    }
    
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setTimeLeft(config.timeLimit);
    setScore(0);
    setIsCorrect(null);
    setMessage('');
    setGameOver(false);
    setLevelComplete(false);
  };

  // Start the game
  const startGame = () => {
    generateQuestions();
    setGameStarted(true);
  };

  // Check user's answer
  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userAnswer) return;
    
    const current = questions[currentQuestion];
    const userNum = parseFloat(userAnswer);
    
    if (userNum === current.answer) {
      setScore(prev => prev + 1);
      setIsCorrect(true);
      setMessage('Правилно!');
      
      // Check if we've finished all questions
      if (currentQuestion === questions.length - 1) {
        handleLevelComplete();
      } else {
        // Move to the next question after a delay
        setTimeout(() => {
          setCurrentQuestion(prev => prev + 1);
          setUserAnswer('');
          setIsCorrect(null);
          setMessage('');
        }, 1000);
      }
    } else {
      setIsCorrect(false);
      setMessage(`Неправилно. Правилният отговор е ${current.answer}.`);
      
      // Move to the next question after a delay
      setTimeout(() => {
        if (currentQuestion === questions.length - 1) {
          handleLevelComplete();
        } else {
          setCurrentQuestion(prev => prev + 1);
          setUserAnswer('');
          setIsCorrect(null);
          setMessage('');
        }
      }, 2000);
    }
  };

  // Handle timer
  useEffect(() => {
    if (!gameStarted || timeLeft === null) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft]);

  // Handle level completion
  const handleLevelComplete = () => {
    setLevelComplete(true);
    const config = levelConfigs[difficulty][level];
    
    // Calculate points based on correct answers
    const correctPercentage = score / config.numQuestions;
    const earnedPoints = Math.floor(config.points * correctPercentage);
    
    // Add time bonus
    const timeBonus = Math.floor((timeLeft || 0) * 0.5);
    const totalPoints = earnedPoints + timeBonus;
    
    updateScore(totalPoints);
    setMessage(`Нивото е завършено! Вие сте спечелили ${earnedPoints} точки + ${timeBonus} бонус за време = ${totalPoints} общо точки!`);
    
    // Unlock next level
    if (level < 9) {
      const newLevelLocked = { ...levelLocked };
      newLevelLocked[difficulty][level + 1] = false;
      setLevelLocked(newLevelLocked);
    }
    
    // Unlock first level of next difficulty if this is the last level
    if (level === 9) {
      if (difficulty < 3) {
        const newLevelLocked = { ...levelLocked };
        newLevelLocked[difficulty + 1 as DifficultyLevel][0] = false;
        setLevelLocked(newLevelLocked);
      } else if (difficulty === 3) {
        setGameCompleted(true);
      }
    }
  };

  // Handle game over (time's up)
  const handleGameOver = () => {
    setGameOver(true);
    const config = levelConfigs[difficulty][level];
    
    // Calculate points based on correct answers so far
    const earnedPoints = Math.floor(config.points * (score / config.numQuestions));
    updateScore(earnedPoints);
    
    setMessage(`Времето изтече! Вие сте спечелили ${earnedPoints} точки.`);
  };

  // Move to next level
  const goToNextLevel = () => {
    if (level < 9) {
      setLevel(level + 1);
      startGame();
    } else if (difficulty < 3) {
      setDifficulty((difficulty + 1) as DifficultyLevel);
      setLevel(0);
      startGame();
    }
  };

  // Change level
  const changeLevel = (newLevel: number) => {
    if (!levelLocked[difficulty][newLevel]) {
      setLevel(newLevel);
      startGame();
    }
  };

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Get difficulty display name
  const getDifficultyDisplay = (diff: DifficultyLevel): string => {
    switch (diff) {
      case 1: return 'Лесно';
      case 2: return 'Средно';
      case 3: return 'Сложно';
    }
  };

  // Helper function to display operations in readable form
  const getOperationDisplay = (op: OperationType): string => {
    switch (op) {
      case '+': return 'Събиране';
      case '-': return 'Изваждане';
      case '*': return 'Умножение';
      case '/': return 'Деление';
    }
  };

  const config = levelConfigs[difficulty][level];

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
              Избери тип задачи
            </h3>
            <div className={`flex justify-center ${isCompactView ? 'gap-2' : 'gap-4'} mb-8`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-lg transition-all shadow-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium flex items-center justify-center"
              >
                <span className="mr-2">🔢</span>
                Математика
              </motion.button>
            </div>
          </div>
          
          <div className="w-full">
            <h3 className={`${isCompactView ? 'text-lg' : 'text-xl'} font-semibold mb-8 flex items-center justify-center w-full`}>
              <span className="bg-indigo-100 p-1 rounded-md text-indigo-600 mr-2 text-sm">02</span>
              Избери трудност
            </h3>
            <div className={`flex justify-center ${isCompactView ? 'gap-2' : 'gap-4'} mb-8`}>
              {[1, 2, 3].map((diff) => (
                <motion.button
                  key={diff}
                  onClick={() => setDifficulty(diff as DifficultyLevel)}
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
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
            <div className="flex justify-between items-center mb-6 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Математическо предизвикателство</h2>
                <div className="flex items-center mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    difficulty === 1 ? 'bg-green-100 text-green-800' : 
                    difficulty === 2 ? 'bg-yellow-100 text-yellow-800' : 
                                       'bg-red-100 text-red-800'
                  }`}>
                    {getDifficultyDisplay(difficulty)}
                  </span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-600">Ниво {level + 1}</span>
                </div>
              </div>
              
              <div className="flex space-x-6 mt-2 sm:mt-0">
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <div className={`p-1.5 rounded-md mr-1.5 ${timeLeft && timeLeft < 10 ? 'bg-red-100' : 'bg-green-100'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${timeLeft && timeLeft < 10 ? 'text-red-600' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Време</p>
                      <motion.p 
                        animate={timeLeft && timeLeft < 10 ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ repeat: timeLeft && timeLeft < 10 ? Infinity : 0, duration: 1 }}
                        className={`font-bold ${timeLeft && timeLeft < 10 ? 'text-red-600' : 'text-gray-800'}`}
                      >
                        {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
                      </motion.p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <div className="p-1.5 rounded-md mr-1.5 bg-purple-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Въпрос</p>
                      <p className="font-bold text-gray-800">{currentQuestion + 1}/{config.numQuestions}</p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <div className="p-1.5 rounded-md mr-1.5 bg-indigo-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Резултат</p>
                      <p className="font-bold text-gray-800">{score}/{config.numQuestions}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {levelComplete ? (
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
                  className="mb-2 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Вие отговорихте правилно на <span className="font-bold text-indigo-600">{score}</span> от <span className="font-bold text-indigo-600">{config.numQuestions}</span> въпроса!
                </motion.p>
                
                <motion.p 
                  className="mb-6 flex justify-center gap-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <span className="font-medium text-gray-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg> 
                    Останало време: {formatTime(timeLeft || 0)}
                  </span>
                </motion.p>
                
                {level < 9 || difficulty < 3 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={goToNextLevel}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-lg transition-all shadow-md font-medium flex items-center mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      boxShadow: ["0px 4px 6px rgba(99, 102, 241, 0.3)", "0px 6px 15px rgba(99, 102, 241, 0.5)", "0px 4px 6px rgba(99, 102, 241, 0.3)"]
                    }}
                    transition={{ 
                      delay: 0.9,
                      boxShadow: { repeat: Infinity, duration: 2 }
                    }}
                  >
                    {level < 9 ? 'Следващо ниво' : 'Следваща трудност'}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                ) : (
                  <motion.p 
                    className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    Всички нива са завършени!
                  </motion.p>
                )}
              </motion.div>
            ) : gameOver ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-4xl mx-auto mb-6">
                  ⏱️
                </div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">Времето изтече!</h3>
                <p className="mb-6 text-lg">Вие отговорихте правилно на {score} от {config.numQuestions} въпроса.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startGame}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-lg transition-all shadow-md font-medium flex items-center mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Опитайте отново
                </motion.button>
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <motion.h3 
                    className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {questions[currentQuestion]?.question}
                  </motion.h3>
                  
                  <form onSubmit={checkAnswer} className="flex flex-col items-center">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className={`w-40 text-center text-2xl p-4 border-2 rounded-lg mb-6 ${
                        isCorrect === true
                          ? 'border-green-500 bg-green-50'
                          : isCorrect === false
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-indigo-500'
                      } outline-none`}
                      placeholder="Вашият отговор"
                      autoFocus
                    />
                    
                    <motion.button
                      type="submit"
                      disabled={!!isCorrect}
                      whileHover={{ scale: isCorrect === null ? 1.05 : 1 }}
                      whileTap={{ scale: isCorrect === null ? 0.98 : 1 }}
                      className={`py-3 px-8 rounded-lg transition-all shadow-md font-medium flex items-center ${
                        isCorrect !== null
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      }`}
                    >
                      {isCorrect === null && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      Изпрати
                    </motion.button>
                    
                    {message && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-6 p-4 rounded-lg w-full max-w-sm ${
                          isCorrect === true
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : isCorrect === false
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : ''
                        }`}
                      >
                        <div className="font-medium">{message}</div>
                      </motion.div>
                    )}
                  </form>
                </motion.div>
                
                <div className="mt-8 flex justify-center">
                  <div className="flex space-x-2">
                    {Array.from({ length: config.numQuestions }).map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                          index < currentQuestion
                            ? score > index
                              ? 'bg-green-500'
                              : 'bg-red-500'
                            : index === currentQuestion
                            ? 'bg-indigo-500 animate-pulse'
                            : 'bg-gray-200'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setGameStarted(false);
                setCurrentQuestion(0);
                setScore(0);
                setUserAnswer('');
                setIsCorrect(null);
                setMessage('');
                setGameOver(false);
                setLevelComplete(false);
              }}
              className="px-5 py-2 bg-white hover:bg-gray-50 shadow-sm rounded-lg border border-gray-200 text-gray-600 font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Обратно към менюто
            </motion.button>
            
            <div className="bg-indigo-50 px-4 py-2 rounded-lg flex items-center text-sm">
              <span className="text-indigo-600 font-medium">Операции: </span>
              <span className="ml-2 text-gray-700">{config.operations.join(', ')} • Макс. число: {config.maxNumber}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 