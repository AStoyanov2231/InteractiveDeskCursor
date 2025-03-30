import { saveGameProgress, getGameProgress as getGameProgressById, getLeaderboard as getLeaderboardFromStore, addLeaderboardEntry, GameData, LeaderboardEntry } from './dataStore';

export type GameType = 'memory-match' | 'logic-puzzle' | 'math-puzzle' | 'pattern-recognition' | 'word-puzzle' | 'trivia-challenge' | 'multiplayer';

export interface GameProgress {
  userId: string;
  gameType: GameType;
  difficulty: number;
  level: number;
  score: number;
  completed: boolean;
  lastPlayedAt: string;
  metadata?: any;
}

export interface UserStats {
  totalScore: number;
  gamesPlayed: number;
  gamesCompleted: number;
}

// Convert GameProgress to GameData format
function convertToGameData(progress: GameProgress): GameData {
  return {
    gameId: `${progress.gameType}-${progress.difficulty}-${progress.level}`,
    userId: progress.userId,
    score: progress.score,
    completed: progress.completed,
    timestamp: progress.lastPlayedAt,
    additionalData: {
      gameType: progress.gameType,
      difficulty: progress.difficulty,
      level: progress.level,
      metadata: progress.metadata
    }
  };
}

// Fetch user progress for a specific game
export async function getUserGameProgress(userId: string, gameType: GameType) {
  try {
    // This is a simplified version that mimics the previous API
    // In a real implementation, we would retrieve all games for the user and filter
    return [];
  } catch (error) {
    console.error('Error fetching user game progress:', error);
    return null;
  }
}

// Save or update user progress
export async function saveUserProgress(progress: GameProgress) {
  try {
    progress.lastPlayedAt = new Date().toISOString();
    saveGameProgress(convertToGameData(progress));
    return true;
  } catch (error) {
    console.error('Error saving progress:', error);
    return false;
  }
}

// Get user statistics - simplified version for local data store
export async function getUserStats(userId: string): Promise<UserStats | null> {
  try {
    // Since we don't have a way to get all game progress for a user in our new structure,
    // we'll return default stats
    return {
      totalScore: 0,
      gamesPlayed: 0,
      gamesCompleted: 0
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
}

// Get leaderboard data
export async function getLeaderboard(limit = 10) {
  try {
    return getLeaderboardFromStore(limit);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

// Add entry to leaderboard
export async function addToLeaderboard(userId: string, username: string, score: number) {
  try {
    addLeaderboardEntry({
      playerName: username,
      playerId: userId,
      gameName: 'general',
      score: score,
      date: new Date().toLocaleDateString()
    });
    return true;
  } catch (error) {
    console.error('Error adding to leaderboard:', error);
    return false;
  }
} 