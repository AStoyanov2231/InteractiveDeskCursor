'use client';

import { useEffect, useState } from 'react';

export default function GradientBackground() {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main gradient background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20"
        style={{
          transform: `translateY(${scrollY * 0.02}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-float-medium" />
      <div className="absolute top-3/4 left-1/3 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl animate-float-fast" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-pattern-dots opacity-5" />
    </div>
  );
} 