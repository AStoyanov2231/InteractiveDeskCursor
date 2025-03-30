'use client';

import { ReactNode, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useAnimation } from './AnimationContext';

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { setLastClickedCategory } = useAnimation();
  
  // Reset animation context when navigating directly (not through category links)
  useEffect(() => {
    if (!pathname.startsWith('/games/')) {
      setLastClickedCategory(null);
    }
  }, [pathname, setLastClickedCategory]);

  return (
    <AnimatePresence mode="wait">
      {children}
    </AnimatePresence>
  );
} 