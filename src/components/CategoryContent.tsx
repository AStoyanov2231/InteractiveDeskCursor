'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import LoadingAnimation from './LoadingAnimation';
import { GameProvider } from './GameContext';

// Define a GameSelection component for multiplayer game selection
interface GameSelectionProps {
  title: string;
  icon: string;
  onClick: () => void;
}

const GameSelection = ({ title, icon, onClick }: GameSelectionProps) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-white shadow-md rounded-lg p-3 cursor-pointer flex flex-col items-center text-center"
    onClick={onClick}
  >
    <span className="text-2xl mb-1">{icon}</span>
    <h4 className="font-medium text-sm">{title}</h4>
  </motion.div>
);

// Dynamic imports for game components
const MemoryGame = lazy(() => import('@/games/memory-match/MemoryGame'));
const WordPuzzle = lazy(() => import('@/games/word-puzzle/WordPuzzle'));
const LogicPuzzle = lazy(() => import('@/games/logic-puzzle/LogicPuzzle'));
const MathPuzzle = lazy(() => import('@/games/math-puzzle/MathPuzzle'));
const PatternRecognition = lazy(() => import('@/games/pattern-recognition/PatternRecognition'));
const TriviaChallenge = lazy(() => import('@/games/trivia-challenge/TriviaChallenge'));
const TeamManager = lazy(() => import('./TeamManager'));
// Multiplayer games - removed temporarily for refactoring

interface CategoryContentProps {
  categoryId: string | null;
  title: string;
  icon: string;
  href: string;
  onClose: () => void;
}

export default function CategoryContent({ categoryId, title, icon, href, onClose }: CategoryContentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    if (categoryId) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800); // Loading simulation
      
      return () => clearTimeout(timer);
    }
  }, [categoryId]);
  
  const renderGameComponent = () => {
    if (!categoryId) return null;
    
    // Reset any game-specific state when switching games
    switch (categoryId) {
      case 'memory-match':
        return <GameProvider><MemoryGame /></GameProvider>;
      case 'word-puzzle':
        return <GameProvider><WordPuzzle /></GameProvider>;
      case 'logic-puzzle':
        return <GameProvider><LogicPuzzle /></GameProvider>;
      case 'math-puzzle':
        return <GameProvider><MathPuzzle /></GameProvider>;
      case 'pattern-recognition':
        return <GameProvider><PatternRecognition /></GameProvider>;
      case 'trivia-challenge':
        return <GameProvider><TriviaChallenge /></GameProvider>;
      case 'multiplayer':
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-bold mb-2">Team Manager</h3>
            <TeamManager />
          </div>
        );
      // Add cases for other game types
      default:
        return (
          <div className="p-8 text-center">
            <p className="text-xl">Game component not found for {categoryId}</p>
          </div>
        );
    }
  };
  
  if (!categoryId) return null;
  
  return (
    <motion.div
      className="w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-[300px] flex items-center justify-center"
          >
            <LoadingAnimation />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3"
          >
            <header className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-3" style={{background: 'linear-gradient(to bottom right, #8b5cf6, #ec4899)'}}>
                  <span className="text-2xl">{icon}</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold">{title}</h1>
                </div>
              </div>
              
              <motion.button 
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </header>
            
            <Suspense fallback={<LoadingAnimation />}>
              {renderGameComponent()}
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 