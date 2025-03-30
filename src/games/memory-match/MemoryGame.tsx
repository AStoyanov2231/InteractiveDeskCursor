import { useState, useEffect } from 'react';
import MemoryCard, { Card } from './MemoryCard';
import { useGameContext } from '@/components/GameContext';
import { motion } from 'framer-motion';

// Define card categories based on themes
const cardCategories = {
  animals: [
    '🦁', // lion
    '🐘', // elephant
    '🐯', // tiger
    '🦒', // giraffe
    '🐵', // monkey
    '🐼', // panda
    '🐧', // penguin
    '🐨', // koala
    '🐻', // bear
    '🦊', // fox
    '🐺', // wolf
    '🦓', // zebra
    '🦛', // hippo
    '🦏', // rhino
    '🦘', // kangaroo
  ],
  fruits: [
    '🍎', // apple
    '🍌', // banana
    '🍊', // orange
    '🍓', // strawberry
    '🍇', // grapes
    '🍍', // pineapple
    '🍉', // watermelon
    '🍒', // cherry
    '🍑', // peach
    '🍐', // pear
    '🥭', // mango
    '🥝', // kiwi
    '🥥', // coconut
    '🍋', // lemon
    '🫐', // blueberry
  ],
  space: [
    '🪐', // planet
    '🚀', // rocket
    '👨‍🚀', // astronaut
    '🛰️', // satellite
    '☄️', // comet
    '🌙', // moon
    '👽', // alien
    '🛸', // ufo
    '⭐', // star
    '🌌', // galaxy
    '🕳️', // blackhole
    '🔭', // telescope
    '☄️', // meteor
    '🚀', // spaceship
    '☀️', // sun
  ]
};

// Level configuration
type DifficultyLevel = 1 | 2 | 3;

interface LevelConfig {
  pairs: number;            // Number of pairs to match
  timeLimit: number;        // Time limit in seconds
  points: number;           // Base points for completing the level
  gridSize: number;         // Size of the square grid (e.g. 2 for 2x2, 4 for 4x4)
  theme?: string;           // Optional specific theme
}

const levelConfigs: Record<DifficultyLevel, LevelConfig[]> = {
  1: [ // Easy levels
    { pairs: 2, timeLimit: 45, points: 10, gridSize: 2 },      // 2x2 grid (4 cards)
    { pairs: 4, timeLimit: 60, points: 15, gridSize: 4 },      // 4x4 grid (16 cards, only 8 used)
    { pairs: 8, timeLimit: 70, points: 20, gridSize: 4 },      // 4x4 grid (16 cards)
    { pairs: 8, timeLimit: 65, points: 25, gridSize: 4 },      // 4x4 grid (16 cards)
    { pairs: 18, timeLimit: 100, points: 30, gridSize: 6 },    // 6x6 grid (36 cards)
    { pairs: 18, timeLimit: 95, points: 35, gridSize: 6 },     // 6x6 grid (36 cards)
    { pairs: 18, timeLimit: 90, points: 40, gridSize: 6 },     // 6x6 grid (36 cards)
    { pairs: 18, timeLimit: 85, points: 45, gridSize: 6 },     // 6x6 grid (36 cards)
    { pairs: 18, timeLimit: 80, points: 50, gridSize: 6 },     // 6x6 grid (36 cards)
    { pairs: 18, timeLimit: 75, points: 60, gridSize: 6 },     // 6x6 grid (36 cards)
  ],
  2: [ // Medium levels
    { pairs: 8, timeLimit: 50, points: 30, gridSize: 4 },      // 4x4 grid (16 cards)
    { pairs: 8, timeLimit: 45, points: 40, gridSize: 4 },      // 4x4 grid (16 cards)
    { pairs: 8, timeLimit: 40, points: 50, gridSize: 4 },      // 4x4 grid (16 cards)
    { pairs: 18, timeLimit: 70, points: 60, gridSize: 6 },     // 6x6 grid (36 cards)
    { pairs: 18, timeLimit: 65, points: 70, gridSize: 6 },     // 6x6 grid (36 cards)
    { pairs: 18, timeLimit: 60, points: 80, gridSize: 6 },     // 6x6 grid (36 cards)
    { pairs: 18, timeLimit: 55, points: 90, gridSize: 6 },     // 6x6 grid (36 cards)
    { pairs: 18, timeLimit: 50, points: 100, gridSize: 6 },    // 6x6 grid (36 cards)
    { pairs: 18, timeLimit: 45, points: 110, gridSize: 6 },    // 6x6 grid (36 cards)
    { pairs: 18, timeLimit: 40, points: 120, gridSize: 6 },    // 6x6 grid (36 cards)
  ],
  3: [ // Hard levels
    { pairs: 8, timeLimit: 35, points: 70, gridSize: 4 },      // 4x4 grid (16 cards)
    { pairs: 8, timeLimit: 30, points: 90, gridSize: 4 },      // 4x4 grid (16 cards)
    { pairs: 18, timeLimit: 55, points: 100, gridSize: 6 },    // 6x6 grid (36 cards)
    { pairs: 18, timeLimit: 50, points: 120, gridSize: 6 },    // 6x6 grid (36 cards)
    { pairs: 18, timeLimit: 45, points: 150, gridSize: 6 },    // 6x6 grid (36 cards)
    { pairs: 18, timeLimit: 40, points: 180, gridSize: 6 },    // 6x6 grid (36 cards)
    { pairs: 18, timeLimit: 35, points: 200, gridSize: 6 },    // 6x6 grid (36 cards)
    { pairs: 18, timeLimit: 30, points: 220, gridSize: 6 },    // 6x6 grid (36 cards)
    { pairs: 18, timeLimit: 25, points: 250, gridSize: 6 },    // 6x6 grid (36 cards)
    { pairs: 18, timeLimit: 20, points: 300, gridSize: 6 },    // 6x6 grid (36 cards)
  ]
};

export default function MemoryGame() {
  const { updateScore, setGameCompleted } = useGameContext();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [levelComplete, setLevelComplete] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
  const [level, setLevel] = useState<number>(0);
  const [theme, setTheme] = useState<'animals' | 'fruits' | 'space'>('animals');
  const [levelLocked, setLevelLocked] = useState<Record<DifficultyLevel, boolean[]>>({
    1: Array(10).fill(false), // All levels unlocked by default
    2: Array(10).fill(false),
    3: Array(10).fill(false)
  });
  const [pointsToAward, setPointsToAward] = useState<number | null>(null);
  const [isCompactView, setIsCompactView] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTimer, setPreviewTimer] = useState(2);
  const [showTimeBonus, setShowTimeBonus] = useState(false);

  // Initialize game based on level and difficulty
  useEffect(() => {
    if (gameStarted) resetGame();
  }, [difficulty, level, theme]);

  // Handle timer
  useEffect(() => {
    if (!gameStarted || timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
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

  // Handle preview timer
  useEffect(() => {
    if (!showPreview || previewTimer <= 0) return;

    const timer = setInterval(() => {
      setPreviewTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowPreview(false);
          setPreviewTimer(2);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showPreview, previewTimer]);

  // Shuffle cards to create a random order
  const shuffleCards = (cardArray: Card[]): Card[] => {
    const shuffled = [...cardArray];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize or reset the game
  const resetGame = () => {
    // Get level configuration
    const config = levelConfigs[difficulty][level];
    
    // Choose a random theme if not specified
    const gameTheme = config.theme || theme;
    
    // Calculate total grid squares and needed pairs
    const totalSquares = config.gridSize * config.gridSize;
    const neededPairs = totalSquares / 2;
    
    // Ensure we have enough images for the pairs
    let categoryImages = cardCategories[gameTheme as keyof typeof cardCategories];
    
    // If we need more images than available, duplicate some
    if (neededPairs > categoryImages.length) {
      while (categoryImages.length < neededPairs) {
        categoryImages = [...categoryImages, ...categoryImages].slice(0, neededPairs);
      }
    }
    
    // Get images based on the number of pairs needed
    const images = categoryImages.slice(0, neededPairs);
    
    // Create pairs of cards
    const cardPairs = images.flatMap((img, index) => [
      { id: index * 2, imageSrc: img, matched: false, difficulty, level },
      { id: index * 2 + 1, imageSrc: img, matched: false, difficulty, level }
    ]);
    
    // Debug log to verify cards
    console.log(`Grid size: ${config.gridSize}x${config.gridSize}, Total squares: ${totalSquares}, Pairs: ${neededPairs}`);
    console.log('Card pairs created:', cardPairs.length);
    
    setCards(shuffleCards(cardPairs));
    setFlippedCardIds([]);
    setMatchedPairs(0);
    setMoves(0);
    setDisabled(false);
    setTimeLeft(config.timeLimit);
    setFinalTime(null);
    setGameOver(false);
    setLevelComplete(false);
    
    // Show preview when game starts
    setShowPreview(true);
    setPreviewTimer(2);
  };

  // Start the game
  const startGame = () => {
    resetGame();
    setGameStarted(true);
  };

  // Handle card click
  const handleCardClick = (id: number) => {
    // Prevent interaction during preview
    if (showPreview) return;
    
    if (flippedCardIds.length === 2 || flippedCardIds.includes(id)) return;

    const newFlippedCardIds = [...flippedCardIds, id];
    setFlippedCardIds(newFlippedCardIds);

    // If two cards are flipped, check for a match
    if (newFlippedCardIds.length === 2) {
      setDisabled(true);
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCardIds;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard?.imageSrc === secondCard?.imageSrc) {
        // Match found
        setCards(prev => 
          prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, matched: true } 
              : card
          )
        );
        
        // Add 5 seconds to the timer for correct match
        setTimeLeft(prev => prev !== null ? prev + 5 : prev);
        
        // Show time bonus indicator (won't block interaction now)
        setShowTimeBonus(true);
        setTimeout(() => setShowTimeBonus(false), 1500);
        
        setMatchedPairs(prev => {
          const newMatchedPairs = prev + 1;
          const totalPairs = (gridSize * gridSize) / 2;
          
          // Check if all pairs are matched
          if (newMatchedPairs === totalPairs) {
            handleLevelComplete();
          }
          
          return newMatchedPairs;
        });
        
        setFlippedCardIds([]);
        setDisabled(false);
      } else {
        // No match
        setTimeout(() => {
          setFlippedCardIds([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  // Handle level completion
  const handleLevelComplete = () => {
    const config = levelConfigs[difficulty][level];
    const timeBonus = Math.floor((timeLeft || 0) * 0.5);
    const totalPairs = (config.gridSize * config.gridSize) / 2;
    const movesRatio = totalPairs / Math.max(1, moves);
    const movesBonus = Math.floor(movesRatio * 50);
    
    const totalPoints = config.points + timeBonus + movesBonus;
    
    // Don't call updateScore here as it can cause state updates during render
    setLevelComplete(true);
    
    // Store the remaining time for display but stop the timer
    const finalTimeLeft = timeLeft;
    setTimeLeft(null);
    setFinalTime(finalTimeLeft);
    
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
    
    // Set points to be awarded after level completion
    setPointsToAward(totalPoints);
  };
  
  // Effect to handle score updates after level completion
  useEffect(() => {
    if (levelComplete && pointsToAward !== null) {
      updateScore(pointsToAward);
      setPointsToAward(null);
    }
  }, [levelComplete, pointsToAward, updateScore]);

  // Handle game over (time's up)
  const handleGameOver = () => {
    setDisabled(true);
    setGameOver(true);
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

  // Change level and start game
  const changeLevel = (newLevel: number) => {
    if (!levelLocked[difficulty][newLevel]) {
      setLevel(newLevel);
      resetGame();
      setGameStarted(true);
    }
  };

  // Format time for display
  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '--:--';
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

  const config = levelConfigs[difficulty][level];
  const gridSize = config.gridSize;

  return (
    <div className="w-full h-full">
      {!gameStarted ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center space-y-4 w-full"
        > 
          <div className="w-full">
            <h3 className={`${isCompactView ? 'text-lg' : 'text-xl'} font-semibold mb-8 flex items-center justify-center w-full`}>
              <span className="bg-indigo-100 p-1 rounded-md text-indigo-600 mr-2 text-sm">01</span>
              Избери тема
            </h3>
            <div className={`flex justify-center ${isCompactView ? 'gap-2' : 'gap-4'} mb-8`}>
              {(['animals', 'fruits', 'space'] as const).map((themeOption) => (
                <motion.button
                  key={themeOption}
                  onClick={() => setTheme(themeOption)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-3 rounded-lg transition-all shadow-sm ${
                    theme === themeOption
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium'
                      : 'bg-white border border-gray-200 text-gray-800 hover:border-indigo-300'
                  } flex items-center justify-center`}
                >
                  <span className={`${isCompactView ? 'text-lg' : 'text-xl'} mr-1`}>
                    {themeOption === 'animals' ? '🦁' : themeOption === 'fruits' ? '🍎' : '🚀'}
                  </span>
                  {themeOption === 'animals' ? 'Животни' : themeOption === 'fruits' ? 'Плодове' : 'Космос'}
                </motion.button>
              ))}
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
        <div className="w-full h-full">
          <div className="bg-white p-6 rounded-xl shadow-lg mb-6 w-full">
            <div className="flex justify-between items-center mb-6 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Игра на паметта</h2>
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
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-600">{theme === 'animals' ? 'Животни' : theme === 'fruits' ? 'Плодове' : 'Космос'}</span>
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
                        animate={timeLeft && timeLeft < 10 
                          ? { scale: [1, 1.1, 1] } 
                          : showTimeBonus 
                            ? { color: ['#10b981', '#4b5563'] } 
                            : {}
                        }
                        transition={timeLeft && timeLeft < 10 
                          ? { repeat: Infinity, duration: 1 }
                          : showTimeBonus
                            ? { duration: 1.5 }
                            : {}
                        }
                        className={`font-bold ${timeLeft && timeLeft < 10 ? 'text-red-600' : 'text-gray-800'}`}>
                        {formatTime(timeLeft)}
                        {showTimeBonus && <span className="text-green-500 ml-1">↑</span>}
                      </motion.p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <div className="p-1.5 rounded-md mr-1.5 bg-purple-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Двойки</p>
                      <p className="font-bold text-gray-800">{matchedPairs}/{(gridSize * gridSize) / 2}</p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <div className="p-1.5 rounded-md mr-1.5 bg-indigo-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Ходове</p>
                      <p className="font-bold text-gray-800">{moves}</p>
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
                  Намерихте всичките {(gridSize * gridSize) / 2} двойки!
                </motion.p>
                <p className="mb-6 flex justify-center gap-8">
                  <span className="font-medium text-gray-600 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg> Оставащо време: {formatTime(finalTime)}</span>
                  <span className="font-medium text-gray-600 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg> Ходове: {moves}</span>
                </p>
                
                {level < 9 || difficulty < 3 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={goToNextLevel}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-lg transition-all shadow-md font-medium flex items-center mx-auto"
                  >
                    {level < 9 ? 'Следващо ниво' : 'Следваща трудност'}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                ) : (
                  <p className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Всички нива са завършени!</p>
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
                <p className="mb-6 text-lg">Намерихте {matchedPairs} от {(gridSize * gridSize) / 2} двойки.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startGame}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-lg transition-all shadow-md font-medium flex items-center mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Опитай отново
                </motion.button>
              </motion.div>
            ) : (
              <div className="w-full flex flex-col items-center">
                {cards.length > 0 && (
                  <>
                    {/* Preview countdown timer */}
                    {showPreview && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                          <span className="text-3xl font-bold">{previewTimer}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Time bonus indicator */}
                    {showTimeBonus && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1.2, y: [0, -15, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                      >
                        <div className="bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white px-4 py-2 rounded-full shadow-lg flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-bold text-lg">+5s</span>
                        </div>
                      </motion.div>
                    )}
                  
                    <div 
                      className="grid w-full gap-2 mx-auto relative"
                      style={{
                        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                        maxWidth: gridSize <= 4 ? `${gridSize * 90}px` : '560px'
                      }}
                    >
                      {cards.map(card => (
                        <div key={card.id} className="flex justify-center items-center">
                          <MemoryCard
                            card={card}
                            flipped={showPreview || flippedCardIds.includes(card.id) || card.matched}
                            disabled={disabled || showPreview}
                            onClick={() => handleCardClick(card.id)}
                            isCompactView={isCompactView}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                <div className="flex justify-end mt-4 w-full">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => resetGame()}
                    className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Рестартиране на нивото
                  </motion.button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setGameStarted(false);
              }}
              className="px-5 py-2 bg-white hover:bg-gray-50 shadow-sm rounded-lg border border-gray-200 text-gray-600 font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Обратно към менюто
            </motion.button>
            
            <div className="bg-indigo-50 px-4 py-2 rounded-lg flex items-center">
              <span className="text-xs text-indigo-600 mr-2">Бързи действия:</span>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme('animals')}
                  className={`p-1.5 rounded ${theme === 'animals' ? 'bg-indigo-600 text-white' : 'text-indigo-600'}`}
                  title="Тема Животни"
                >
                  <span className="text-sm">🦁</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme('fruits')}
                  className={`p-1.5 rounded ${theme === 'fruits' ? 'bg-indigo-600 text-white' : 'text-indigo-600'}`}
                  title="Тема Плодове"
                >
                  <span className="text-sm">🍎</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme('space')}
                  className={`p-1.5 rounded ${theme === 'space' ? 'bg-indigo-600 text-white' : 'text-indigo-600'}`}
                  title="Тема Космос"
                >
                  <span className="text-sm">🚀</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 