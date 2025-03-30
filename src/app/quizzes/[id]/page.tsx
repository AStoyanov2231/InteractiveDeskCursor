'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaArrowRight, FaCheck, FaTimes, FaTrophy } from 'react-icons/fa';
import Header from '@/components/Header';
import { useClassroom } from '@/components/AuthContext';
import { getQuizById, addLeaderboardEntry, Quiz, Question } from '@/lib/dataStore';

export default function QuizPlayerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { currentPlayer, players, nextPlayer } = useClassroom();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  
  // Load quiz data
  useEffect(() => {
    const quizData = getQuizById(params.id);
    if (quizData) {
      setQuiz(quizData);
    } else {
      // Quiz not found, redirect back to quiz list
      router.push('/quizzes');
    }
    setLoading(false);
  }, [params.id, router]);
  
  // Current question being displayed
  const currentQuestion = quiz?.questions[currentQuestionIndex];
  
  // Handle answer selection for multiple choice
  const handleOptionSelect = (optionIndex: number) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(optionIndex);
    }
  };
  
  // Handle text input for text questions
  const handleTextInput = (text: string) => {
    setSelectedAnswer(text);
  };
  
  // Submit an answer and check if it's correct
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;
    
    let correct = false;
    
    // Check if the answer is correct
    if (currentQuestion.type === 'multiple-choice') {
      correct = selectedAnswer === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'text') {
      // For text questions, do a case-insensitive comparison
      const normalizedAnswer = (selectedAnswer as string).trim().toLowerCase();
      const normalizedCorrect = (currentQuestion.correctAnswer as string).trim().toLowerCase();
      correct = normalizedAnswer === normalizedCorrect;
    }
    
    // Update score
    if (correct) {
      setScore(score + 100);
    }
    
    setIsAnswerCorrect(correct);
    setIsAnswerSubmitted(true);
  };
  
  // Move to the next question or finish the quiz
  const handleNextQuestion = () => {
    if (!quiz) return;
    
    if (currentQuestionIndex < quiz.questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz is complete
      setQuizComplete(true);
      
      // Save score to leaderboard
      if (currentPlayer) {
        addLeaderboardEntry({
          playerName: currentPlayer.name,
          playerId: currentPlayer.id,
          gameName: quiz.title,
          score: score,
          date: new Date().toISOString()
        });
      }
    }
  };
  
  // Handle going back to quiz list
  const handleBackToQuizzes = () => {
    router.push('/quizzes');
  };
  
  // Switch to the next player
  const handleNextPlayer = () => {
    if (nextPlayer) {
      nextPlayer();
      
      // Reset the quiz for the next player
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setScore(0);
      setQuizComplete(false);
    }
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </>
    );
  }
  
  if (!quiz) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Quiz Not Found</h2>
          <p className="text-gray-600 mb-6">
            The quiz you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={handleBackToQuizzes}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Quizzes
          </button>
        </div>
      </>
    );
  }
  
  // Results screen when quiz is complete
  if (quizComplete) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden text-center p-8"
          >
            <div className="mb-6">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrophy className="text-4xl text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
              <p className="text-gray-600">Great job, {currentPlayer?.name || 'Player'}!</p>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-6 mb-8 inline-block">
              <div className="text-5xl font-bold text-indigo-600 mb-2">{score}</div>
              <div className="text-indigo-800">Final Score</div>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto mb-8">
              <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Total Questions:</span>
                <span className="font-bold">{quiz.questions.length}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Points per Question:</span>
                <span className="font-bold">100</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Score:</span>
                <span className="font-bold">{score} / {quiz.questions.length * 100}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              {players.length > 1 && (
                <button
                  onClick={handleNextPlayer}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Next Player's Turn
                </button>
              )}
              <button
                onClick={handleBackToQuizzes}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Back to Quizzes
              </button>
            </div>
          </motion.div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {currentQuestion && (
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={handleBackToQuizzes}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to Quizzes
              </button>
              
              <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                <span className="text-indigo-800 font-medium">Score: {score}</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
                <div className="flex justify-between items-center">
                  <h1 className="text-xl font-bold">{quiz.title}</h1>
                  <div className="bg-white/20 px-3 py-1 rounded-lg text-sm">
                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                  </div>
                </div>
                
                {currentPlayer && (
                  <div className="mt-3 text-white/90 text-sm">
                    Current Player: <span className="font-medium">{currentPlayer.name}</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="bg-indigo-50 p-5 rounded-lg mb-6">
                  <h2 className="text-lg font-medium text-indigo-900 mb-1">
                    {currentQuestion.text}
                  </h2>
                </div>
                
                {currentQuestion.type === 'multiple-choice' && (
                  <div className="space-y-3 mb-6">
                    {(currentQuestion.options as string[]).map((option, index) => (
                      <div
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        className={`
                          p-4 rounded-lg cursor-pointer transition-colors flex justify-between items-center
                          ${
                            selectedAnswer === index
                              ? isAnswerSubmitted
                                ? isAnswerCorrect
                                  ? 'bg-green-100 border border-green-200'
                                  : 'bg-red-100 border border-red-200'
                                : 'bg-indigo-100 border border-indigo-200'
                              : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                          }
                          ${isAnswerSubmitted && index === currentQuestion.correctAnswer ? 'bg-green-100 border border-green-200' : ''}
                        `}
                      >
                        <span>{option}</span>
                        {isAnswerSubmitted && (
                          <span>
                            {index === currentQuestion.correctAnswer ? (
                              <FaCheck className="text-green-600" />
                            ) : (
                              selectedAnswer === index && <FaTimes className="text-red-600" />
                            )}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {currentQuestion.type === 'text' && (
                  <div className="mb-6">
                    <input
                      type="text"
                      value={selectedAnswer as string || ''}
                      onChange={(e) => handleTextInput(e.target.value)}
                      disabled={isAnswerSubmitted}
                      placeholder="Type your answer here..."
                      className={`
                        w-full p-4 border rounded-lg focus:outline-none focus:ring-2 
                        ${
                          isAnswerSubmitted
                            ? isAnswerCorrect
                              ? 'bg-green-50 border-green-300 focus:ring-green-500'
                              : 'bg-red-50 border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-indigo-500'
                        }
                      `}
                    />
                    
                    {isAnswerSubmitted && (
                      <div className="mt-3 text-sm">
                        <span className="font-medium">Correct answer:</span>{' '}
                        <span className="text-green-700">{currentQuestion.correctAnswer}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between">
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null}
                      className={`
                        bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors
                        ${selectedAnswer === null ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center"
                    >
                      {currentQuestionIndex < quiz.questions.length - 1 ? (
                        <>
                          Next Question
                          <FaArrowRight className="ml-2" />
                        </>
                      ) : (
                        'Finish Quiz'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="flex justify-between">
                <div>
                  <span className="text-sm text-indigo-800">
                    Progress: {((currentQuestionIndex + 1) / quiz.questions.length * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="text-sm text-indigo-800">
                  {currentQuestionIndex + 1} / {quiz.questions.length}
                </div>
              </div>
              <div className="mt-2 bg-indigo-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full"
                  style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
} 