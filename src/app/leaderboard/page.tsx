'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Trophy, Medal, Crown, TrendingUp, Filter } from 'lucide-react';
import { useLeaderboard } from '@/hooks';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button, Loading } from '@/components/ui';
import { Avatar, LevelBadge, XPBadge } from '@/components/ui';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { LeaderboardScope } from '@/types';

export default function LeaderboardPage() {
  const [scope, setScope] = useState<LeaderboardScope>('global');
  const [timeRange, setTimeRange] = useState<'all' | 'weekly' | 'daily'>('all');
  
  // For demo, using a placeholder topic ID
  const { entries, isLoading, error, userRank } = useLeaderboard('global', { scope });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-gray-400 font-medium w-6 text-center">{rank}</span>;
  };

  const getRankClass = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30';
    return 'bg-background-800';
  };

  // Demo data
  const demoEntries = [
    { rank: 1, user: { id: '1', username: 'QuizMaster', displayName: 'Quiz Master', avatarUrl: null }, score: 15420, level: 25 },
    { rank: 2, user: { id: '2', username: 'Brainiac', displayName: 'Brainiac', avatarUrl: null }, score: 14850, level: 24 },
    { rank: 3, user: { id: '3', username: 'SmartCookie', displayName: 'Smart Cookie', avatarUrl: null }, score: 13200, level: 22 },
    { rank: 4, user: { id: '4', username: 'TriviaKing', displayName: 'Trivia King', avatarUrl: null }, score: 12100, level: 21 },
    { rank: 5, user: { id: '5', username: 'KnowledgeNinja', displayName: 'Knowledge Ninja', avatarUrl: null }, score: 11500, level: 20 },
    { rank: 6, user: { id: '6', username: 'FactFinder', displayName: 'Fact Finder', avatarUrl: null }, score: 10800, level: 19 },
    { rank: 7, user: { id: '7', username: 'QuizWhiz', displayName: 'Quiz Whiz', avatarUrl: null }, score: 10200, level: 18 },
    { rank: 8, user: { id: '8', username: 'SmartyPants', displayName: 'Smarty Pants', avatarUrl: null }, score: 9800, level: 17 },
    { rank: 9, user: { id: '9', username: 'TriviaTiger', displayName: 'Trivia Tiger', avatarUrl: null }, score: 9400, level: 16 },
    { rank: 10, user: { id: '10', username: 'BrainBox', displayName: 'Brain Box', avatarUrl: null }, score: 9000, level: 15 },
  ];

  const displayEntries = isLoading ? demoEntries : (entries.length > 0 ? entries : demoEntries);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Leaderboard</h1>
          <p className="text-gray-400 mt-1">See who's at the top</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'weekly', 'daily'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Scope Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['global', 'country', 'city'] as LeaderboardScope[]).map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                scope === s
                  ? 'bg-primary-500 text-white'
                  : 'bg-background-800 text-gray-400 hover:text-white'
              )}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Top 3 Podium */}
      {displayEntries.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 lg:gap-6"
        >
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="bg-gradient-to-t from-gray-500/20 to-gray-600/20 rounded-t-xl p-4 pb-0">
              <Avatar 
                src={displayEntries[1].user.avatarUrl} 
                alt={displayEntries[1].user.displayName || displayEntries[1].user.username}
                size="lg"
              />
            </div>
            <div className="bg-gray-500/20 rounded-b-xl p-3">
              <p className="font-semibold text-white truncate">
                {displayEntries[1].user.displayName || displayEntries[1].user.username}
              </p>
              <p className="text-sm text-gray-400">{displayEntries[1].score.toLocaleString()} XP</p>
            </div>
            <div className="flex justify-center -mt-3">
              <Medal className="w-10 h-10 text-gray-300" />
            </div>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="bg-gradient-to-t from-yellow-500/20 to-amber-500/20 rounded-t-xl p-4 pb-0 relative">
              <Crown className="w-8 h-8 text-yellow-400 absolute -top-4 left-1/2 -translate-x-1/2" />
              <Avatar 
                src={displayEntries[0].user.avatarUrl} 
                alt={displayEntries[0].user.displayName || displayEntries[0].user.username}
                size="xl"
              />
            </div>
            <div className="bg-yellow-500/20 rounded-b-xl p-3">
              <p className="font-semibold text-white truncate">
                {displayEntries[0].user.displayName || displayEntries[0].user.username}
              </p>
              <p className="text-sm text-gray-400">{displayEntries[0].score.toLocaleString()} XP</p>
            </div>
            <div className="flex justify-center -mt-3">
              <Crown className="w-10 h-10 text-yellow-400" />
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="bg-gradient-to-t from-amber-600/20 to-amber-700/20 rounded-t-xl p-4 pb-0">
              <Avatar 
                src={displayEntries[2].user.avatarUrl} 
                alt={displayEntries[2].user.displayName || displayEntries[2].user.username}
                size="lg"
              />
            </div>
            <div className="bg-amber-600/20 rounded-b-xl p-3">
              <p className="font-semibold text-white truncate">
                {displayEntries[2].user.displayName || displayEntries[2].user.username}
              </p>
              <p className="text-sm text-gray-400">{displayEntries[2].score.toLocaleString()} XP</p>
            </div>
            <div className="flex justify-center -mt-3">
              <Medal className="w-10 h-10 text-amber-600" />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Leaderboard List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Global Rankings</CardTitle>
            <CardDescription>Top players worldwide</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3">
                    <div className="w-10 h-10 rounded-full bg-background-800 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-background-800 animate-pulse rounded" />
                      <div className="h-3 w-24 bg-background-800 animate-pulse rounded mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {displayEntries.map((entry) => (
                  <motion.div
                    key={entry.user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      'flex items-center gap-4 p-3 rounded-xl transition-all',
                      getRankClass(entry.rank)
                    )}
                  >
                    <div className="w-10 flex justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    <Avatar 
                      src={entry.user.avatarUrl} 
                      alt={entry.user.displayName || entry.user.username}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">
                        {entry.user.displayName || entry.user.username}
                      </p>
                      <div className="flex items-center gap-2">
                        <LevelBadge level={entry.level} />
                        <XPBadge xp={entry.score} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{entry.score.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">XP</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Your Rank */}
      {userRank && userRank > 10 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="outline">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-primary-400">#{userRank}</span>
                  <div>
                    <p className="font-medium text-white">Your Rank</p>
                    <p className="text-sm text-gray-400">Keep playing to climb!</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <TrendingUp size={16} className="mr-2 text-green-400" />
                  Climb
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
