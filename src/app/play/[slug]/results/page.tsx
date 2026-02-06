'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Zap, Target, TrendingUp, Sparkles, Share2 } from 'lucide-react';
import { Card, CardContent, Button, Badge, Loading } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function ResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const score = parseInt(searchParams.get('score') || '0');
  const correct = parseInt(searchParams.get('correct') || '0');
  const total = parseInt(searchParams.get('total') || '0');
  
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const xpEarned = Math.round(score / 10);
  const rank = score > 5000 ? 'Diamond' : score > 3000 ? 'Platinum' : score > 1000 ? 'Gold' : 'Silver';

  const stats = [
    { label: 'Final Score', value: score.toLocaleString(), icon: Trophy, color: 'text-yellow-400' },
    { label: 'Accuracy', value: `${accuracy}%`, icon: Target, color: 'text-green-400' },
    { label: 'XP Earned', value: `+${xpEarned}`, icon: Star, color: 'text-primary-400' },
    { label: 'Correct', value: `${correct}/${total}`, icon: Zap, color: 'text-blue-400' },
  ];

  const shareResult = () => {
    const text = `🎮 I scored ${score.toLocaleString()} points in ${slug}!\n\n🏆 Rank: ${rank}\n✅ Accuracy: ${accuracy}%\n\nPlay now at quizz.app!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Quizz Results',
        text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Match Results</h1>
        <p className="text-gray-400 mt-1">{slug}</p>
      </motion.div>

      {/* Rank Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card glow className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 border-primary-500/30">
          <CardContent className="p-6 text-center">
            <Badge variant="warning" size="lg" className="mb-2">
              <Sparkles size={14} className="mr-1" />
              {rank}
            </Badge>
            <p className="text-gray-400 text-sm">Your Rank</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4 text-center">
                <stat.icon className={cn('w-6 h-6 mx-auto mb-2', stat.color)} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* XP Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-white mb-4">XP Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-green-400" />
                  <span className="text-gray-300">Correct Answers</span>
                </div>
                <span className="text-white font-medium">+{correct * 100}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-yellow-400" />
                  <span className="text-gray-300">Speed Bonus</span>
                </div>
                <span className="text-white font-medium">+250</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-blue-400" />
                  <span className="text-gray-300">Streak Bonus</span>
                </div>
                <span className="text-white font-medium">+150</span>
              </div>
              <div className="border-t border-background-700 pt-3 flex items-center justify-between">
                <span className="font-medium text-white">Total XP</span>
                <span className="text-xl font-bold text-primary-400">+{xpEarned}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Rating */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-white mb-3">Performance</h3>
            <div className="space-y-2">
              {[
                { label: 'Response Time', value: 'Fast', color: 'text-green-400' },
                { label: 'Accuracy', value: accuracy > 80 ? 'Excellent' : accuracy > 50 ? 'Good' : 'Needs Work', color: accuracy > 80 ? 'text-green-400' : accuracy > 50 ? 'text-yellow-400' : 'text-red-400' },
                { label: 'Streak', value: 'Great', color: 'text-blue-400' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-gray-400">{item.label}</span>
                  <span className={cn('font-medium', item.color)}>{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={shareResult}>
          <Share2 size={18} className="mr-2" />
          Share
        </Button>
        <Button className="flex-1" onClick={() => router.push('/play')}>
          Play Again
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button variant="ghost" className="w-full" onClick={() => router.push('/dashboard')}>
          <ArrowLeft size={18} className="mr-2" />
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  );
}
