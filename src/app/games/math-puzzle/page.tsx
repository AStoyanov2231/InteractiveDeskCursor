'use client';

import { GameProvider } from '@/components/GameContext';
import GameContainer from '@/components/GameContainer';
import MathPuzzle from '@/games/math-puzzle/MathPuzzle';

export default function MathPuzzlePage() {
  return (
    <>
      <GameProvider>
        <GameContainer
          title="Математически предизвикателства"
          timerEnabled={false}
        >
          <MathPuzzle />
        </GameContainer>
      </GameProvider>
    </>
  );
} 