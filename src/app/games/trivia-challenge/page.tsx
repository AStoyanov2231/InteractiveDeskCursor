'use client';

import { GameProvider } from '@/components/GameContext';
import GameContainer from '@/components/GameContainer';
import TriviaChallenge from '@/games/trivia-challenge/TriviaChallenge';

export default function TriviaChallengeGame() {
  return (
    <>
      <GameProvider>
        <GameContainer 
          title="Trivia Challenge"
        >
          <TriviaChallenge />
        </GameContainer>
      </GameProvider>
    </>
  );
} 