'use client';

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnimation } from "@/components/AnimationContext";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function GamesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { lastClickedCategory, categoryPositions, setLastClickedCategory } = useAnimation();
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  // Set window size after mount to avoid SSR issues
  useEffect(() => {
    // Only set window size once after mount
    if (windowSize.width === 0 && windowSize.height === 0) {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    
    // Handle resize with throttling
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setWindowSize(current => {
          const newWidth = window.innerWidth;
          const newHeight = window.innerHeight;
          
          // Only update if changed to avoid loops
          if (current.width !== newWidth || current.height !== newHeight) {
            return { width: newWidth, height: newHeight };
          }
          return current;
        });
      }, 100); // Throttle to once per 100ms
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []); // Empty dependency array since we're using the functional state update pattern
  
  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Show loading for 1.2 seconds

    return () => clearTimeout(timer);
  }, []);
  
  // Calculate starting position for animation
  const startPosition = lastClickedCategory && categoryPositions[lastClickedCategory] && windowSize.width > 0
    ? { 
        x: categoryPositions[lastClickedCategory].x - windowSize.width / 2,
        y: categoryPositions[lastClickedCategory].y - windowSize.height / 2
      }
    : { x: 0, y: 0 };

  // Handle back button click
  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExiting(true);
    
    // Delay navigation to show exit animation
    setTimeout(() => {
      router.push('/');
    }, 300);
  };

  // Reset the last clicked category when component unmounts
  useEffect(() => {
    return () => {
      setLastClickedCategory(null);
    };
  }, [setLastClickedCategory]);

  return (
    <motion.div 
      className="max-w-6xl mx-auto px-4 pt-8 pb-16 backdrop-blur-sm bg-white/10 rounded-xl"
      initial={{ 
        opacity: 0,
        scale: 0.8, 
        x: startPosition.x,
        y: startPosition.y
      }}
      animate={{ 
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0
      }}
      exit={isExiting && lastClickedCategory && categoryPositions[lastClickedCategory] ? {
        opacity: 0,
        scale: 0.8,
        x: startPosition.x,
        y: startPosition.y
      } : {
        opacity: 0,
        scale: 0.8
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      key="game-layout"
    >
      <div className="py-6 mb-6 flex items-center justify-between">
        <Link
          href="/"
          onClick={handleBackClick}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium group backdrop-blur-sm bg-white/60 rounded-full px-4 py-2"
        >
          <div className="bg-indigo-100 rounded-full p-2 mr-3 group-hover:bg-indigo-200 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </div>
          Към категориите
        </Link>
      </div>
      <motion.div 
        className="backdrop-blur-sm bg-white/80 p-6 rounded-xl shadow-lg min-h-[500px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-[500px] flex items-center justify-center"
            >
              <LoadingAnimation />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
} 