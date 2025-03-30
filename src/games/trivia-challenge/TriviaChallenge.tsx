import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '@/components/GameContext';

type DifficultyLevel = 1 | 2 | 3;
type Category = 'general' | 'science' | 'history' | 'geography' | 'entertainment';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  category: Category;
  explanation?: string;
}

interface LevelConfig {
  numQuestions: number;
  timeLimit: number;
  points: number;
  categories: Category[];
  difficulty: 'easy' | 'medium' | 'hard';
}

// Sample questions database
const questionBank: Record<Category, Record<'easy' | 'medium' | 'hard', Question[]>> = {
  general: {
    easy: [
      {
        question: "Коя е столицата на Франция?",
        options: ["Берлин", "Мадрид", "Париж", "Рим"],
        correctAnswer: 2,
        category: "general"
      },
      {
        question: "Коя планета е най-близо до Слънцето?",
        options: ["Венера", "Меркурий", "Земя", "Марс"],
        correctAnswer: 1,
        category: "general"
      },
      {
        question: "Колко страни има триъгълникът?",
        options: ["Две", "Три", "Четири", "Пет"],
        correctAnswer: 1,
        category: "general"
      },
      {
        question: "Колко е 2 + 2?",
        options: ["3", "4", "5", "22"],
        correctAnswer: 1,
        category: "general"
      },
      {
        question: "Какъв цвят е бананът?",
        options: ["Червен", "Син", "Жълт", "Зелен"],
        correctAnswer: 2,
        category: "general"
      }
    ],
    medium: [
      {
        question: "Кой елемент има химичен символ 'O'?",
        options: ["Злато", "Кислород", "Осмий", "Оганесон"],
        correctAnswer: 1,
        category: "general"
      },
      {
        question: "През коя година приключва Втората световна война?",
        options: ["1942", "1943", "1944", "1945"],
        correctAnswer: 3,
        category: "general"
      },
      {
        question: "Кой е написал 'Ромео и Жулиета'?",
        options: ["Чарлз Дикенс", "Уилям Шекспир", "Джейн Остин", "Марк Твен"],
        correctAnswer: 1,
        category: "general"
      }
    ],
    hard: [
      {
        question: "Кое е най-малкото просто число, по-голямо от 100?",
        options: ["101", "103", "107", "109"],
        correctAnswer: 0,
        category: "general"
      },
      {
        question: "Коя страна има най-голяма площ?",
        options: ["Китай", "САЩ", "Канада", "Русия"],
        correctAnswer: 3,
        category: "general"
      }
    ]
  },
  science: {
    easy: [
      {
        question: "Кой е химичният символ на водата?",
        options: ["WA", "HO", "H2O", "W"],
        correctAnswer: 2,
        category: "science"
      },
      {
        question: "Кое от изброените НЕ е агрегатно състояние на материята?",
        options: ["Твърдо", "Течно", "Газообразно", "Енергия"],
        correctAnswer: 3,
        category: "science"
      }
    ],
    medium: [
      {
        question: "Кой е най-големият орган в човешкото тяло?",
        options: ["Мозък", "Черен дроб", "Кожа", "Сърце"],
        correctAnswer: 2,
        category: "science"
      },
      {
        question: "Каква е скоростта на светлината?",
        options: ["300 000 км/с", "150 000 км/с", "500 000 км/с", "1 000 000 км/с"],
        correctAnswer: 0,
        category: "science"
      }
    ],
    hard: [
      {
        question: "Какъв е периодът на полуразпад на Въглерод-14?",
        options: ["1 570 години", "5 730 години", "10 000 години", "14 000 години"],
        correctAnswer: 1,
        category: "science"
      },
      {
        question: "Коя субатомна частица има положителен заряд?",
        options: ["Електрон", "Неутрон", "Протон", "Фотон"],
        correctAnswer: 2,
        category: "science"
      }
    ]
  },
  history: {
    easy: [
      {
        question: "Кой е бил първият президент на САЩ?",
        options: ["Томас Джеферсън", "Джон Адамс", "Джордж Вашингтон", "Бенджамин Франклин"],
        correctAnswer: 2,
        category: "history"
      },
      {
        question: "През коя година Колумб достига Америка?",
        options: ["1392", "1492", "1592", "1692"],
        correctAnswer: 1,
        category: "history"
      }
    ],
    medium: [
      {
        question: "Кой е бил фараонът, свързан с най-голямата пирамида в Гиза?",
        options: ["Тутанкамон", "Хеопс", "Рамзес II", "Клеопатра"],
        correctAnswer: 1,
        category: "history"
      },
      {
        question: "През коя година пада Берлинската стена?",
        options: ["1985", "1987", "1989", "1991"],
        correctAnswer: 2,
        category: "history"
      }
    ],
    hard: [
      {
        question: "Кой е бил император на Франция по време на битката при Ватерло?",
        options: ["Луи XIV", "Наполеон Бонапарт", "Карл Велики", "Луи XVIII"],
        correctAnswer: 1,
        category: "history"
      },
      {
        question: "В коя година е подписана Декларацията за независимост на САЩ?",
        options: ["1772", "1774", "1776", "1778"],
        correctAnswer: 2,
        category: "history"
      }
    ]
  },
  geography: {
    easy: [
      {
        question: "Коя е най-дългата река в света?",
        options: ["Амазонка", "Нил", "Мисисипи", "Янцзъ"],
        correctAnswer: 1,
        category: "geography"
      },
      {
        question: "Кой континент е най-голям по площ?",
        options: ["Африка", "Северна Америка", "Южна Америка", "Азия"],
        correctAnswer: 3,
        category: "geography"
      }
    ],
    medium: [
      {
        question: "Коя е най-високата планина в света?",
        options: ["К2", "Еверест", "Килиманджаро", "Монблан"],
        correctAnswer: 1,
        category: "geography"
      },
      {
        question: "Коя държава има най-голямо население?",
        options: ["Индия", "САЩ", "Китай", "Индонезия"],
        correctAnswer: 2,
        category: "geography"
      }
    ],
    hard: [
      {
        question: "Кой е най-големият океан на Земята?",
        options: ["Атлантически", "Индийски", "Тихи", "Арктически"],
        correctAnswer: 2,
        category: "geography"
      },
      {
        question: "Коя е столицата на Австралия?",
        options: ["Сидни", "Мелбърн", "Канбера", "Бризбейн"],
        correctAnswer: 2,
        category: "geography"
      }
    ]
  },
  entertainment: {
    easy: [
      {
        question: "Кой играе ролята на Хари Потър във филмовата поредица?",
        options: ["Даниел Радклиф", "Рупърт Гринт", "Ема Уотсън", "Том Фелтън"],
        correctAnswer: 0,
        category: "entertainment"
      },
      {
        question: "Колко са цветовете в дъгата?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 2,
        category: "entertainment"
      }
    ],
    medium: [
      {
        question: "Коя група изпълнява песента 'Bohemian Rhapsody'?",
        options: ["The Beatles", "Queen", "Led Zeppelin", "Pink Floyd"],
        correctAnswer: 1,
        category: "entertainment"
      },
      {
        question: "Кой режисьор създаде филма 'Титаник'?",
        options: ["Стивън Спилбърг", "Джеймс Камерън", "Кристофър Нолан", "Мартин Скорсезе"],
        correctAnswer: 1,
        category: "entertainment"
      }
    ],
    hard: [
      {
        question: "Кой актьор е играл най-много пъти ролята на Джеймс Бонд?",
        options: ["Шон Конъри", "Роджър Мур", "Пиърс Броснан", "Даниел Крейг"],
        correctAnswer: 1,
        category: "entertainment"
      },
      {
        question: "През коя година е създаден първият филм от поредицата 'Междузвездни войни'?",
        options: ["1975", "1977", "1979", "1981"],
        correctAnswer: 1,
        category: "entertainment"
      }
    ]
  }
};

// Level configurations
const levelConfigs: Record<DifficultyLevel, LevelConfig[]> = {
  1: [ // Easy levels
    { numQuestions: 5, timeLimit: 60, points: 10, categories: ['general'], difficulty: 'easy' },
    { numQuestions: 5, timeLimit: 60, points: 15, categories: ['general', 'science'], difficulty: 'easy' },
    { numQuestions: 6, timeLimit: 70, points: 20, categories: ['general', 'history'], difficulty: 'easy' },
    { numQuestions: 6, timeLimit: 70, points: 25, categories: ['science', 'geography'], difficulty: 'easy' },
    { numQuestions: 7, timeLimit: 80, points: 30, categories: ['history', 'entertainment'], difficulty: 'easy' },
    { numQuestions: 7, timeLimit: 80, points: 35, categories: ['geography', 'entertainment'], difficulty: 'easy' },
    { numQuestions: 8, timeLimit: 90, points: 40, categories: ['general', 'science', 'history'], difficulty: 'easy' },
    { numQuestions: 8, timeLimit: 90, points: 45, categories: ['science', 'geography', 'entertainment'], difficulty: 'easy' },
    { numQuestions: 9, timeLimit: 100, points: 50, categories: ['general', 'science', 'history', 'geography'], difficulty: 'easy' },
    { numQuestions: 10, timeLimit: 120, points: 60, categories: ['general', 'science', 'history', 'geography', 'entertainment'], difficulty: 'easy' },
  ],
  2: [ // Medium levels
    { numQuestions: 5, timeLimit: 60, points: 30, categories: ['general'], difficulty: 'medium' },
    { numQuestions: 6, timeLimit: 70, points: 40, categories: ['general', 'science'], difficulty: 'medium' },
    { numQuestions: 7, timeLimit: 80, points: 50, categories: ['general', 'history'], difficulty: 'medium' },
    { numQuestions: 7, timeLimit: 80, points: 60, categories: ['science', 'geography'], difficulty: 'medium' },
    { numQuestions: 8, timeLimit: 90, points: 70, categories: ['history', 'entertainment'], difficulty: 'medium' },
    { numQuestions: 8, timeLimit: 90, points: 80, categories: ['geography', 'entertainment'], difficulty: 'medium' },
    { numQuestions: 9, timeLimit: 100, points: 90, categories: ['general', 'science', 'history'], difficulty: 'medium' },
    { numQuestions: 9, timeLimit: 100, points: 100, categories: ['science', 'geography', 'entertainment'], difficulty: 'medium' },
    { numQuestions: 10, timeLimit: 110, points: 110, categories: ['general', 'science', 'history', 'geography'], difficulty: 'medium' },
    { numQuestions: 12, timeLimit: 120, points: 120, categories: ['general', 'science', 'history', 'geography', 'entertainment'], difficulty: 'medium' },
  ],
  3: [ // Hard levels
    { numQuestions: 5, timeLimit: 60, points: 60, categories: ['general'], difficulty: 'hard' },
    { numQuestions: 6, timeLimit: 70, points: 80, categories: ['general', 'science'], difficulty: 'hard' },
    { numQuestions: 7, timeLimit: 80, points: 100, categories: ['general', 'history'], difficulty: 'hard' },
    { numQuestions: 8, timeLimit: 90, points: 120, categories: ['science', 'geography'], difficulty: 'hard' },
    { numQuestions: 9, timeLimit: 100, points: 140, categories: ['history', 'entertainment'], difficulty: 'hard' },
    { numQuestions: 10, timeLimit: 110, points: 160, categories: ['geography', 'entertainment'], difficulty: 'hard' },
    { numQuestions: 11, timeLimit: 120, points: 180, categories: ['general', 'science', 'history'], difficulty: 'hard' },
    { numQuestions: 12, timeLimit: 130, points: 200, categories: ['science', 'geography', 'entertainment'], difficulty: 'hard' },
    { numQuestions: 13, timeLimit: 140, points: 225, categories: ['general', 'science', 'history', 'geography'], difficulty: 'hard' },
    { numQuestions: 15, timeLimit: 160, points: 250, categories: ['general', 'science', 'history', 'geography', 'entertainment'], difficulty: 'hard' },
  ]
};

export default function TriviaChallenge() {
  const { updateScore, setGameCompleted } = useGameContext();
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
  const [level, setLevel] = useState<number>(0);
  const [category, setCategory] = useState<Category>('general');
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
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
  
  // Available categories for selection
  const categories: Category[] = ['general', 'science', 'history', 'geography', 'entertainment'];

  // Get category display name
  const getCategoryDisplay = (cat: Category): string => {
    switch(cat) {
      case 'general': return 'Обща култура';
      case 'science': return 'Наука';
      case 'history': return 'История';
      case 'geography': return 'География';
      case 'entertainment': return 'Забавление';
    }
  };

  // Get difficulty display name
  const getDifficultyDisplay = (diff: DifficultyLevel): string => {
    switch (diff) {
      case 1: return 'Лесно';
      case 2: return 'Средно';
      case 3: return 'Сложно';
    }
  };

  // Get category emoji
  const getCategoryEmoji = (cat: Category): string => {
    switch (cat) {
      case 'general': return '🎯';
      case 'science': return '🔬';
      case 'history': return '📜';
      case 'geography': return '🌍';
      case 'entertainment': return '🎭';
    }
  };

  // Generate a set of questions based on level and difficulty
  const generateQuestions = () => {
    const config = levelConfigs[difficulty][level];
    let availableQuestions: Question[] = [];
    
    // Gather questions from each category for this difficulty
    config.categories.forEach(category => {
      availableQuestions = [
        ...availableQuestions, 
        ...questionBank[category][config.difficulty]
      ];
    });
    
    // If not enough questions, add from other difficulties
    if (availableQuestions.length < config.numQuestions) {
      // Try adding medium questions if we're on hard
      if (config.difficulty === 'hard') {
        config.categories.forEach(category => {
          availableQuestions = [
            ...availableQuestions, 
            ...questionBank[category]['medium']
          ];
        });
      }
      
      // Try adding easy questions if still not enough
      if (availableQuestions.length < config.numQuestions) {
        config.categories.forEach(category => {
          availableQuestions = [
            ...availableQuestions, 
            ...questionBank[category]['easy']
          ];
        });
      }
    }
    
    // Shuffle and limit to required number
    const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, config.numQuestions));
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setMessage('');
    setTimeLeft(config.timeLimit);
    setGameOver(false);
    setLevelComplete(false);
  };

  // Start the game
  const startGame = () => {
    generateQuestions();
    setGameStarted(true);
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

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    if (isCorrect !== null) return; // Already answered
    
    setSelectedAnswer(answerIndex);
    const currentQ = questions[currentQuestion];
    
    if (answerIndex === currentQ.correctAnswer) {
      setIsCorrect(true);
      setScore(prev => prev + 1);
      setMessage('Правилно!');
      
      // Check if we've finished all questions
      if (currentQuestion === questions.length - 1) {
        handleLevelComplete();
      } else {
        // Move to next question after delay
        setTimeout(() => {
          setCurrentQuestion(prev => prev + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setMessage('');
        }, 1500);
      }
    } else {
      setIsCorrect(false);
      setMessage(`Неправилно. Правилният отговор е: ${currentQ.options[currentQ.correctAnswer]}.`);
      
      // Move to next question after delay
      setTimeout(() => {
        if (currentQuestion === questions.length - 1) {
          handleLevelComplete();
        } else {
          setCurrentQuestion(prev => prev + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setMessage('');
        }
      }, 2000);
    }
  };

  // Handle level completion
  const handleLevelComplete = () => {
    setLevelComplete(true);
    const config = levelConfigs[difficulty][level];
    
    // Calculate points based on correct answers
    const correctPercentage = score / config.numQuestions;
    const earnedPoints = Math.floor(config.points * correctPercentage);
    
    // Add time bonus
    const timeBonus = Math.floor((timeLeft || 0) * 0.25);
    const totalPoints = earnedPoints + timeBonus;
    
    updateScore(totalPoints);
    setMessage(`Нивото е завършено! Вие спечелихте ${earnedPoints} точки + ${timeBonus} бонус за време = ${totalPoints} общо точки!`);
    
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

  // Handle game over (time ran out)
  const handleGameOver = () => {
    setGameOver(true);
    setMessage('Времето изтече! Опитайте отново.');
  };

  // Go to next level
  const goToNextLevel = () => {
    if (level < 9) {
      setLevel(level + 1);
      startGame();
    } else if (difficulty < 3) {
      setDifficulty(difficulty + 1 as DifficultyLevel);
      setLevel(0);
      startGame();
    }
  };

  // Change level and start game
  const changeLevel = (newLevel: number) => {
    if (!levelLocked[difficulty][newLevel]) {
      setLevel(newLevel);
      startGame();
    }
  };

  // Format time from seconds to mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Reference to current level config
  const config = levelConfigs[difficulty][level];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {!gameStarted ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center space-y-8"
        >
          
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-8 flex items-center justify-center w-full">
              <span className="bg-indigo-100 p-1 rounded-md text-indigo-600 mr-2 text-sm">01</span>
              Изберете категория
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-3 rounded-lg transition-all shadow-sm ${
                    category === cat
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium'
                      : 'bg-white border border-gray-200 text-gray-800 hover:border-indigo-300'
                  } flex items-center justify-center`}
                >
                  <span className="mr-2">{getCategoryEmoji(cat)}</span>
                  {getCategoryDisplay(cat)}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-8 flex items-center justify-center w-full">
              <span className="bg-indigo-100 p-1 rounded-md text-indigo-600 mr-2 text-sm">02</span>
              Изберете трудност
            </h3>
            <div className="flex justify-center gap-4 mb-8">
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
            <h3 className="text-xl font-semibold mb-8 flex items-center justify-center w-full">
              <span className="bg-indigo-100 p-1 rounded-md text-indigo-600 mr-2 text-sm">03</span>
              Изберете ниво
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: 10 }, (_, i) => (
                <motion.button
                  key={i}
                  onClick={() => {
                    if (!levelLocked[difficulty][i]) {
                      setLevel(i);
                      startGame();
                    }
                  }}
                  whileHover={!levelLocked[difficulty][i] ? { scale: 1.05 } : {}}
                  whileTap={!levelLocked[difficulty][i] ? { scale: 0.98 } : {}}
                  className={`py-3 rounded-lg transition-all shadow-sm relative ${
                    level === i && !levelLocked[difficulty][i]
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium'
                      : levelLocked[difficulty][i]
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      : 'bg-white border border-gray-200 text-gray-800 hover:border-indigo-300'
                  }`}
                >
                  {levelLocked[difficulty][i] && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  )}
                  <span className={levelLocked[difficulty][i] ? "opacity-30" : ""}>
                    {i + 1}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="w-full max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-lg mb-6"
          >
            <div className="flex justify-between items-center mb-6 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Викторина</h2>
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
                      <p className="font-bold text-gray-800">{score}</p>
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
                  Вие отговорихте правилно на {score} от {config.numQuestions} въпроса!
                </motion.p>

                <motion.p 
                  className="mb-6 flex justify-center gap-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
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
                  >
                    {level < 9 ? 'Следващо ниво' : 'Следваща трудност'}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                ) : (
                  <p className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                    Всички нива са завършени!
                  </p>
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
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">
                  Времето изтече!
                </h3>
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
                  <div className="bg-indigo-50 px-4 py-2 rounded-lg inline-block mb-4">
                    <span className="text-indigo-800 font-medium">{getCategoryDisplay(questions[currentQuestion]?.category || category)}</span>
                  </div>
                  <motion.h3 
                    className="text-2xl font-bold mb-8"
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {questions[currentQuestion]?.question}
                  </motion.h3>
                  
                  <div className="space-y-3">
                    {questions[currentQuestion]?.options.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => selectedAnswer === null && handleAnswerSelect(index)}
                        whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                        whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                        className={`w-full p-4 rounded-lg transition-all ${
                          selectedAnswer !== null
                            ? index === questions[currentQuestion]?.correctAnswer
                              ? 'bg-green-100 border-2 border-green-500'
                              : index === selectedAnswer
                                ? 'bg-red-100 border-2 border-red-500'
                                : 'bg-gray-100'
                            : 'bg-white border-2 border-gray-200 hover:border-indigo-300'
                        }`}
                        disabled={selectedAnswer !== null}
                      >
                        <div className="flex items-center">
                          <span className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-medium mr-3">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="flex-grow text-left">{option}</span>
                          {selectedAnswer !== null && (
                            <span className="ml-2">
                              {index === questions[currentQuestion]?.correctAnswer && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                              {index === selectedAnswer && index !== questions[currentQuestion]?.correctAnswer && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                            </span>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {selectedAnswer !== null && currentQuestion < questions.length - 1 && (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setCurrentQuestion(prev => prev + 1);
                        setSelectedAnswer(null);
                        setIsCorrect(null);
                        setMessage('');
                      }}
                      className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-lg transition-all shadow-md font-medium flex items-center mx-auto"
                    >
                      Следващ въпрос
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </motion.button>
                  )}
                </motion.div>
              </div>
            )}
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setGameStarted(false);
              setCurrentQuestion(0);
              setScore(0);
              setSelectedAnswer(null);
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
        </div>
      )}
    </div>
  );
} 