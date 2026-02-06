'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Zap, Sparkles, Users, ArrowRight } from 'lucide-react';
import { useFeaturedTopics, useTopics } from '@/hooks';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button, Loading } from '@/components/ui';

export default function QuickPlayPage() {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const { topics: featuredTopics, isLoading: featuredLoading } = useFeaturedTopics();
  const { topics: allTopics } = useTopics();

  const startQuickMatch = () => {
    setIsSearching(true);
    // In a real app, this would call the API to find a random match
    setTimeout(() => {
      // For demo, redirect to a random featured topic
      const randomTopic = allTopics[Math.floor(Math.random() * allTopics.length)];
      if (randomTopic) {
        router.push(`/play/${randomTopic.slug}`);
      } else {
        router.push('/play');
      }
    }, 2000);
  };

  const startPracticeMode = () => {
    router.push('/play?mode=practice');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4">
          <Zap className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Quick Play</h1>
        <p className="text-gray-400 mt-2">Jump into a random match instantly</p>
      </motion.div>

      {/* Quick Match Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card glow className="bg-gradient-to-br from-primary-500/10 to-accent-500/10 border-primary-500/30">
          <CardContent className="p-6 lg:p-8">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-xl font-bold text-white mb-2">Find a Random Opponent</h2>
              <p className="text-gray-400 mb-6 max-w-md">
                Get matched with a random player of similar skill level. Quick, fun, and competitive!
              </p>
              
              {isSearching ? (
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 rounded-full border-4 border-primary-500 border-t-transparent mb-4"
                  />
                  <p className="text-white font-medium">Finding opponent...</p>
                  <p className="text-gray-400 text-sm mt-2">This usually takes a few seconds</p>
                </div>
              ) : (
                <Button size="lg" onClick={startQuickMatch}>
                  <Zap size={20} className="mr-2" />
                  Start Quick Match
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              )}
              
              <div className="flex items-center gap-4 mt-6 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>~2 min avg</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles size={14} />
                  <span>Any topic</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Or choose */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <p className="text-gray-400">or choose a specific topic</p>
      </motion.div>

      {/* Featured Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-white mb-4">Popular Right Now</h2>
        {featuredLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-background-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTopics.slice(0, 4).map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="cursor-pointer" onClick={() => router.push(`/play/${topic.slug}`)}>
                  <div className="relative h-24 rounded-t-xl overflow-hidden">
                    <div 
                      className="absolute inset-0"
                      style={{ backgroundColor: `${topic.iconColor}20` }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl">{topic.icon}</span>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-white text-sm truncate">{topic.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{topic.questionCount} questions</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Browse All */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card hover>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-background-800 flex items-center justify-center">
                  <Sparkles size={20} className="text-primary-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Browse All Topics</h3>
                  <p className="text-sm text-gray-400">Explore hundreds of topics</p>
                </div>
              </div>
              <Button variant="ghost" onClick={() => router.push('/play')}>
                Browse
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
