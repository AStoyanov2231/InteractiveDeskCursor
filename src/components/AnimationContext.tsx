'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type Position = {
  x: number;
  y: number;
};

interface AnimationContextType {
  lastClickedCategory: string | null;
  categoryPositions: Record<string, Position>;
  setCategoryPosition: (id: string, position: Position) => void;
  setLastClickedCategory: (id: string | null) => void;
}

const AnimationContext = createContext<AnimationContextType>({
  lastClickedCategory: null,
  categoryPositions: {},
  setCategoryPosition: () => {},
  setLastClickedCategory: () => {},
});

export const useAnimation = () => useContext(AnimationContext);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [lastClickedCategory, setLastClickedCategory] = useState<string | null>(null);
  const [categoryPositions, setCategoryPositions] = useState<Record<string, Position>>({});

  // Use useCallback to memoize the function and prevent unnecessary re-renders
  const setCategoryPosition = useCallback((id: string, position: Position) => {
    setCategoryPositions(prev => {
      // Check if position actually changed to avoid unnecessary re-renders
      const currentPos = prev[id];
      if (currentPos && 
          Math.abs(currentPos.x - position.x) < 0.1 && 
          Math.abs(currentPos.y - position.y) < 0.1) {
        return prev; // Return same state reference if no change (within tolerance)
      }
      
      // Create new state with updated position
      return {
        ...prev,
        [id]: position,
      };
    });
  }, []);

  return (
    <AnimationContext.Provider
      value={{
        lastClickedCategory,
        categoryPositions,
        setCategoryPosition,
        setLastClickedCategory,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
} 