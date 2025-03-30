'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaPlus, FaRandom, FaTimes, FaUserFriends, FaArrowDown } from 'react-icons/fa';

type Team = {
  id: number;
  name: string;
  members: string[];
  color: string;
};

type DraggedItemInfo = {
  memberId: number;
  teamId: number;
  memberName: string;
};

const teamColors = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b'];
const MAX_PARTICIPANTS = 20;
const MAX_TEAM_MEMBERS = 5;

export default function TeamManager() {
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [maxTeams, setMaxTeams] = useState(2);
  const [activeTab, setActiveTab] = useState<'generator' | 'teams'>('generator');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<DraggedItemInfo | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const addParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (participants.length >= MAX_PARTICIPANTS) {
      setErrorMessage(`Maximum of ${MAX_PARTICIPANTS} participants reached`);
      return;
    }
    
    if (newParticipant.trim()) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant('');
    }
  };

  const removeParticipant = (index: number) => {
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
    setErrorMessage(null);
  };

  const generateTeams = () => {
    if (participants.length === 0) return;
    
    // Shuffle participants
    const shuffled = [...participants].sort(() => 0.5 - Math.random());
    
    // Use the selected number of teams directly
    const numTeams = maxTeams;
    const teamsArray: Team[] = [];
    
    // Create empty teams
    for (let i = 0; i < numTeams; i++) {
      teamsArray.push({
        id: i + 1,
        name: `Team ${i + 1}`,
        members: [],
        color: teamColors[i % teamColors.length]
      });
    }
    
    // Distribute participants evenly across teams
    // Ensure no team has more than MAX_TEAM_MEMBERS members
    shuffled.forEach((participant, index) => {
      let placed = false;
      
      // Try to find a team with fewer than MAX_TEAM_MEMBERS members
      for (let i = 0; i < numTeams; i++) {
        const teamIndex = (index + i) % numTeams;
        if (teamsArray[teamIndex].members.length < MAX_TEAM_MEMBERS) {
          teamsArray[teamIndex].members.push(participant);
          placed = true;
          break;
        }
      }
      
      // If all teams are at max capacity, add to the team with the least members
      if (!placed) {
        const teamWithFewestMembers = teamsArray.reduce((prev, curr) => 
          prev.members.length <= curr.members.length ? prev : curr
        );
        teamWithFewestMembers.members.push(participant);
      }
    });
    
    setTeams(teamsArray);
    // Switch to teams tab after generating
    setActiveTab('teams');
  };

  const resetTeams = () => {
    setTeams([]);
    setActiveTab('generator');
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, memberId: number, teamId: number, memberName: string) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem({ memberId, teamId, memberName });
    setIsDragging(true);
    
    // Add styling to the dragged element
    e.currentTarget.classList.add('opacity-50');
    
    // This helps with Firefox
    e.dataTransfer.setData('text/plain', memberName);
  };
  
  const handleDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    e.currentTarget.classList.remove('opacity-50');
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement | HTMLDivElement>) => {
    e.preventDefault(); // Allow drop
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-indigo-50', 'border-indigo-200');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-indigo-50', 'border-indigo-200');
  };

  // Handle drop on a placeholder (empty slot)
  const handleDropOnPlaceholder = (e: React.DragEvent<HTMLLIElement>, targetTeamId: number) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event from bubbling up to team container
    
    if (!draggedItem) return;
    
    // Clone the teams array
    const updatedTeams = JSON.parse(JSON.stringify(teams));
    
    // Find source and target teams
    const sourceTeam = updatedTeams.find((team: Team) => team.id === draggedItem.teamId);
    const targetTeam = updatedTeams.find((team: Team) => team.id === targetTeamId);
    
    if (!sourceTeam || !targetTeam) {
      setDraggedItem(null);
      return;
    }
    
    // Get the member to move
    const sourceMember = sourceTeam.members[draggedItem.memberId];
    
    // Remove from source team
    sourceTeam.members.splice(draggedItem.memberId, 1);
    
    // Add to target team
    targetTeam.members.push(sourceMember);
    
    // Update teams state
    setTeams(updatedTeams);
    setDraggedItem(null);
  };

  // Handle drop on a specific team member
  const handleDropOnMember = (e: React.DragEvent<HTMLLIElement>, targetMemberId: number, targetTeamId: number) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event from bubbling up to team container
    
    // Remove highlighting
    e.currentTarget.classList.remove('bg-indigo-50', 'border-indigo-200');
    
    if (!draggedItem) return;
    
    // Clone the teams array
    const updatedTeams = JSON.parse(JSON.stringify(teams));
    
    // Find source and target teams
    const sourceTeam = updatedTeams.find((team: Team) => team.id === draggedItem.teamId);
    const targetTeam = updatedTeams.find((team: Team) => team.id === targetTeamId);
    
    if (!sourceTeam || !targetTeam) {
      setDraggedItem(null);
      return;
    }
    
    // Save the members being swapped
    const sourceMember = sourceTeam.members[draggedItem.memberId];
    const targetMember = targetTeam.members[targetMemberId];
    
    if (draggedItem.teamId === targetTeamId && draggedItem.memberId === targetMemberId) {
      // Dropped on itself - do nothing
      setDraggedItem(null);
      return;
    }
    
    // Handle same team case (reordering)
    if (draggedItem.teamId === targetTeamId) {
      // Remove the dragged item
      sourceTeam.members.splice(draggedItem.memberId, 1);
      
      // Insert at new position
      if (draggedItem.memberId < targetMemberId) {
        // If moving forward, account for the removed item
        sourceTeam.members.splice(targetMemberId - 1, 0, sourceMember);
      } else {
        sourceTeam.members.splice(targetMemberId, 0, sourceMember);
      }
    } else {
      // Swap between different teams
      
      // Remove each member from their team
      sourceTeam.members.splice(draggedItem.memberId, 1);
      targetTeam.members.splice(targetMemberId, 1);
      
      // Add the swapped members
      sourceTeam.members.splice(draggedItem.memberId, 0, targetMember);
      targetTeam.members.splice(targetMemberId, 0, sourceMember);
    }
    
    // Update teams state
    setTeams(updatedTeams);
    setDraggedItem(null);
  };

  // Handle drop on a team container (when not dropping on a specific member)
  const handleDropOnTeam = (e: React.DragEvent<HTMLDivElement>, targetTeamId: number) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    if (draggedItem.teamId === targetTeamId) {
      // Dropped in same team, do nothing
      setDraggedItem(null);
      return;
    }
    
    // Clone the teams array
    const updatedTeams = JSON.parse(JSON.stringify(teams));
    
    // Find source and target teams
    const sourceTeam = updatedTeams.find((team: Team) => team.id === draggedItem.teamId);
    const targetTeam = updatedTeams.find((team: Team) => team.id === targetTeamId);
    
    if (!sourceTeam || !targetTeam) {
      setDraggedItem(null);
      return;
    }
    
    const sourceMember = sourceTeam.members[draggedItem.memberId];
    
    // Check if target team has reached maximum capacity
    if (targetTeam.members.length >= MAX_TEAM_MEMBERS) {
      // If target team is full, swap with the first member
      const targetMember = targetTeam.members[0];
      
      // Remove source member
      sourceTeam.members.splice(draggedItem.memberId, 1);
      
      // Remove target member
      targetTeam.members.shift(); // Remove first member
      
      // Add target member to source team
      sourceTeam.members.splice(draggedItem.memberId, 0, targetMember);
      
      // Add source member to target team
      targetTeam.members.push(sourceMember);
    } else {
      // If target team has space, just move the member
      
      // Remove from source team
      sourceTeam.members.splice(draggedItem.memberId, 1);
      
      // Add to target team
      targetTeam.members.push(sourceMember);
    }
    
    // Update teams state
    setTeams(updatedTeams);
    setDraggedItem(null);
  };

  return (
    <div className="space-y-4">
      {/* Tab navigation */}
      <div className="flex border-b">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('generator')}
          className={`px-4 py-2 font-medium text-sm flex items-center ${
            activeTab === 'generator' 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <FaUsers className="mr-2" /> Добави участници
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => teams.length > 0 && setActiveTab('teams')}
          className={`px-4 py-2 font-medium text-sm flex items-center ${
            activeTab === 'teams'
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : teams.length > 0
                ? 'text-gray-600 hover:text-gray-800'
                : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          <FaUserFriends className="mr-2" /> Създадени отбори
          {teams.length > 0 && <span className="ml-1 bg-indigo-100 text-indigo-800 text-xs px-1.5 py-0.5 rounded-full">{teams.length}</span>}
        </motion.button>
      </div>
      
      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'generator' ? (
          <motion.div
            key="generator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="space-y-4">
              {/* Participant input */}
              <form onSubmit={addParticipant} className="flex gap-2">
                <input
                  type="text"
                  value={newParticipant}
                  onChange={(e) => setNewParticipant(e.target.value)}
                  placeholder="Въведете име на участник"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Добави
                </motion.button>
              </form>
              
              {/* Error message */}
              {errorMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-700 px-3 py-2 rounded-md text-sm"
                >
                  {errorMessage}
                </motion.div>
              )}
              
              {/* Team size control */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Брой отбори
                </label>
                <div className="flex gap-2">
                  {[2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setMaxTeams(num)}
                      className={`py-1 px-6 rounded-full transition-colors ${
                        maxTeams === num 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Participants list */}
              {participants.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Участници ({participants.length}/{MAX_PARTICIPANTS})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {participants.map((participant, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                      >
                        <span className="text-sm">{participant}</span>
                        <button 
                          onClick={() => removeParticipant(index)}
                          className="ml-2 text-gray-500 hover:text-red-500"
                          aria-label="Remove participant"
                        >
                          <FaTimes size={10} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setParticipants([])}
                      className="bg-gray-100 text-gray-800 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Изчисти всички
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={generateTeams}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                      disabled={participants.length < 2}
                    >
                      Създай отбори
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="teams"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                Създадени отбори
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Преместете участниците за да разменят местата си (макс. 5 на отбор)</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetTeams}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Изчисти всички
                </motion.button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border rounded-lg overflow-hidden"
                  style={{ borderColor: team.color }}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnTeam(e, team.id)}
                >
                  <div className="px-4 py-2 font-medium text-white" style={{ backgroundColor: team.color }}>
                    {team.name} ({team.members.length}/{MAX_TEAM_MEMBERS})
                  </div>
                  <div className="p-4 bg-gray-50 min-h-[100px]">
                    <ul className="space-y-1">
                      {team.members.map((member, index) => (
                        <li 
                          key={index} 
                          className="text-sm bg-white px-3 py-1.5 rounded border border-gray-100 cursor-move hover:bg-gray-50 transition-colors"
                          draggable
                          onDragStart={(e) => handleDragStart(e, index, team.id, member)}
                          onDragEnd={handleDragEnd}
                          onDragOver={handleDragOver}
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDropOnMember(e, index, team.id)}
                        >
                          {member}
                        </li>
                      ))}
                      
                      {/* Empty placeholder shown during drag when team has space */}
                      {isDragging && 
                       draggedItem && 
                       draggedItem.teamId !== team.id && 
                       team.members.length < MAX_TEAM_MEMBERS && (
                        <li 
                          className="text-sm bg-indigo-50 border-2 border-dashed border-indigo-200 px-3 py-1.5 rounded text-indigo-400 flex items-center justify-center"
                          onDragOver={handleDragOver}
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDropOnPlaceholder(e, team.id)}
                        >
                          <FaArrowDown className="mr-2" size={12} />
                          Drop here
                        </li>
                      )}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 