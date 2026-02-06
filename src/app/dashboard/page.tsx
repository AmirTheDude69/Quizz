'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Zap, 
  Users, 
  Sparkles, 
  ArrowRight,
  Play,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { useCategories, useFeaturedTopics, useRecentTopics } from '@/hooks';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Avatar, Badge, XPBadge, LevelBadge, Button } from '@/components/ui';
import { cn, formatRelativeTime } from '@/lib/utils';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { topics: featuredTopics, isLoading: featuredLoading } = useFeaturedTopics();
  const { topics: recentTopics, isLoading: recentLoading } = useRecentTopics();

  const stats = [
    { label: 'Total XP', value: user?.topicStats ? Object.values(user.topicStats).reduce((acc, s) => acc + s.xp, 0) : 0, icon: Trophy, color: 'text-yellow-400' },
    { label: 'Level', value: user?.topicStats ? Math.max(...Object.values(user.topicStats).map(s => s.level)) : 1, icon: Zap, color: 'text-primary-400' },
    { label: 'Wins', value: 0, icon: Users, color: 'text-green-400' },
    { label: 'Streak', value: 0, icon: Sparkles, color: 'text-orange-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 lg:p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">
                Welcome back, <span className="gradient-text">{user?.displayName || 'Player'}!</span>
              </h1>
              <p className="text-gray-400 mt-2">Ready to challenge your knowledge?</p>
            </div>
            <Link href="/play">
              <Button size="lg" className="w-full lg:w-auto">
                <Play size={20} className="mr-2" />
                Play Now
              </Button>
            </Link>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="stat-card"
              >
                <stat.icon className={cn('w-6 h-6 mx-auto mb-2', stat.color)} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Play */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card hover glow>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Quick Play</h2>
                <p className="text-gray-400">Jump into a random match</p>
              </div>
            </div>
            <Link href="/play/quick">
              <Button>
                Start <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Featured Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Featured Topics</CardTitle>
                  <CardDescription>Popular quizzes trending now</CardDescription>
                </div>
                <Link href="/play">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {featuredLoading ? (
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-background-800 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {featuredTopics.slice(0, 4).map((topic, index) => (
                    <Link key={topic.id} href={`/play/${topic.slug}`}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative h-32 rounded-xl overflow-hidden cursor-pointer"
                      >
                        <div 
                          className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20"
                          style={{ backgroundColor: `${topic.iconColor}20` }}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                          <span className="text-4xl mb-2">{topic.icon}</span>
                          <h3 className="font-semibold text-white text-center">{topic.name}</h3>
                          <p className="text-sm text-gray-400 mt-1">{topic.questionCount} questions</p>
                        </div>
                        {topic.featured && (
                          <Badge variant="warning" className="absolute top-2 right-2">
                            <TrendingUp size={12} className="mr-1" />
                            Trending
                          </Badge>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/10 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Topics</CardTitle>
              <CardDescription>Your recently played quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              {recentLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-background-800 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : recentTopics.length > 0 ? (
                <div className="space-y-3">
                  {recentTopics.slice(0, 5).map((topic) => (
                    <Link key={topic.id} href={`/play/${topic.slug}`}>
                      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-background-800 transition-colors cursor-pointer">
                        <span className="text-2xl">{topic.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">{topic.name}</p>
                          <p className="text-sm text-gray-400">{topic.questionCount} questions</p>
                        </div>
                        <Play size={16} className="text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock size={40} className="mx-auto text-gray-600 mb-3" />
                  <p className="text-gray-400">No recent topics yet</p>
                  <Link href="/play">
                    <Button variant="ghost" size="sm" className="mt-2">
                      Start Playing
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Browse Categories</CardTitle>
                <CardDescription>Explore topics by category</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {categoriesLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-24 bg-background-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/play?category=${category.id}`}>
                      <div className="group relative h-24 rounded-xl overflow-hidden cursor-pointer">
                        <div 
                          className="absolute inset-0"
                          style={{ backgroundColor: `${category.icon}20` }}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl mb-1">{category.icon}</span>
                          <h3 className="font-medium text-white text-center px-2">{category.name}</h3>
                          <p className="text-xs text-gray-400 mt-1">{category.topicCount} topics</p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card hover>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Challenge Friends</h2>
                <p className="text-gray-400">Create a challenge and share it</p>
              </div>
            </div>
            <Link href="/challenges/new">
              <Button variant="secondary">
                Create Challenge
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
