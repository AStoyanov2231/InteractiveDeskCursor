'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useAnimation } from "@/components/AnimationContext";
import CategoryContent from "@/components/CategoryContent";

// Array of game categories
const gameCategories = [
  {
    id: "memory-match",
    title: "Игра на паметта",
    color: "bg-purple-500",
    gradient: "gradient-1",
    icon: "🧠",
    href: "/games/memory-match",
  },
  {
    id: "logic-puzzle",
    title: "Логически пъзели",
    color: "bg-blue-500",
    gradient: "gradient-2",
    icon: "🧩",
    href: "/games/logic-puzzle",
  },
  {
    id: "math-puzzle",
    title: "Математически предизвикателства",
    color: "bg-green-500",
    gradient: "gradient-3",
    icon: "🔢",
    href: "/games/math-puzzle",
  },
  {
    id: "pattern-recognition",
    title: "Игри с модели",
    color: "bg-amber-500",
    gradient: "gradient-1",
    icon: "📊",
    href: "/games/pattern-recognition",
  },
  {
    id: "word-puzzle",
    title: "Словесни пъзели",
    color: "bg-rose-500",
    gradient: "gradient-2",
    icon: "📝",
    href: "/games/word-puzzle",
  },
  {
    id: "trivia-challenge",
    title: "Викторина",
    color: "bg-orange-500",
    gradient: "gradient-3",
    icon: "❓",
    href: "/games/trivia-challenge",
  },
  {
    id: "multiplayer",
    title: "Състезателни игри",
    color: "bg-blue-500",
    gradient: "gradient-1",
    icon: "👥",
    href: "/games/multiplayer",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
      duration: 0.3
    }
  }
};

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { setCategoryPosition, setLastClickedCategory } = useAnimation();
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // Store positions to compare changes
  const positionsRef = useRef<Record<string, {x: number, y: number}>>({});

  // Set ref for a category element
  const setCategoryRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    categoryRefs.current[id] = el;
  }, []);

  // Function to update category positions - memoized with useCallback
  const updatePositions = useCallback(() => {
    let hasChanges = false;
    
    Object.entries(categoryRefs.current).forEach(([id, element]) => {
      if (element) {
        const rect = element.getBoundingClientRect();
        const newPosition = { 
          x: rect.left + rect.width / 2, 
          y: rect.top + rect.height / 2 
        };
        
        // Check if position changed significantly before updating
        const oldPos = positionsRef.current[id];
        if (!oldPos || 
            Math.abs(oldPos.x - newPosition.x) > 1 || 
            Math.abs(oldPos.y - newPosition.y) > 1) {
          
          // Update ref with new position
          positionsRef.current[id] = newPosition;
          hasChanges = true;
          
          // Update context state
          setCategoryPosition(id, newPosition);
        }
      }
    });
    
    return hasChanges;
  }, [setCategoryPosition]);

  // Update category positions when they render
  useEffect(() => {
    // Initial update
    updatePositions();

    // Update positions on resize with debounce
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updatePositions();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [updatePositions]);

  // Handle category click to track which one was clicked
  const handleCategoryClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent default navigation
    setLastClickedCategory(id);
    setSelectedCategory(id);
  };

  // Handle closing the category content
  const handleCloseCategory = () => {
    setSelectedCategory(null);
  };

  // Get the selected category data
  const getSelectedCategory = () => {
    return gameCategories.find(category => category.id === selectedCategory);
  };

  const selectedCategoryData = getSelectedCategory();

  return (
    <>
      <Header />
      
      <motion.div 
        className="flex flex-row gap-8 py-2 px-2"
        key="home-page"
        layout
      >
        {/* Side column for categories */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-80 flex-shrink-0"
        >
          <div className="space-y-3">
            {gameCategories.map((category) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 25px 30px -5px rgba(0,0,0,0.15), 0 15px 15px -5px rgba(0,0,0,0.07)",
                  x: 8,
                  y: -3
                }}
                transition={{ duration: 0.025 }}
                whileTap={{ scale: 0.98, y: 2, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                onHoverStart={() => setHoveredCard(category.id)}
                onHoverEnd={() => setHoveredCard(null)}
                ref={setCategoryRef(category.id)}
                className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white backdrop-blur-sm bg-opacity-90 ${selectedCategory === category.id ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
              >
                <div className="flex flex-col h-full">
                  <div 
                    className="flex items-center p-6 cursor-pointer group"
                    onClick={(e) => handleCategoryClick(e, category.id)}
                  >
                    <div className={`${category.gradient} h-12 w-12 rounded-lg flex items-center justify-center relative overflow-hidden mr-3 flex-shrink-0 transition-all duration-300 group-hover:scale-110`}>
                      <div className="absolute inset-0 shimmer opacity-30"></div>
                      <motion.span 
                        className="text-3xl relative z-10"
                        animate={hoveredCard === category.id ? { 
                          scale: [1, 1.2, 1],
                          rotate: [0, 5, 0, -5, 0],
                        } : {}}
                        transition={{ 
                          duration: 0.3,
                          repeat: hoveredCard === category.id ? Infinity : 0,
                          repeatDelay: 0.2
                        }}
                      >{category.icon}</motion.span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold">{category.title}</h2>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main content area */}
        <motion.div 
          layout
          className="flex-1"
        >
          <AnimatePresence mode="wait">
            {selectedCategory ? (
              <motion.div
                key="category-content"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="h-auto overflow-visible"
              >
                <CategoryContent 
                  categoryId={selectedCategory}
                  title={selectedCategoryData?.title || ''}
                  icon={selectedCategoryData?.icon || ''}
                  href={selectedCategoryData?.href || ''}
                  onClose={handleCloseCategory}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="welcome-screen"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="flex items-center justify-center"
              >
                <div className="text-center max-w-2xl">
                  <div className="inline-block mb-4">
                    <motion.div 
                      animate={{ rotate: [0, 5, 0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      className="text-6xl mb-4 float"
                    >
                      🎮
                    </motion.div>
                  </div>
                  <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 text-transparent bg-clip-text">
                    Добре дошли в Платформата за пъзели!
                  </h1>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}
