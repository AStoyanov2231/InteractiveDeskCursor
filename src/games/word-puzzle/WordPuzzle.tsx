import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '@/components/GameContext';

// List of words by category and level
const wordCategories = {
  animals: {
    easy: [
      ['CAT', 'DOG', 'FOX', 'PIG', 'COW'],
      ['BEAR', 'WOLF', 'LION', 'FROG', 'GOAT'],
      ['DEER', 'DUCK', 'SEAL', 'HAWK', 'CRAB'],
      ['FISH', 'BIRD', 'MOLE', 'SHEEP', 'HORSE'],
      ['MOUSE', 'SNAKE', 'WHALE', 'ZEBRA', 'TIGER'],
      ['PANDA', 'KOALA', 'CAMEL', 'SHARK', 'EAGLE'],
      ['GECKO', 'HYENA', 'SLOTH', 'BISON', 'LLAMA'],
      ['OTTER', 'MOOSE', 'LEMUR', 'FINCH', 'RAVEN'],
      ['HIPPO', 'RHINO', 'SKUNK', 'MEERKAT', 'BADGER'],
      ['IGUANA', 'JAGUAR', 'FERRET', 'TOUCAN', 'WOMBAT']
    ],
    medium: [
      ['GIRAFFE', 'PENGUIN', 'DOLPHIN', 'OCTOPUS', 'ELEPHANT'],
      ['KANGAROO', 'LEOPARD', 'GORILLA', 'TORTOISE', 'SQUIRREL'],
      ['FLAMINGO', 'RACCOON', 'HEDGEHOG', 'CROCODILE', 'ANTELOPE'],
      ['AARDVARK', 'OPOSSUM', 'WALRUS', 'WEASEL', 'BUFFALO'],
      ['LOBSTER', 'SEAGULL', 'PEACOCK', 'PANTHER', 'GAZELLE'],
      ['MACAQUE', 'OSTRICH', 'PIRANHA', 'TERRIER', 'HAMSTER'],
      ['MONGOOSE', 'PELICAN', 'SCORPION', 'SPARROW', 'BULLFROG'],
      ['TARANTULA', 'ARMADILLO', 'PORCUPINE', 'BUTTERFLY', 'JELLYFISH'],
      ['PLATYPUS', 'ALLIGATOR', 'CHIPMUNK', 'REINDEER', 'MARMOSET'],
      ['BABOON', 'CHEETAH', 'VULTURE', 'MUSKRAT', 'STINGRAY']
    ],
    hard: [
      ['CHIMPANZEE', 'ORANGUTAN', 'RHINOCEROS', 'ANACONDA', 'CHAMELEON'],
      ['WOLVERINE', 'KOMODO DRAGON', 'NARWHAL', 'ALBATROSS', 'BARRACUDA'],
      ['SILVERBACK', 'TASMANIAN DEVIL', 'CAPYBARA', 'CHINCHILLA', 'RATTLESNAKE'],
      ['SALAMANDER', 'HUMMINGBIRD', 'SWORDFISH', 'TARANTULA', 'MANATEE'],
      ['CALIFORNIA CONDOR', 'MOUNTAIN LION', 'TIMBER WOLF', 'GIANT PANDA', 'EMPEROR PENGUIN'],
      ['PRAYING MANTIS', 'SEA CUCUMBER', 'BLUE WHALE', 'KING COBRA', 'ANTEATER'],
      ['HIPPOPOTAMUS', 'BOMBARDIER BEETLE', 'RED PANDA', 'PORTUGUESE MAN-OF-WAR', 'ELECTRIC EEL'],
      ['BALD EAGLE', 'GREAT WHITE SHARK', 'PEREGRINE FALCON', 'KOMODOWARAN', 'BELUGA WHALE'],
      ['BLACK MAMBA', 'AFRICAN ELEPHANT', 'BENGAL TIGER', 'POISON DART FROG', 'MANTIS SHRIMP'],
      ['CONE SNAIL', 'BLUE RINGED OCTOPUS', 'ORINOCO CROCODILE', 'GOLDEN EAGLE', 'GIANT SQUID']
    ]
  },
  fruits: {
    easy: [
      ['PEAR', 'PLUM', 'LIME', 'FIG', 'DATE'],
      ['KIWI', 'PEACH', 'LEMON', 'MELON', 'APPLE'],
      ['GRAPE', 'GUAVA', 'MANGO', 'PRUNE', 'BERRY'],
      ['LYCHEE', 'CHERRY', 'BANANA', 'PAPAYA', 'ORANGE'],
      ['APRICOT', 'COCONUT', 'AVOCADO', 'DURIAN', 'QUINCE'],
      ['RAISIN', 'LOQUAT', 'STARFRUIT', 'MULBERRY', 'TAMARIND'],
      ['NECTARINE', 'MANDARIN', 'TANGELO', 'FEIJOA', 'PLANTAIN'],
      ['CLEMENTINE', 'ELDERBERRY', 'GRAPEFRUIT', 'KUMQUAT', 'TANGERINE'],
      ['CANTALOUPE', 'HONEYDEW', 'PERSIMMON', 'POMEGRANATE', 'RASPBERRY'],
      ['BLACKBERRY', 'CRANBERRY', 'DRAGONFRUIT', 'GOOSEBERRY', 'BOYSENBERRY']
    ],
    medium: [
      ['BLUEBERRY', 'PINEAPPLE', 'STRAWBERRY', 'WATERMELON', 'POMEGRANATE'],
      ['JACKFRUIT', 'PASSIONFRUIT', 'MANGOSTEEN', 'BLACKCURRANT', 'REDCURRANT'],
      ['PERSIMMON', 'BOYSENBERRY', 'CHERIMOYA', 'CLOUDBERRY', 'SALMONBERRY'],
      ['BREADFRUIT', 'JABUTICABA', 'RAMBUTAN', 'SOURSOP', 'CARAMBOLA'],
      ['GOJI BERRY', 'PITAHAYA', 'KUMQUAT', 'LONGANS', 'LYCHEE'],
      ['SAPODILLA', 'JUJUBE', 'QUINCE', 'TAYBERRY', 'UGLI FRUIT'],
      ['YOUNGBERRY', 'YUZU', 'SUGAR APPLE', 'PAWPAW', 'MULBERRY'],
      ['ACEROLA', 'ACKEE', 'FEIJOA', 'JUNIPER', 'MIRACLE FRUIT'],
      ['NONI FRUIT', 'SASKATOON', 'TAMARILLO', 'WINEBERRY', 'SALAK'],
      ['MUSCADINE', 'CUSTARD APPLE', 'SEA BUCKTHORN', 'MARIONBERRY', 'HUCKLEBERRY']
    ],
    hard: [
      ['MANGOSTEEN', 'PERSIMMON', 'PASSIONFRUIT', 'POMEGRANATE', 'DRAGONFRUIT'],
      ['AFRICAN HORNED CUCUMBER', 'STAR APPLE', 'MIRACLE BERRY', 'PURPLE MANGOSTEEN', 'MAMONCILLO'],
      ['SALAK SNAKEFRUIT', 'SURINAM CHERRY', 'CHINESE BAYBERRY', 'MONSTERA DELICIOSA', 'CUPUACU'],
      ['PULASAN', 'BUFFALOBERRY', 'AFRICAN CUCUMBER', 'TAMARIND POD', 'SANTOL'],
      ['WHITE SAPOTE', 'SOURSOP', 'SAPODILLA', 'CANISTEL', 'ATEMOYA'],
      ['BLACK SAPOTE', 'ROSE APPLE', 'KAFFIR LIME', 'TAMARILLO', 'BLOOD ORANGE'],
      ['JAPANESE PERSIMMON', 'AFRICAN BREADFRUIT', 'AUSTRALIAN FINGER LIME', 'JABUTICABA', 'PEPINO MELON'],
      ['CHERIMOYA', 'ILAMA', 'SPANISH LIME', 'WOOD APPLE', 'INDIAN GOOSEBERRY'],
      ['ACEROLA CHERRY', 'JAPANESE WINEBERRY', 'MOUNTAIN SOURSOP', 'CHAYOTE FRUIT', 'KAKADU PLUM'],
      ['PITOMBA', 'NANCHE', 'ARGAN FRUIT', 'YANGMEI', 'BARBADOS CHERRY']
    ]
  },
  countries: {
    easy: [
      ['USA', 'PERU', 'CUBA', 'MALI', 'FIJI'],
      ['CHAD', 'CHILE', 'CHINA', 'ITALY', 'SPAIN'],
      ['INDIA', 'JAPAN', 'KENYA', 'HAITI', 'LAOS'],
      ['IRAN', 'IRAQ', 'NEPAL', 'OMAN', 'QATAR'],
      ['TOGO', 'TONGA', 'YEMEN', 'BENIN', 'GHANA'],
      ['SUDAN', 'SYRIA', 'SAMOA', 'RUSSIA', 'POLAND'],
      ['NORWAY', 'SWEDEN', 'PANAMA', 'MEXICO', 'MONACO'],
      ['NAURU', 'PALAU', 'MALTA', 'BELIZE', 'BRUNEI'],
      ['GABON', 'GUYANA', 'ERITREA', 'ESTONIA', 'GUINEA'],
      ['LESOTHO', 'LIBERIA', 'ARMENIA', 'ALGERIA', 'BAHRAIN']
    ],
    medium: [
      ['CANADA', 'BRAZIL', 'FRANCE', 'GERMANY', 'AUSTRALIA'],
      ['MEXICO', 'EGYPT', 'ENGLAND', 'THAILAND', 'PORTUGAL'],
      ['ARGENTINA', 'COLOMBIA', 'MOROCCO', 'SINGAPORE', 'TANZANIA'],
      ['INDONESIA', 'VENEZUELA', 'MALAYSIA', 'ETHIOPIA', 'CAMEROON'],
      ['PHILIPPINES', 'SWITZERLAND', 'BANGLADESH', 'CAMBODIA', 'DENMARK'],
      ['AFGHANISTAN', 'AZERBAIJAN', 'COSTA RICA', 'EL SALVADOR', 'GUATEMALA'],
      ['KAZAKHSTAN', 'KYRGYZSTAN', 'MADAGASCAR', 'MAURITANIA', 'MOZAMBIQUE'],
      ['NETHERLANDS', 'NEW ZEALAND', 'NICARAGUA', 'PARAGUAY', 'SLOVENIA'],
      ['TAJIKISTAN', 'TURKMENISTAN', 'UZBEKISTAN', 'ZIMBABWE', 'BOTSWANA'],
      ['DOMINICAN REPUBLIC', 'TRINIDAD AND TOBAGO', 'SOLOMON ISLANDS', 'SAN MARINO', 'MONTENEGRO']
    ],
    hard: [
      ['KYRGYZSTAN', 'AZERBAIJAN', 'LIECHTENSTEIN', 'MAURITANIA', 'MOZAMBIQUE'],
      ['PAPUA NEW GUINEA', 'ANTIGUA AND BARBUDA', 'BOSNIA AND HERZEGOVINA', 'BURKINA FASO', 'DEMOCRATIC REPUBLIC OF CONGO'],
      ['SAINT KITTS AND NEVIS', 'SAINT VINCENT AND THE GRENADINES', 'SAO TOME AND PRINCIPE', 'TRINIDAD AND TOBAGO', 'EQUATORIAL GUINEA'],
      ['MARSHALL ISLANDS', 'FEDERATED STATES OF MICRONESIA', 'UNITED ARAB EMIRATES', 'CENTRAL AFRICAN REPUBLIC', 'DOMINICAN REPUBLIC'],
      ['NORTH MACEDONIA', 'SOUTH AFRICA', 'SOUTH KOREA', 'NORTH KOREA', 'SOUTH SUDAN'],
      ['SIERRA LEONE', 'TIMOR LESTE', 'VATICAN CITY', 'CABO VERDE', 'SAINT LUCIA'],
      ['SOLOMON ISLANDS', 'SRI LANKA', 'COTE D\'IVOIRE', 'GUINEA BISSAU', 'NEW CALEDONIA'],
      ['CZECH REPUBLIC', 'REPUBLIC OF THE CONGO', 'SYRIAN ARAB REPUBLIC', 'UNITED KINGDOM', 'UNITED STATES OF AMERICA'],
      ['WALLIS AND FUTUNA', 'WESTERN SAHARA', 'AMERICAN SAMOA', 'FRENCH POLYNESIA', 'NORTHERN MARIANA ISLANDS'],
      ['BRITISH VIRGIN ISLANDS', 'HEARD ISLAND AND MCDONALD ISLANDS', 'SVALBARD AND JAN MAYEN', 'TURKS AND CAICOS ISLANDS', 'SAINT PIERRE AND MIQUELON']
    ]
  },
  sports: {
    easy: [
      ['GOLF', 'POOL', 'SWIM', 'DIVE', 'SURF'],
      ['JUDO', 'POLO', 'RACE', 'FISH', 'SAIL'],
      ['BOX', 'BOWL', 'DART', 'JUMP', 'LIFT'],
      ['RIDE', 'ROW', 'RUN', 'SKATE', 'SURF'],
      ['CLIMB', 'DANCE', 'FENCE', 'HIKE', 'SLED'],
      ['CHEER', 'CHESS', 'KAYAK', 'SQUAT', 'THROW'],
      ['CYCLE', 'SPRINT', 'SHOOT', 'DODGE', 'JOUST'],
      ['DISCUS', 'JAVELIN', 'KARATE', 'ROWING', 'CURLING'],
      ['ARCHERY', 'BOWLING', 'SKIING', 'HIKING', 'BIKING'],
      ['HURDLES', 'SKATING', 'LACROSSE', 'HANDBALL', 'PADDLING']
    ],
    medium: [
      ['SOCCER', 'TENNIS', 'HOCKEY', 'FOOTBALL', 'BASEBALL'],
      ['BASKETBALL', 'VOLLEYBALL', 'SWIMMING', 'WRESTLING', 'BADMINTON'],
      ['CRICKET', 'CYCLING', 'SKATING', 'SURFING', 'TRIATHLON'],
      ['BOXING', 'ROWING', 'SAILING', 'SKIING', 'SHOOTING'],
      ['FENCING', 'GYMNASTICS', 'MARATHON', 'RACQUETBALL', 'WATERPOLO'],
      ['SNOWBOARDING', 'TAEKWONDO', 'WEIGHTLIFTING', 'WINDSURFING', 'EQUESTRIAN'],
      ['BOBSLEDDING', 'BULLFIGHTING', 'CANOEING', 'KICKBOXING', 'PENTATHLON'],
      ['ROLLERBLADING', 'SKATEBOARDING', 'SKYDIVING', 'SPEEDSKATING', 'TRAMPOLINING'],
      ['BOULDERING', 'CHEERLEADING', 'CROSSCOUNTRY', 'DODGEBALL', 'MOUNTAINBIKING'],
      ['POLE VAULT', 'POWERLIFTING', 'SHOT PUT', 'SYNCHRONIZED SWIMMING', 'WATER SKIING']
    ],
    hard: [
      ['SUMO WRESTLING', 'RHYTHMIC GYMNASTICS', 'COMPETITIVE DIVING', 'MOUNTAIN CLIMBING', 'ARTISTIC GYMNASTICS'],
      ['SYNCHRONIZED SKATING', 'UNDERWATER HOCKEY', 'EQUESTRIAN VAULTING', 'COMPETITIVE BODYBUILDING', 'ARTISTIC SWIMMING'],
      ['NORDIC COMBINED', 'SPEED CLIMBING', 'SKELETON BOBSLED', 'FIGURE SKATING', 'CANOE SLALOM'],
      ['FREERUNNING PARKOUR', 'EXTREME IRONING', 'WIFE CARRYING', 'CYCLE SPEEDWAY', 'BEACH VOLLEYBALL'],
      ['COMPETITIVE BALLROOM DANCING', 'FREESTYLE SKIING', 'HURLING COMPETITION', 'COMPETITIVE FREEDIVING', 'MODERN PENTATHLON'],
      ['CROSS COUNTRY SKIING', 'TRACK AND FIELD ATHLETICS', 'COMPETITIVE CHEERLEADING', 'ARTISTIC ROLLER SKATING', 'WHEELCHAIR BASKETBALL'],
      ['COMPETITIVE TABLE TENNIS', 'ULTIMATE FRISBEE COMPETITION', 'COMPETITIVE ROCK CLIMBING', 'ADVENTURE RACING', 'COMPETITIVE HORSEBACK RIDING'],
      ['GRECO ROMAN WRESTLING', 'HAMMER THROW COMPETITION', 'JAVELIN THROW COMPETITION', 'OLYMPIC WEIGHTLIFTING', 'COMPETITIVE ROWING'],
      ['COMPETITIVE ICE DANCING', 'COMPETITIVE SKATEBOARDING', 'COMPETITIVE SNOWBOARDING', 'WATER POLO COMPETITION', 'COMPETITIVE CANOEING'],
      ['SYNCHRONIZED TRAMPOLINE', 'COMPETITIVE BATON TWIRLING', 'COMPETITIVE FIGURE SKATING', 'BICYCLE MOTOCROSS RACING', 'COMPETITIVE SYNCHRONIZED SWIMMING']
    ]
  }
};

type Category = keyof typeof wordCategories;
type Difficulty = 'easy' | 'medium' | 'hard';

export default function WordPuzzle() {
  const { updateScore, setGameCompleted } = useGameContext();
  const [category, setCategory] = useState<Category>('animals');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [level, setLevel] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [message, setMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [solvedWords, setSolvedWords] = useState<string[]>([]);
  const [remainingWords, setRemainingWords] = useState<string[]>([]);
  const [hints, setHints] = useState(3);
  const [levelLocked, setLevelLocked] = useState<boolean[]>(
    Array(10).fill(true).fill(false, 0, 1) // Only first level unlocked initially
  );
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isCompactView, setIsCompactView] = useState(true);
  const [showVictoryScreen, setShowVictoryScreen] = useState(false);
  const [levelBonus, setLevelBonus] = useState(0);

  // Initialize the game
  useEffect(() => {
    if (gameStarted) {
    initializeGame();
    }
  }, [category, difficulty, level, gameStarted]);

  // Set up the game with the selected category
  const initializeGame = () => {
    const words = [...wordCategories[category][difficulty][level]];
    setRemainingWords(words);
    setSolvedWords([]);
    setMessage('');
    setIsCorrect(null);
    setHints(3);
    selectNewWord(words);
  };

  // Start the game
  const startGame = () => {
    setGameStarted(true);
  };

  // Select a new word and scramble it
  const selectNewWord = (words: string[] = remainingWords) => {
    if (words.length === 0) {
      // Level completed!
      const newLevelLocked = [...levelLocked];
      if (level < 9) { // If not the last level
        newLevelLocked[level + 1] = false; // Unlock next level
        setLevelLocked(newLevelLocked);
      }
      
      // Award bonus points for completing the level
      const bonus = (level + 1) * 10 * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3);
      setLevelBonus(bonus);
      updateScore(bonus);
      
      setMessage(`Поздравления! Ниво завършено! +${bonus} бонус точки!`);
      setShowVictoryScreen(true);
      
      if (level === 9 && difficulty === 'hard') {
        setGameCompleted(true);
      }
      
      return;
    }

    const randomIndex = Math.floor(Math.random() * words.length);
    const word = words[randomIndex];
    setCurrentWord(word);
    
    // Remove the selected word from remaining words
    const updatedWords = [...words];
    updatedWords.splice(randomIndex, 1);
    setRemainingWords(updatedWords);
    
    // Scramble the word
    setScrambledWord(scrambleWord(word));
    setUserGuess('');
    setIsCorrect(null);
  };

  // Scramble a word
  const scrambleWord = (word: string) => {
    const letters = word.split('');
    let scrambled = word;
    
    // Make sure the scrambled word is different from the original
    while (scrambled === word) {
      for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
      }
      scrambled = letters.join('');
    }
    
    return scrambled;
  };

  // Check the user's guess
  const checkGuess = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userGuess) {
      setMessage('Моля, въведете предположение');
      return;
    }
    
    const formattedGuess = userGuess.toUpperCase();
    const correct = formattedGuess === currentWord;
    
    setIsCorrect(correct);
    
    if (correct) {
      // Add word to solved list
      setSolvedWords([...solvedWords, currentWord]);
      
      // Award points based on word length and difficulty
      const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
      const points = currentWord.length * 5 * difficultyMultiplier;
      updateScore(points);
      
      setMessage(`Правилно! +${points} точки`);
      
      // Move to next word after a delay
      setTimeout(() => {
        selectNewWord();
      }, 1500);
    } else {
      setMessage('Грешно. Опитайте отново или използвайте подсказка.');
    }
  };

  // Provide a hint (reveal one letter)
  const getHint = () => {
    if (hints <= 0) {
      setMessage('Няма повече подсказки');
      return;
    }
    
    // Convert user guess to uppercase array
    const currentGuess = userGuess.toUpperCase().split('');
    const targetWord = currentWord.split('');
    
    // Find the first incorrect or missing letter
    let hintIndex = -1;
    for (let i = 0; i < targetWord.length; i++) {
      if (i >= currentGuess.length || currentGuess[i] !== targetWord[i]) {
        hintIndex = i;
        break;
      }
    }
    
    if (hintIndex === -1) {
      // If we couldn't find a position, just reveal the next letter
      hintIndex = currentGuess.length;
    }
    
    // Apply the hint
    if (hintIndex < targetWord.length) {
      // Create a new guess with the hint
      const newGuess = [...currentGuess];
      newGuess[hintIndex] = targetWord[hintIndex];
      setUserGuess(newGuess.join(''));
      
      // Deduct a hint
      setHints(hints - 1);
      setMessage(`Използвахте подсказка! Остават ${hints - 1} подсказки.`);
    }
  };

  // Move to the next level if unlocked
  const changeLevel = (newLevel: number) => {
    if (!levelLocked[newLevel]) {
      setLevel(newLevel);
      startGame();
    } else {
      setMessage('Това ниво все още е заключено. Завършете предишното ниво първо!');
    }
  };

  const getCategoryDisplay = (cat: Category): string => {
    switch (cat) {
      case 'animals': return 'Животни';
      case 'fruits': return 'Плодове';
      case 'countries': return 'Държави';
      case 'sports': return 'Спортове';
    }
  };

  const getDifficultyDisplay = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 'Лесно';
      case 'medium': return 'Средно';
      case 'hard': return 'Сложно';
    }
  };

  const getCategoryEmoji = (cat: Category): string => {
    switch (cat) {
      case 'animals': return '🦁';
      case 'fruits': return '🍎';
      case 'countries': return '🌍';
      case 'sports': return '⚽';
    }
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
              Избери категория
            </h3>
            <div className={`flex justify-center ${isCompactView ? 'gap-2' : 'gap-4'} mb-8 flex-wrap`}>
              {(['animals', 'fruits', 'countries', 'sports'] as Category[]).map((categoryOption) => (
                <motion.button
                  key={categoryOption}
                  onClick={() => setCategory(categoryOption)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-3 rounded-lg transition-all shadow-sm ${
                    category === categoryOption
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium'
                      : 'bg-white border border-gray-200 text-gray-800 hover:border-indigo-300'
                  } flex items-center justify-center mb-2`}
                >
                  <span className={`${isCompactView ? 'text-lg' : 'text-xl'} mr-1`}>
                    {getCategoryEmoji(categoryOption)}
                  </span>
                  {getCategoryDisplay(categoryOption)}
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
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
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
                  onClick={() => !levelLocked[lvl] && changeLevel(lvl)}
                  whileHover={!levelLocked[lvl] ? { scale: 1.05 } : {}}
                  whileTap={!levelLocked[lvl] ? { scale: 0.98 } : {}}
                  className={`py-3 rounded-lg transition-all shadow-sm relative ${
                    level === lvl && !levelLocked[lvl]
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium'
                      : levelLocked[lvl]
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      : 'bg-white border border-gray-200 text-gray-800 hover:border-indigo-300'
                  }`}
                >
                  {levelLocked[lvl] && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  )}
                  <span className={levelLocked[lvl] ? "opacity-30" : ""}>
                    {lvl + 1}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
          
        </motion.div>
      ) : showVictoryScreen ? (
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
            Бонус точки: +{levelBonus}
          </motion.p>

          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <div className="bg-green-50 px-3 py-2 rounded-lg flex items-center text-green-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Решени думи: <span className="font-bold">{solvedWords.length}/{wordCategories[category][difficulty][level].length}</span></span>
            </div>
            
            <div className="bg-amber-50 px-3 py-2 rounded-lg flex items-center text-amber-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Останали подсказки: <span className="font-bold">{hints}</span></span>
            </div>
          </div>
          
          {level < 9 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                changeLevel(level + 1);
                setShowVictoryScreen(false);
              }}
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
                setShowVictoryScreen(false);
                startGame();
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
              setShowVictoryScreen(false);
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
        <div className="mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center space-y-8"
          >
            <div className="mb-2 flex items-center justify-center">
              <span className="text-3xl mr-2">📝</span>
              <h2 className={`${isCompactView ? 'text-xl' : 'text-2xl'} font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text`}>Словесна Загадка</h2>
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-md text-center mt-8"
            >
              <div className="flex justify-between mb-6 flex-wrap">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-2 bg-indigo-100`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Категория</div>
                    <div className="font-medium capitalize">
                      {category === 'animals' ? 'Животни' : 
                       category === 'fruits' ? 'Плодове' : 
                       category === 'countries' ? 'Държави' : 
                       category === 'sports' ? 'Спортове' : category}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="p-2 rounded-lg mr-2 bg-purple-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Трудност</div>
                    <div className="font-medium">{getDifficultyDisplay(difficulty)} • Ниво {level + 1}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="p-2 rounded-lg mr-2 bg-green-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Решени думи</div>
                    <div className="font-medium">{solvedWords.length}/{wordCategories[category][difficulty][level].length}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg mb-6">
                <p className="text-gray-600 mb-2 text-sm font-medium">
                  Разшифровайте думата:
                </p>
                <motion.h2 
                  className="text-4xl font-bold tracking-wider mb-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
                  animate={{ scale: [0.95, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                >
                  {scrambledWord}
                </motion.h2>
              </div>

              <form onSubmit={checkGuess} className="flex flex-col items-center">
                <input
                  type="text"
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  placeholder="Вашият отговор"
                  className={`w-full max-w-md text-center text-2xl p-3 border-2 rounded-lg mb-4 ${
                    isCorrect === true
                      ? 'border-green-500 bg-green-50'
                      : isCorrect === false
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-indigo-500'
                  } outline-none uppercase`}
                />
                <div className="flex gap-3">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg transition-all shadow-md font-medium flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Проверете отговора
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={getHint}
                    disabled={hints <= 0}
                    whileHover={hints > 0 ? { scale: 1.05 } : {}}
                    whileTap={hints > 0 ? { scale: 0.98 } : {}}
                    className={`py-3 px-6 rounded-lg transition-all shadow-sm font-medium flex items-center ${
                      hints > 0
                        ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Подсказка ({hints})
                  </motion.button>
                </div>
              </form>

              {message && !message.includes("Ниво завършено") && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 rounded-lg text-center ${
                    isCorrect === true
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : isCorrect === false
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : 'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}
                >
                  <div className="font-medium relative z-10">{message}</div>
                </motion.div>
              )}

              {solvedWords.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 pt-6 border-t"
                >
                  <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Решени думи:
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {solvedWords.map((word) => (
                      <motion.span 
                        key={word} 
                        className="px-3 py-1.5 bg-green-100 text-green-800 text-xs rounded-md border border-green-200 font-medium uppercase"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 