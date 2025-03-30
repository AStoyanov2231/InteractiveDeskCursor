// Types for the data store
interface GameProgress {
  gameType: string;
  level: number;
  score: number;
  completed: boolean;
  timestamp: string;
  [key: string]: any; // For any additional properties
}

interface LeaderboardEntry {
  playerName: string;
  score: number;
  timestamp: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: any[];
  createdAt: string;
  [key: string]: any; // For any additional properties
}

interface DataStore {
  gameProgress: Record<string, GameProgress[]>;
  leaderboard: LeaderboardEntry[];
  quizzes: Quiz[];
}

// Mock data store for local use without backend
const mockDataStore: DataStore = {
  // Local storage for game progress during a session
  gameProgress: {},
  
  // Local leaderboard 
  leaderboard: [],
  
  // Local custom quizzes
  quizzes: []
};

// Helper function to save game progress to local state
export const saveProgress = (gameType: string, data: Omit<GameProgress, 'timestamp' | 'gameType'> & { gameType?: string }): boolean => {
  if (!mockDataStore.gameProgress[gameType]) {
    mockDataStore.gameProgress[gameType] = [];
  }
  
  mockDataStore.gameProgress[gameType].push({
    ...data,
    gameType,
    timestamp: new Date().toISOString()
  });
  
  return true;
};

// Helper function to get game progress from local state
export const getProgress = (gameType: string): GameProgress[] => {
  return mockDataStore.gameProgress[gameType] || [];
};

// Helper function to save and get leaderboard data
export const updateLeaderboard = (playerName: string, score: number): LeaderboardEntry[] => {
  const entry: LeaderboardEntry = {
    playerName,
    score,
    timestamp: new Date().toISOString()
  };
  
  mockDataStore.leaderboard.push(entry);
  
  // Sort by score in descending order
  mockDataStore.leaderboard.sort((a, b) => b.score - a.score);
  
  return mockDataStore.leaderboard;
};

export const getLeaderboard = (limit = 10): LeaderboardEntry[] => {
  return mockDataStore.leaderboard.slice(0, limit);
};

// Helper functions for custom quizzes
export const saveQuiz = (quizData: Omit<Quiz, 'id' | 'createdAt'>): Quiz => {
  const id = Date.now().toString();
  const quiz: Quiz = {
    ...quizData,
    id,
    createdAt: new Date().toISOString()
  };
  
  mockDataStore.quizzes.push(quiz);
  return quiz;
};

export const getQuizzes = (): Quiz[] => {
  return mockDataStore.quizzes;
};

export const getQuiz = (id: string): Quiz | undefined => {
  return mockDataStore.quizzes.find(quiz => quiz.id === id);
};

export const deleteQuiz = (id: string): boolean => {
  const index = mockDataStore.quizzes.findIndex(quiz => quiz.id === id);
  if (index !== -1) {
    mockDataStore.quizzes.splice(index, 1);
    return true;
  }
  return false; 