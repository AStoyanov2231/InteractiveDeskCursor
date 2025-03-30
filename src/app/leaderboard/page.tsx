'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaAward } from 'react-icons/fa';
import Header from '@/components/Header';
import { getLeaderboard, addLeaderboardEntry, LeaderboardEntry } from '@/lib/dataStore';

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate static leaderboard data
  useEffect(() => {
    setIsLoading(true);
    
    // Get current leaderboard
    const currentEntries = getLeaderboard();
    
    // Only add sample entries if the leaderboard is empty
    if (currentEntries.length === 0) {
      // Sample players and games
      const samplePlayers = [
        { name: 'Player 1', id: 'player-1' },
        { name: 'Player 2', id: 'player-2' },
        { name: 'Player 3', id: 'player-3' }
      ];
      const games = ['Math Battle', 'Word Rush', 'Memory Contest', 'Trivia Showdown'];
      
      // Add sample entries for demonstration
      samplePlayers.forEach(player => {
        const numEntries = Math.floor(Math.random() * 2) + 2; // 2-3 entries
        
        for (let i = 0; i < numEntries; i++) {
          const gameIndex = Math.floor(Math.random() * games.length);
          const score = Math.floor(Math.random() * 900) + 100; // Score between 100-1000
          
          addLeaderboardEntry({
            playerName: player.name,
            playerId: player.id,
            gameName: games[gameIndex],
            score: score,
            date: new Date().toISOString()
          });
        }
      });
    }
    
    // Get the updated leaderboard
    setEntries(getLeaderboard());
    setIsLoading(false);
  }, []);
  
  // Group entries by player for the rankings
  const playerRankings = entries.reduce((acc, entry) => {
    if (!acc[entry.playerName]) {
      acc[entry.playerName] = {
        name: entry.playerName,
        totalScore: 0,
        gamesPlayed: 0,
        topScore: 0,
        playerId: entry.playerId
      };
    }
    
    acc[entry.playerName].totalScore += entry.score;
    acc[entry.playerName].gamesPlayed += 1;
    acc[entry.playerName].topScore = Math.max(acc[entry.playerName].topScore, entry.score);
    
    return acc;
  }, {} as Record<string, {
    name: string;
    totalScore: number;
    gamesPlayed: number;
    topScore: number;
    playerId: string;
  }>);
  
  // Convert to array and sort by total score
  const sortedRankings = Object.values(playerRankings).sort((a, b) => b.totalScore - a.totalScore);
  
  // Sort entries by score (descending)
  const sortedEntries = [...entries].sort((a, b) => b.score - a.score);
  
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-center mb-8">
            <FaTrophy className="text-4xl text-yellow-500 mr-4" />
            <h1 className="text-3xl font-bold">Classroom Leaderboard</h1>
          </div>
          
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading leaderboard...</p>
            </div>
          ) : (
            <>
              {/* Player rankings section */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
                  <h2 className="text-xl font-bold flex items-center">
                    <FaMedal className="mr-2" />
                    Player Rankings
                  </h2>
                </div>
                
                <div className="p-6">
                  {sortedRankings.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-3">No rankings available yet!</p>
                      <p className="text-gray-600 text-sm">
                        Play some games to see your name on the leaderboard.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Player</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Top Score</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Games Played</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {sortedRankings.map((player, index) => (
                            <tr key={player.playerId} className={index < 3 ? 'bg-yellow-50' : ''}>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {index === 0 ? (
                                    <span className="w-8 h-8 flex items-center justify-center bg-yellow-100 text-yellow-800 rounded-full">
                                      <FaTrophy className="text-yellow-600" />
                                    </span>
                                  ) : (
                                    <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full font-medium">
                                      {index + 1}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">
                                  {player.name}
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-gray-900 font-medium">
                                {player.totalScore.toLocaleString()}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-gray-900">
                                {player.topScore.toLocaleString()}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                                {player.gamesPlayed}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Recent high scores section */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
                  <h2 className="text-xl font-bold flex items-center">
                    <FaAward className="mr-2" />
                    Recent High Scores
                  </h2>
                </div>
                
                <div className="p-6">
                  {sortedEntries.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-3">No scores recorded yet!</p>
                      <p className="text-gray-600 text-sm">
                        Play some games to record your high scores.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Player</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Game</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Score</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {sortedEntries.slice(0, 10).map((entry, index) => (
                            <tr key={`${entry.playerId}-${entry.gameName}-${index}`} className={index === 0 ? 'bg-green-50' : ''}>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">
                                  {entry.playerName}
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-gray-900">
                                {entry.gameName}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span className="font-medium text-gray-900">
                                  {entry.score.toLocaleString()}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                                {new Date(entry.date).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
} 