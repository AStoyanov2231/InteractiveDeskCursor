'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { saveGameProgress } from '@/lib/dataStore';

type GameContextType = {
  score: number;
  updateScore: (points: number) => void;
  gameCompleted: boolean;
  setGameCompleted: (completed: boolean) => void;
  saveScore: (gameId: string) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  const updateScore = (points: number) => {
    setScore((prevScore) => prevScore + points);
  };

  const saveScore = (gameId: string) => {
    // Use default user ID since authentication is removed
    saveGameProgress({
      gameId,
      userId: 'default-user',
      score,
      completed: true,
      timestamp: new Date().toISOString(),
      additionalData: {}
    });
  };

  return (
    <GameContext.Provider
      value={{
        score,
        updateScore,
        gameCompleted,
        setGameCompleted,
        saveScore
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
} 