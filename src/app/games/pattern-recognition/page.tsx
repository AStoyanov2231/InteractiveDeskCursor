'use client';

import { GameProvider } from '@/components/GameContext';
import GameContainer from '@/components/GameContainer';
import PatternRecognition from '@/games/pattern-recognition/PatternRecognition';

export default function PatternRecognitionPage() {
  return (
    <>
      <GameProvider>
        <GameContainer
          title="Разпознаване на закономерности"
          description="Открийте липсващите елементи в редиците, намерете закономерностите и тренирайте логическото си мислене."
          timerEnabled={false}
        >
          <PatternRecognition />
        </GameContainer>
      </GameProvider>
    </>
  );
} 