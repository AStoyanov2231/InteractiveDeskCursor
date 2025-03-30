'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-4 px-6 bg-white shadow-md rounded-lg mb-8">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-3xl">🎮</span>
          <span className="font-bold text-xl bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 text-transparent bg-clip-text">
            Puzzle Platform
          </span>
        </Link>
      </div>
    </header>
  );
} 