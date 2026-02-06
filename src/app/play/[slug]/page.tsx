'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Clock, Users, Trophy, ArrowLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useTopic } from '@/hooks';
import { Card, CardContent, Button, Badge, Loading, Avatar } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export default function TopicQuizPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const { topic, isLoading } = useTopic(slug);
  
  const [gameState, setGameState] = useState<'lobby' | 'countdown' | 'playing' | 'results'>('lobby');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; answer: number; correct: boolean; timeUsed: number }[]>([]);
  const [opponentScore, setOpponentScore] = useState(0);

  // Demo questions
  useEffect(() => {
    if (topic) {
      setQuestions([
        {
          id: '1',
          text: `What is the capital of ${topic.name}?`,
          options: ['City A', 'City B', 'City C', 'City D'],
          correctIndex: 0,
        },
        {
          id: '2',
          text: `Which famous person is associated with ${topic.name}?`,
          options: ['Person A', 'Person B', 'Person C', 'Person D'],
          correctIndex: 1,
        },
        {
          id: '3',
          text: `When was ${topic.name} established?`,
          options: ['1900', '1910', '1920', '1930'],
          correctIndex: 2,
        },
      ]);
    }
  }, [topic]);

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      handleNextQuestion(false);
    }
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('countdown');
    let count = 3;
    const countdown = setInterval(() => {
      count--;
      if (count < 0) {
        clearInterval(countdown);
        setGameState('playing');
        setTimeLeft(15);
      }
    }, 1000);
  };

  const handleAnswer = useCallback((answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const currentQuestion = questions[currentIndex];
    const isCorrect = answerIndex === currentQuestion.correctIndex;
    const timeUsed = 15 - timeLeft;
    
    setAnswers((prev) => [...prev, {
      questionId: currentQuestion.id,
      answer: answerIndex,
      correct: isCorrect,
      timeUsed,
    }]);

    if (isCorrect) {
      const points = Math.round(1000 * (1 - timeUsed / 15) * (1 + streak * 0.1));
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    // Simulate opponent
    setOpponentScore((prev) => prev + (Math.random() > 0.5 ? 500 : 300));

    // Delay before next question
    setTimeout(() => {
      handleNextQuestion(isCorrect);
    }, 1500);
  }, [currentIndex, questions, timeLeft, streak]);

  const handleNextQuestion = (wasCorrect: boolean) => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(15);
    } else {
      setGameState('results');
    }
  };

  const viewResults = () => {
    router.push(`/play/${slug}/results?score=${score}&correct=${answers.filter(a => a.correct).length}&total=${questions.length}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading size="lg" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Topic not found</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Lobby */}
      {gameState === 'lobby' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card glow>
            <CardContent className="p-6 lg:p-8">
              <div className="text-center">
                <div 
                  className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${topic.iconColor}20` }}
                >
                  <span className="text-5xl">{topic.icon}</span>
                </div>
                <h1 className="text-2xl font-bold text-white">{topic.name}</h1>
                <p className="text-gray-400 mt-2">{topic.questionCount} questions</p>
                
                <div className="flex items-center justify-center gap-4 mt-6">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock size={18} />
                    <span>15s per question</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users size={18} />
                    <span>1v1 Match</span>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-background-800 rounded-xl">
                  <h3 className="font-medium text-white mb-2">How it works</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Answer as many questions as possible</li>
                    <li>• Faster answers = more points</li>
                    <li>• Build streaks for bonus points</li>
                    <li>• Highest score wins!</li>
                  </ul>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="secondary" onClick={() => router.back()}>
                    <ArrowLeft size={18} className="mr-2" />
                    Back
                  </Button>
                  <Button size="lg" onClick={startGame}>
                    <Sparkles size={20} className="mr-2" />
                    Start Match
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Countdown */}
      {gameState === 'countdown' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="text-9xl font-bold gradient-text">3</div>
        </motion.div>
      )}

      {/* Playing */}
      {gameState === 'playing' && currentQuestion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Progress */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Question {currentIndex + 1}/{questions.length}</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Trophy size={14} className="text-yellow-400" />
                <span className="text-white font-medium">{score.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} className="text-gray-400" />
                <span className="text-white">{opponentScore.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="h-2 bg-background-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Timer */}
          <div className="flex justify-center">
            <div className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold',
              'border-4',
              timeLeft > 10 ? 'border-green-500 text-green-400' :
              timeLeft > 5 ? 'border-yellow-500 text-yellow-400' :
              'border-red-500 text-red-400'
            )}>
              {timeLeft}
            </div>
          </div>

          {/* Question */}
          <Card glow>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white text-center mb-6">
                {currentQuestion.text}
              </h2>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQuestion.correctIndex;
                  const showResult = selectedAnswer !== null;
                  
                  let buttonClass = 'w-full p-4 rounded-xl text-left transition-all';
                  if (showResult) {
                    if (isCorrect) {
                      buttonClass += ' bg-green-500/20 border-2 border-green-500 text-green-400';
                    } else if (isSelected && !isCorrect) {
                      buttonClass += ' bg-red-500/20 border-2 border-red-500 text-red-400';
                    } else {
                      buttonClass += ' bg-background-800 text-gray-400';
                    }
                  } else {
                    buttonClass += ' bg-background-800 hover:bg-background-700 text-white border-2 border-transparent hover:border-primary-500/50';
                  }
                  
                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={buttonClass}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-background-900 flex items-center justify-center text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Results */}
      {gameState === 'results' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card glow className="bg-gradient-to-br from-primary-500/10 to-accent-500/10">
            <CardContent className="p-6 lg:p-8">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mb-4">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Match Complete!</h2>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-background-800/50 rounded-xl">
                    <p className="text-3xl font-bold text-white">{score.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">Score</p>
                  </div>
                  <div className="text-center p-4 bg-background-800/50 rounded-xl">
                    <p className="text-3xl font-bold text-green-400">{answers.filter(a => a.correct).length}</p>
                    <p className="text-sm text-gray-400">Correct</p>
                  </div>
                  <div className="text-center p-4 bg-background-800/50 rounded-xl">
                    <p className="text-3xl font-bold text-white">{streak}</p>
                    <p className="text-sm text-gray-400">Best Streak</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-background-800/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar size="sm" />
                      <span className="text-gray-400">You</span>
                    </div>
                    <span className="text-xl font-bold text-white">{score}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                      <Avatar size="sm" />
                      <span className="text-gray-400">Opponent</span>
                    </div>
                    <span className="text-xl font-bold text-white">{opponentScore}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="secondary" className="flex-1" onClick={() => router.push('/dashboard')}>
                    Home
                  </Button>
                  <Button className="flex-1" onClick={viewResults}>
                    View Details
                    <ChevronRight size={18} className="ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
