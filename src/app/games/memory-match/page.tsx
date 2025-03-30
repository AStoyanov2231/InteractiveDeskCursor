'use client';

import { GameProvider } from '@/components/GameContext';
import GameContainer from '@/components/GameContainer';
import MemoryGame from '@/games/memory-match/MemoryGame';

export default function MemoryMatchPage() {
  return (
    <>
      <GameProvider>
        <GameContainer
          title="Игра на паметта"
          description="Обръщайте карти, за да намерите съвпадащи двойки и тествайте паметта си."
          timerEnabled={false}
        >
          <MemoryGame />
        </GameContainer>
      </GameProvider>
    </>
  );
} 