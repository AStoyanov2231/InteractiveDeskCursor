'use client';

import { motion } from 'framer-motion';

export default function LoadingAnimation({disabled = true}) {
  if (disabled) return null;
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 mb-6">
        <motion.div 
          className="absolute inset-0 border-4 border-indigo-500 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1, 1.2, 1],
            opacity: [0, 1, 0.8, 0] 
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute inset-0 border-4 border-amber-500 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1, 1.2, 1],
            opacity: [0, 1, 0.8, 0] 
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
        />
        <motion.div 
          className="absolute inset-0 border-4 border-pink-500 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1, 1.2, 1],
            opacity: [0, 1, 0.8, 0] 
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6
          }}
        />
      </div>
      
      <motion.div 
        className="flex space-x-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
        <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
        <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
      </motion.div>
      
      <motion.p 
        className="mt-6 text-lg font-medium text-gray-700"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        Зареждане...
      </motion.p>
    </div>
  );
} 