'use client';

import { ReactNode, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export type GameContainerProps = {
  title: string;
  description?: string;
  children: ReactNode;
  showPlayer?: boolean;
  timerEnabled?: boolean;
  onTimerEnd?: () => void;
  timerDuration?: number; // in seconds
};

export default function GameContainer({
  title,
  description,
  children,
  showPlayer = false, // Default to false since we're removing auth
  timerEnabled = false,
  onTimerEnd,
  timerDuration = 60,
}: GameContainerProps) {
  const [timer, setTimer] = useState(timerDuration);
  const [isPlaying, setIsPlaying] = useState(true);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && timerEnabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0 && onTimerEnd) {
            clearInterval(interval);
            onTimerEnd();
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timerEnabled, timer, onTimerEnd]);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl shadow-lg overflow-hidden backdrop-blur-md bg-white/90 max-w-5xl mx-auto border border-white/20"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500/90 to-purple-600/90 p-6 text-white backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">{title}</h1>
          
          {timerEnabled && (
            <div className="bg-white/20 px-3 py-1 rounded-lg text-white backdrop-blur-sm">
              {formatTime(timer)}
            </div>
          )}
        </div>
        
        {description && (
          <p className="mt-2 text-white/90 text-sm">
            {description}
          </p>
        )}
      </div>

      {/* Game content */}
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );
} 