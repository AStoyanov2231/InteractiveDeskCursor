'use client';

import { useState, useEffect } from 'react';
import { useClassroom } from '@/components/AuthContext';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { saveQuiz, getAllQuizzes, deleteQuiz as deleteQuizFromStore, Quiz, Question } from '@/lib/dataStore';
import { FaPlus, FaTrash, FaEdit, FaSave, FaShareAlt, FaList } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function QuizBuilderPage() {
  const router = useRouter();
  const { currentPlayer } = useClassroom();
  const [myQuizzes, setMyQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [view, setView] = useState<'list' | 'editor' | 'preview'>('list');
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Load quizzes on component mount
  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = () => {
    setIsLoading(true);
    const quizzes = getAllQuizzes();
    setMyQuizzes(quizzes);
    setIsLoading(false);
  };

  const createNewQuiz = () => {
    setCurrentQuiz({
      id: Date.now().toString(),
      title: 'New Quiz',
      description: 'Quiz description',
      questions: [createNewQuestion()],
      createdBy: currentPlayer?.name || 'Anonymous',
      createdAt: new Date().toISOString()
    });
    setEditingQuizId(null);
    setView('editor');
  };

  const createNewQuestion = (): Question => {
    return {
      id: Date.now().toString(),
      text: 'Question text',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 0,
      type: 'multiple-choice'
    };
  };

  const editQuiz = (quiz: Quiz) => {
    setCurrentQuiz({ ...quiz });
    setEditingQuizId(quiz.id);
    setView('editor');
  };

  const deleteQuizItem = (quizId: string) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    
    const success = deleteQuizFromStore(quizId);
    
    if (success) {
      setMyQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
      if (currentQuiz?.id === quizId) {
        setCurrentQuiz(null);
        setView('list');
      }
    } else {
      console.error('Error deleting quiz');
    }
  };

  const saveCurrentQuiz = () => {
    if (!currentQuiz) return;
    
    setSaveStatus('saving');
    
    try {
      // Prepare quiz data
      const quizData: Quiz = {
        ...currentQuiz,
        id: editingQuizId || Date.now().toString(),
        createdBy: currentPlayer?.name || 'Anonymous',
        createdAt: currentQuiz.createdAt || new Date().toISOString()
      };
      
      // Save to data store
      const savedQuiz = saveQuiz(quizData);
      
      if (savedQuiz) {
        setEditingQuizId(savedQuiz.id);
        setCurrentQuiz(savedQuiz);
        loadQuizzes();
        setSaveStatus('success');
      } else {
        setSaveStatus('error');
      }
      
      // Reset status after a delay
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error saving quiz:', error);
      setSaveStatus('error');
    }
  };

  const addQuestion = () => {
    if (!currentQuiz) return;
    
    setCurrentQuiz({
      ...currentQuiz,
      questions: [...currentQuiz.questions, createNewQuestion()]
    });
  };

  const removeQuestion = (questionId: string) => {
    if (!currentQuiz) return;
    
    setCurrentQuiz({
      ...currentQuiz,
      questions: currentQuiz.questions.filter(q => q.id !== questionId)
    });
  };

  const updateQuestion = (questionId: string, field: keyof Question, value: any) => {
    if (!currentQuiz) return;
    
    setCurrentQuiz({
      ...currentQuiz,
      questions: currentQuiz.questions.map(q => {
        if (q.id === questionId) {
          return { ...q, [field]: value };
        }
        return q;
      })
    });
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    if (!currentQuiz) return;
    
    setCurrentQuiz({
      ...currentQuiz,
      questions: currentQuiz.questions.map(q => {
        if (q.id === questionId) {
          const newOptions = [...(q.options as string[])];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    });
  };

  const addOption = (questionId: string) => {
    if (!currentQuiz) return;
    
    setCurrentQuiz({
      ...currentQuiz,
      questions: currentQuiz.questions.map(q => {
        if (q.id === questionId) {
          return { 
            ...q, 
            options: [...(q.options as string[]), `Option ${(q.options as string[]).length + 1}`] 
          };
        }
        return q;
      })
    });
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    if (!currentQuiz) return;
    
    setCurrentQuiz({
      ...currentQuiz,
      questions: currentQuiz.questions.map(q => {
        if (q.id === questionId) {
          const newOptions = [...(q.options as string[])];
          newOptions.splice(optionIndex, 1);
          
          // Adjust correctAnswer if it's affected
          let correctAnswer = q.correctAnswer;
          if (optionIndex === correctAnswer) {
            correctAnswer = 0; // Reset to first option
          } else if (typeof correctAnswer === 'number' && optionIndex < correctAnswer) {
            correctAnswer = correctAnswer - 1; // Adjust index
          }
          
          return { 
            ...q, 
            options: newOptions,
            correctAnswer 
          };
        }
        return q;
      })
    });
  };

  if (!currentPlayer) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Please Add Players First</h2>
              <p className="text-gray-600 mb-6">
                You need to add at least one player to create and manage quizzes.
              </p>
              <button
                onClick={() => router.push('/')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header with title and actions */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <FaEdit className="text-4xl text-indigo-600 mr-4" />
              <h1 className="text-3xl font-bold">Quiz Builder</h1>
            </div>
            
            {view === 'list' && (
              <button
                onClick={createNewQuiz}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <FaPlus className="mr-2" />
                Create New Quiz
              </button>
            )}
            
            {view !== 'list' && (
              <button
                onClick={() => setView('list')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <FaList className="mr-2" />
                Back to List
              </button>
            )}
          </div>
          
          {/* Quiz list view */}
          {view === 'list' && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold">My Quizzes</h2>
              </div>
              
              <div className="p-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                  </div>
                ) : myQuizzes.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-6">You haven't created any quizzes yet.</p>
                    <button
                      onClick={createNewQuiz}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center mx-auto transition-colors"
                    >
                      <FaPlus className="mr-2" />
                      Create Your First Quiz
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myQuizzes.map(quiz => (
                      <div key={quiz.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-indigo-50 p-4">
                          <h3 className="font-bold text-lg text-indigo-900 truncate">{quiz.title}</h3>
                          <p className="text-sm text-indigo-700 mt-1">
                            {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        
                        <div className="p-4">
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {quiz.description || 'No description provided.'}
                          </p>
                          
                          <div className="flex justify-between">
                            <button
                              onClick={() => deleteQuizItem(quiz.id)}
                              className="text-red-600 hover:text-red-800 transition-colors flex items-center text-sm"
                            >
                              <FaTrash className="mr-1" />
                              Delete
                            </button>
                            <button
                              onClick={() => editQuiz(quiz)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded flex items-center text-sm transition-colors"
                            >
                              <FaEdit className="mr-1" />
                              Edit
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 flex justify-between">
                          <span>Created: {new Date(quiz.createdAt).toLocaleDateString()}</span>
                          <span>By: {quiz.createdBy}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Quiz editor view */}
          {view === 'editor' && currentQuiz && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-indigo-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">
                    {editingQuizId ? 'Edit Quiz' : 'Create New Quiz'}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={saveCurrentQuiz}
                      disabled={saveStatus === 'saving'}
                      className={`
                        flex items-center px-3 py-1.5 rounded transition-colors
                        ${saveStatus === 'saving' ? 'bg-indigo-400 cursor-not-allowed' : 'bg-white text-indigo-700 hover:bg-indigo-100'}
                      `}
                    >
                      <FaSave className="mr-1" />
                      {saveStatus === 'saving' ? 'Saving...' : 'Save Quiz'}
                    </button>
                  </div>
                </div>
                
                {saveStatus === 'success' && (
                  <div className="mt-2 bg-green-500/20 text-white px-3 py-1 rounded text-sm">
                    Quiz saved successfully!
                  </div>
                )}
                
                {saveStatus === 'error' && (
                  <div className="mt-2 bg-red-500/20 text-white px-3 py-1 rounded text-sm">
                    Error saving quiz. Please try again.
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="space-y-6 mb-8">
                  {/* Quiz title and description */}
                  <div>
                    <label htmlFor="quiz-title" className="block text-sm font-medium text-gray-700 mb-1">
                      Quiz Title
                    </label>
                    <input
                      id="quiz-title"
                      type="text"
                      value={currentQuiz.title}
                      onChange={(e) => setCurrentQuiz({ ...currentQuiz, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter quiz title"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="quiz-description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="quiz-description"
                      value={currentQuiz.description || ''}
                      onChange={(e) => setCurrentQuiz({ ...currentQuiz, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter quiz description"
                    />
                  </div>
                </div>
                
                {/* Questions */}
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <span className="mr-2">Questions</span>
                  <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                    {currentQuiz.questions.length}
                  </span>
                </h3>
                
                <div className="space-y-6 mb-6">
                  {currentQuiz.questions.map((question, index) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        
                        {currentQuiz.questions.length > 1 && (
                          <button
                            onClick={() => removeQuestion(question.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor={`question-${question.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Question Text
                        </label>
                        <input
                          id={`question-${question.id}`}
                          type="text"
                          value={question.text}
                          onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter question text"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Options
                        </label>
                        
                        {(question.options as string[]).map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center mb-2">
                            <div className="flex-shrink-0 mr-2">
                              <input
                                type="radio"
                                checked={question.correctAnswer === optIndex}
                                onChange={() => updateQuestion(question.id, 'correctAnswer', optIndex)}
                                className="form-radio h-4 w-4 text-indigo-600"
                              />
                            </div>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder={`Option ${optIndex + 1}`}
                            />
                            
                            {(question.options as string[]).length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(question.id, optIndex)}
                                className="ml-2 text-red-600 hover:text-red-800 transition-colors"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          onClick={() => addOption(question.id)}
                          className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm flex items-center transition-colors"
                        >
                          <FaPlus className="mr-1" />
                          Add Option
                        </button>
                      </div>
                      
                      <div className="text-xs text-gray-500 italic">
                        Select the radio button next to the correct answer
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={addQuestion}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-indigo-600 hover:border-indigo-300 flex items-center justify-center transition-colors"
                >
                  <FaPlus className="mr-2" />
                  Add Question
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 flex justify-end">
                <div className="flex space-x-3">
                  <button
                    onClick={() => setView('list')}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveCurrentQuiz}
                    disabled={saveStatus === 'saving'}
                    className={`
                      bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center transition-colors
                      ${saveStatus === 'saving' ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <FaSave className="mr-2" />
                    {saveStatus === 'saving' ? 'Saving...' : 'Save Quiz'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
} 