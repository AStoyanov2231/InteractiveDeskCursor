// In-memory data store for game progress and leaderboards
// This simulates a database but resets on page refresh

// Interfaces for data types
export interface GameData {
  gameId: string;
  userId?: string;
  score: number;
  completed: boolean;
  timestamp: string;
  additionalData?: any;
}

export interface LeaderboardEntry {
  playerName: string;
  playerId: string;
  gameName: string;
  score: number;
  date: string;
  timestamp?: string;
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string | number;
  type: 'text' | 'multiple-choice' | 'number';
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdBy?: string;
  createdAt: string;
}

// In-memory stores
let gameProgressStore: GameData[] = [];
let leaderboardStore: LeaderboardEntry[] = [];
let quizzesStore: Quiz[] = [];

// Game progress functions
export function saveGameProgress(gameData: GameData): GameData {
  // Add timestamp if not provided
  if (!gameData.timestamp) {
    gameData.timestamp = new Date().toISOString();
  }
  
  // Replace existing entry for same game/user or add new one
  const existingIndex = gameProgressStore.findIndex(
    item => item.gameId === gameData.gameId && item.userId === gameData.userId
  );
  
  if (existingIndex >= 0) {
    gameProgressStore[existingIndex] = gameData;
  } else {
    gameProgressStore.push(gameData);
  }
  
  return gameData;
}

export function getGameProgress(gameId: string, userId?: string): GameData | null {
  const entry = gameProgressStore.find(
    item => item.gameId === gameId && (!userId || item.userId === userId)
  );
  
  return entry || null;
}

// Leaderboard functions
export function addLeaderboardEntry(entry: Omit<LeaderboardEntry, "timestamp">): LeaderboardEntry {
  const newEntry: LeaderboardEntry = {
    ...entry,
    timestamp: new Date().toISOString()
  };
  
  leaderboardStore.push(newEntry);
  return newEntry;
}

export function getLeaderboard(limit: number = 50): LeaderboardEntry[] {
  // Sort by score in descending order
  return [...leaderboardStore]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// Quiz functions
export function saveQuiz(quiz: Omit<Quiz, "createdAt">): Quiz {
  const newQuiz: Quiz = {
    ...quiz,
    createdAt: new Date().toISOString()
  };
  
  const existingIndex = quizzesStore.findIndex(item => item.id === quiz.id);
  
  if (existingIndex >= 0) {
    quizzesStore[existingIndex] = newQuiz;
  } else {
    quizzesStore.push(newQuiz);
  }
  
  return newQuiz;
}

export function getAllQuizzes(): Quiz[] {
  return [...quizzesStore];
}

export function getQuizById(id: string): Quiz | null {
  const quiz = quizzesStore.find(item => item.id === id);
  return quiz || null;
}

export function deleteQuiz(id: string): boolean {
  const initialLength = quizzesStore.length;
  quizzesStore = quizzesStore.filter(quiz => quiz.id !== id);
  return quizzesStore.length < initialLength;
}

// Utility function to clear all data
export function clearAllData(): void {
  gameProgressStore = [];
  leaderboardStore = [];
  quizzesStore = [];
} 