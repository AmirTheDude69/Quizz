'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Trophy, Star, Zap, Target, Crown, Users, MessageSquare, Settings, Edit, Award } from 'lucide-react';
import { useGlobalStats, useProfile } from '@/hooks';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button, Loading, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Avatar, LevelBadge, XPBadge } from '@/components/ui';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { MatchSummary } from '@/types';

export default function ProfileMePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { stats, isLoading: statsLoading } = useGlobalStats();
  
  // Demo user data for display
  const displayUser = user || {
    id: 'me',
    username: 'QuizPlayer',
    displayName: 'Quiz Player',
    avatarUrl: null,
    bio: 'Quiz enthusiast! 🏆',
    createdAt: new Date(Date.now() - 2592000000).toISOString(),
    topicStats: { 'science': { level: 12, xp: 4500 }, 'history': { level: 8, xp: 2200 } },
  };

  const displayStats = stats || {
    totalXP: 6700,
    level: 15,
    totalWins: 45,
    totalLosses: 23,
    totalMatches: 68,
    winRate: 66,
    topTopics: [],
  };

  // Demo match history
  const matchHistory: MatchSummary[] = [
    {
      id: '1',
      topicId: 'science',
      topicName: 'Science',
      status: 'FINISHED',
      player1: { id: 'me', username: 'QuizPlayer', avatarUrl: null, score: 1250, correctCount: 8 },
      player2: { id: 'other', username: 'Brainiac', avatarUrl: null, score: 1100, correctCount: 7 },
      winnerId: 'me',
      playedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2',
      topicId: 'history',
      topicName: 'History',
      status: 'FINISHED',
      player1: { id: 'other', username: 'QuizMaster', avatarUrl: null, score: 1400, correctCount: 9 },
      player2: { id: 'me', username: 'QuizPlayer', avatarUrl: null, score: 1200, correctCount: 7 },
      winnerId: 'other',
      playedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '3',
      topicId: 'geography',
      topicName: 'Geography',
      status: 'FINISHED',
      player1: { id: 'me', username: 'QuizPlayer', avatarUrl: null, score: 1000, correctCount: 6 },
      player2: { id: 'other', username: 'SmartCookie', avatarUrl: null, score: 1000, correctCount: 6 },
      winnerId: null,
      playedAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  const achievements = [
    { id: '1', name: 'First Win', description: 'Won your first match', earned: true, icon: '🏆' },
    { id: '2', name: 'Hot Streak', description: 'Won 5 matches in a row', earned: true, icon: '🔥' },
    { id: '3', name: 'Quiz Master', description: 'Reached level 10', earned: true, icon: '👑' },
    { id: '4', name: 'Social Butterfly', description: 'Made 10 friends', earned: false, icon: '🦋' },
    { id: '5', name: 'Speed Demon', description: 'Answered in under 2 seconds', earned: true, icon: '⚡' },
  ];

  if (authLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card glow className="bg-gradient-to-br from-primary-500/10 to-accent-500/10">
          <CardContent className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar 
                  src={displayUser.avatarUrl} 
                  alt={displayUser.displayName || displayUser.username}
                  size="xl"
                />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center border-4 border-background-900">
                  <Crown size={14} className="text-white" />
                </div>
              </div>
              
              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">
                    {displayUser.displayName || displayUser.username}
                  </h1>
                  <Badge variant="warning">
                    <Crown size={12} className="mr-1" />
                    Level {displayStats.level}
                  </Badge>
                </div>
                <p className="text-gray-400 mb-4">@{displayUser.username}</p>
                {displayUser.bio && (
                  <p className="text-gray-300">{displayUser.bio}</p>
                )}
                <div className="flex items-center gap-4 mt-4">
                  <Link href="/settings">
                    <Button variant="secondary" size="sm">
                      <Edit size={16} className="mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="ghost" size="sm">
                      <Settings size={16} />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-background-800/50 rounded-xl">
                  <Trophy size={24} className="mx-auto mb-2 text-yellow-400" />
                  <p className="text-xl font-bold text-white">{displayStats.totalWins}</p>
                  <p className="text-xs text-gray-400">Wins</p>
                </div>
                <div className="text-center p-4 bg-background-800/50 rounded-xl">
                  <Target size={24} className="mx-auto mb-2 text-green-400" />
                  <p className="text-xl font-bold text-white">{displayStats.winRate}%</p>
                  <p className="text-xs text-gray-400">Win Rate</p>
                </div>
                <div className="text-center p-4 bg-background-800/50 rounded-xl">
                  <Star size={24} className="mx-auto mb-2 text-primary-400" />
                  <p className="text-xl font-bold text-white">{displayStats.totalXP.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Total XP</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <p className="text-2xl font-bold text-white">{displayStats.totalMatches}</p>
            <p className="text-sm text-gray-400">Matches</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <p className="text-2xl font-bold text-white">{displayStats.totalWins}</p>
            <p className="text-sm text-gray-400">Wins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-red-400" />
            <p className="text-2xl font-bold text-white">{displayStats.totalLosses}</p>
            <p className="text-sm text-gray-400">Losses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <p className="text-2xl font-bold text-white">{achievements.filter(a => a.earned).length}</p>
            <p className="text-sm text-gray-400">Achievements</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="history">
          <TabsList>
            <TabsTrigger value="history">Match History</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-4">
            <Card>
              <CardContent>
                {matchHistory.length > 0 ? (
                  <div className="space-y-2 py-2">
                    {matchHistory.map((match) => (
                      <div
                        key={match.id}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-background-800 transition-colors"
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          match.winnerId === 'me' ? 'bg-green-500/20 text-green-400' :
                          match.winnerId ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        )}>
                          {match.winnerId === 'me' ? 'W' : match.winnerId ? 'L' : 'T'}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">{match.topicName}</p>
                          <p className="text-sm text-gray-400">
                            vs {match.player2?.username || 'Opponent'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-white">{match.player1.score}</p>
                          <p className="text-xs text-gray-400">
                            {formatRelativeTime(new Date(match.playedAt))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy size={40} className="mx-auto text-gray-600 mb-3" />
                    <p className="text-gray-400">No matches yet</p>
                    <Link href="/play">
                      <Button variant="secondary" size="sm" className="mt-2">
                        Start Playing
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="mt-4">
            <Card>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 py-2">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'p-4 rounded-xl text-center',
                        achievement.earned 
                          ? 'bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/30' 
                          : 'bg-background-800 opacity-50'
                      )}
                    >
                      <span className="text-4xl mb-2 block">{achievement.icon}</span>
                      <p className="font-medium text-white">{achievement.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{achievement.description}</p>
                      {achievement.earned && (
                        <Badge variant="success" size="sm" className="mt-2">Earned</Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topics" className="mt-4">
            <Card>
              <CardContent>
                <div className="space-y-3 py-2">
                  {Object.entries(displayUser.topicStats || {}).map(([topicId, stat]) => (
                    <div key={topicId} className="flex items-center gap-4 p-3 rounded-xl bg-background-800">
                      <div className="w-10 h-10 rounded-xl bg-background-700 flex items-center justify-center text-xl">
                        {topicId === 'science' ? '🔬' : topicId === 'history' ? '📜' : '🎯'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white capitalize">{topicId}</p>
                        <div className="flex items-center gap-2">
                          <LevelBadge level={stat.level} />
                          <XPBadge xp={stat.xp} />
                        </div>
                      </div>
                      <Link href={`/leaderboard/${topicId}`}>
                        <Button variant="ghost" size="sm">
                          <Trophy size={16} className="mr-1" />
                          #{stat.rank || '-'}
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
