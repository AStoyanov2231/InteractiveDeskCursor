'use client';

import dynamic from 'next/dynamic';

// Dynamically import the Gradient background with ssr: false
const GradientBackground = dynamic(() => import('./GradientBackground'), {
  ssr: false,
});

export default function GradientBackgroundWrapper() {
  return <GradientBackground />;
} 