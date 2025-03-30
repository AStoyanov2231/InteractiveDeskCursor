'use client';

import { GameProvider } from '@/components/GameContext';
import GameContainer from '@/components/GameContainer';
import LogicPuzzle from '@/games/logic-puzzle/LogicPuzzle';

export default function LogicPuzzlePage() {
  return (
    <>
      <GameProvider>
        <GameContainer
          title="Логически пъзели"
          timerEnabled={false}
        >
          <LogicPuzzle />
        </GameContainer>
      </GameProvider>
    </>
  );
} 