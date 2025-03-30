'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPuzzlePiece, FaPlus, FaPlay, FaTrash } from 'react-icons/fa';
import Header from '@/components/Header';
import Link from 'next/link';
import { useClassroom } from '@/components/AuthContext';
import { getAllQuizzes, deleteQuiz, Quiz } from '@/lib/dataStore';

export default function QuizzesPage() {
  const { players, currentPlayer } = useClassroom();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load quizzes from our data store
    setQuizzes(getAllQuizzes());
    setIsLoading(false);
  }, []);

  const handleDeleteQuiz = (id: string) => {
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      deleteQuiz(id);
      setQuizzes(getAllQuizzes());
    }
  };

  // Group quizzes by date (today, this week, earlier)
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekAgo = today - 7 * 24 * 60 * 60 * 1000;

  const todayQuizzes = quizzes.filter(quiz => new Date(quiz.createdAt).getTime() >= today);
  const weekQuizzes = quizzes.filter(quiz => {
    const date = new Date(quiz.createdAt).getTime();
    return date >= weekAgo && date < today;
  });
  const earlierQuizzes = quizzes.filter(quiz => new Date(quiz.createdAt).getTime() < weekAgo);

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <FaPuzzlePiece className="text-4xl text-purple-600 mr-4" />
              <h1 className="text-3xl font-bold">Classroom Quizzes</h1>
            </div>
            
            <Link
              href="/quizzes/create"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-5 py-2 rounded-lg flex items-center transition-colors"
            >
              <FaPlus className="mr-2" />
              Create Quiz
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading quizzes...</p>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-8 text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaPuzzlePiece className="text-2xl text-purple-600" />
                </div>
                <h2 className="text-xl font-bold mb-2">No Quizzes Yet</h2>
                <p className="text-gray-600 mb-6">
                  Create your first quiz for your classroom by clicking the button above.
                </p>
                <Link
                  href="/quizzes/create"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-2 rounded-lg inline-flex items-center transition-colors"
                >
                  <FaPlus className="mr-2" />
                  Create First Quiz
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {todayQuizzes.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                    <span className="inline-block w-1 h-6 bg-purple-500 rounded-md mr-3"></span>
                    Created Today
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {todayQuizzes.map(quiz => (
                      <QuizCard 
                        key={quiz.id} 
                        quiz={quiz} 
                        onDelete={handleDeleteQuiz} 
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {weekQuizzes.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                    <span className="inline-block w-1 h-6 bg-indigo-500 rounded-md mr-3"></span>
                    This Week
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {weekQuizzes.map(quiz => (
                      <QuizCard 
                        key={quiz.id} 
                        quiz={quiz} 
                        onDelete={handleDeleteQuiz} 
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {earlierQuizzes.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                    <span className="inline-block w-1 h-6 bg-gray-400 rounded-md mr-3"></span>
                    Earlier
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {earlierQuizzes.map(quiz => (
                      <QuizCard 
                        key={quiz.id} 
                        quiz={quiz} 
                        onDelete={handleDeleteQuiz} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}

function QuizCard({ quiz, onDelete }: { quiz: Quiz; onDelete: (id: string) => void }) {
  const questionCount = quiz.questions.length;
  const date = new Date(quiz.createdAt);
  
  const getRandomColor = () => {
    const colors = [
      'from-pink-500 to-red-500',
      'from-purple-500 to-indigo-500',
      'from-blue-500 to-cyan-500',
      'from-teal-500 to-green-500',
      'from-orange-500 to-amber-500',
    ];
    // Use the first character of the id as a deterministic way to choose a color
    const index = quiz.id.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col"
    >
      <div className={`bg-gradient-to-r ${getRandomColor()} p-6 text-white`}>
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{quiz.title}</h3>
        <div className="flex justify-between items-center">
          <span className="text-sm bg-white/20 px-2 py-1 rounded">
            {questionCount} question{questionCount !== 1 ? 's' : ''}
          </span>
          <span className="text-sm">{date.toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="p-6 flex-grow">
        <p className="text-gray-600 mb-6 line-clamp-3">
          {quiz.description || 'No description provided.'}
        </p>
        <div className="flex justify-between mt-auto">
          <button
            onClick={() => onDelete(quiz.id)}
            className="text-red-600 hover:text-red-800 transition-colors flex items-center"
          >
            <FaTrash className="mr-1" size={14} />
            <span>Delete</span>
          </button>
          
          <Link
            href={`/quizzes/${quiz.id}`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center transition-colors"
          >
            <FaPlay className="mr-2" size={14} />
            Start Quiz
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 