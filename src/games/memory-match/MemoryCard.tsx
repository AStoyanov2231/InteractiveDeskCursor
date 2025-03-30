import { motion } from 'framer-motion';
import { useEffect } from 'react';

export interface Card {
  id: number;
  imageSrc: string; // This will now contain emoji characters
  matched: boolean;
  difficulty: number;
  level: number;
}

interface MemoryCardProps {
  card: Card;
  flipped: boolean;
  disabled: boolean;
  onClick: () => void;
  isCompactView?: boolean;
}

export default function MemoryCard({ card, flipped, disabled, onClick, isCompactView = false }: MemoryCardProps) {
  // Add 3D transform CSS styles
  useEffect(() => {
    // Check if the style element already exists to avoid duplicates
    if (!document.getElementById('memory-card-styles')) {
      const style = document.createElement('style');
      style.id = 'memory-card-styles';
      style.textContent = `
        .memory-card-inner {
          transform-style: preserve-3d;
          -webkit-transform-style: preserve-3d;
          transition: transform 0.1s;
          -webkit-transition: -webkit-transform 0.1s;
        }
        
        .memory-card-back,
        .memory-card-front {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 0.5rem;
        }
        
        .memory-card-front {
          transform: rotateY(180deg);
          -webkit-transform: rotateY(180deg);
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="relative">
      <div
        className={`cursor-pointer ${isCompactView ? 'w-16 h-14 sm:w-20 sm:h-16' : 'w-24 h-20 sm:w-28 sm:h-24'}`}
        onClick={() => !disabled && onClick()}
        style={{ perspective: '1000px' }}
      >
        <motion.div
          className="w-full h-full memory-card-inner"
          initial={false}
          animate={{ 
            rotateY: flipped ? 180 : 0,
          }}
          transition={{ duration: 0.08, type: 'spring', stiffness: 500, damping: 20 }}
          style={{ 
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
          whileHover={{ scale: flipped || disabled ? 1 : 1.06 }}
          whileTap={{ scale: flipped || disabled ? 1 : 0.95 }}
        >
          {/* Back side - question mark */}
          <div 
            className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md memory-card-back overflow-hidden"
          >
            <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center">
              <motion.div
                animate={{ rotate: [0, 15, 0, -15, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: 'loop', 
                  duration: 5,
                  repeatDelay: 1
                }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  className="w-5 h-5 text-white" 
                  fill="none" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
            </div>
          </div>
  
          {/* Front side - emoji */}
          <div 
            className={`absolute inset-0 rounded-lg w-full h-full ${card.matched ? 'opacity-80' : ''} memory-card-front`}
          >
            <div className="absolute inset-0 bg-white rounded-lg p-1 shadow-lg">
              <div className="w-full h-full rounded-md bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <motion.span
                  className={`text-4xl ${card.matched ? 'opacity-50' : ''}`}
                  animate={card.matched ? { 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0, -10, 0],
                  } : {}}
                  transition={card.matched ? { 
                    duration: 0.5,
                    repeat: 1
                  } : {}}
                >
                  {card.imageSrc}
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 