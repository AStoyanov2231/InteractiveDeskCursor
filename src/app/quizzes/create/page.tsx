'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTimes, FaArrowLeft, FaSave } from 'react-icons/fa';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { useClassroom } from '@/components/AuthContext';
import { Question, saveQuiz } from '@/lib/dataStore';

export default function CreateQuizPage() {
  const router = useRouter();
  const { currentPlayer } = useClassroom();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      type: 'multiple-choice',
    }
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(),
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        type: 'multiple-choice',
      }
    ]);
  };
  
  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };
  
  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        return { ...q, [field]: value };
      }
      return q;
    }));
  };
  
  const updateQuestionOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const updatedOptions = [...q.options as string[]];
        updatedOptions[optionIndex] = value;
        return { ...q, options: updatedOptions };
      }
      return q;
    }));
  };
  
  const handleSave = async () => {
    setError('');
    
    // Basic validation
    if (!title.trim()) {
      setError('Please enter a quiz title');
      return;
    }
    
    if (questions.some(q => !q.text.trim())) {
      setError('All questions must have text');
      return;
    }
    
    if (questions.some(q => 
      q.type === 'multiple-choice' && 
      (q.options as string[]).some(opt => !opt.trim())
    )) {
      setError('All multiple choice options must be filled');
      return;
    }
    
    setSaving(true);
    
    try {
      // Save the quiz using our local data store
      saveQuiz({
        id: Date.now().toString(),
        title,
        description,
        questions,
        createdBy: currentPlayer?.name || 'Anonymous',
      });
      
      // Navigate back to the quizzes list
      router.push('/quizzes');
    } catch (err) {
      console.error('Error saving quiz:', err);
      setError('Failed to save quiz. Please try again.');
      setSaving(false);
    }
  };
  
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Quizzes
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FaSave className="mr-2" />
              {saving ? 'Saving...' : 'Save Quiz'}
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold mb-6">Create New Quiz</h1>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Quiz Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter quiz title"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter quiz description"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white flex justify-between items-center">
                  <h3 className="font-medium">Question {index + 1}</h3>
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(question.id)}
                      className="text-white bg-white/20 hover:bg-white/30 p-1 rounded-full transition-colors"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <label htmlFor={`question-${question.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Question Text *
                    </label>
                    <input
                      type="text"
                      id={`question-${question.id}`}
                      value={question.text}
                      onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter question"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Type
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          checked={question.type === 'multiple-choice'}
                          onChange={() => updateQuestion(question.id, 'type', 'multiple-choice')}
                          className="form-radio h-4 w-4 text-indigo-600"
                        />
                        <span className="ml-2 text-gray-700">Multiple Choice</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          checked={question.type === 'text'}
                          onChange={() => updateQuestion(question.id, 'type', 'text')}
                          className="form-radio h-4 w-4 text-indigo-600"
                        />
                        <span className="ml-2 text-gray-700">Text Answer</span>
                      </label>
                    </div>
                  </div>
                  
                  {question.type === 'multiple-choice' && (
                    <div className="space-y-3 mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Answer Options *
                      </label>
                      
                      {(question.options as string[]).map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center">
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
                            onChange={(e) => updateQuestionOption(question.id, optIndex, e.target.value)}
                            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder={`Option ${optIndex + 1}`}
                          />
                        </div>
                      ))}
                      
                      <div className="text-xs text-gray-500 italic">
                        Select the radio button next to the correct answer
                      </div>
                    </div>
                  )}
                  
                  {question.type === 'text' && (
                    <div className="mb-4">
                      <label htmlFor={`answer-${question.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Correct Answer *
                      </label>
                      <input
                        type="text"
                        id={`answer-${question.id}`}
                        value={question.correctAnswer as string}
                        onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter correct answer"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            <button
              onClick={addQuestion}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-indigo-600 hover:border-indigo-300 flex items-center justify-center transition-colors"
            >
              <FaPlus className="mr-2" />
              Add Question
            </button>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition-colors ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FaSave className="mr-2" />
              {saving ? 'Saving...' : 'Save Quiz'}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
} 