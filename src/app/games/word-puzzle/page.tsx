'use client';

import { GameProvider } from '@/components/GameContext';
import GameContainer from '@/components/GameContainer';
import WordPuzzle from '@/games/word-puzzle/WordPuzzle';

export default function WordPuzzlePage() {
  return (
    <>
      <GameProvider>
        <GameContainer
          title="Пъзели с думи"
          description="Разбърквайте букви, отгатнете думи и развивайте речниковия си запас с увлекателни словесни предизвикателства."
          timerEnabled={false}
        >
          <WordPuzzle />
        </GameContainer>
      </GameProvider>
    </>
  );
} 