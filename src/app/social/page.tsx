'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Users, UserPlus, MessageSquare, Trophy, TrendingUp, Clock, Search } from 'lucide-react';
import { useFriends, useSuggestions, useRecentOpponents } from '@/hooks';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button, Input, Loading } from '@/components/ui';
import { Avatar, LevelBadge } from '@/components/ui';
import { cn, formatRelativeTime } from '@/lib/utils';

type Tab = 'friends' | 'suggestions' | 'opponents';

export default function SocialPage() {
  const [tab, setTab] = useState<Tab>('friends');
  const [search, setSearch] = useState('');
  
  const { users: friends, isLoading: friendsLoading } = useFriends();
  const { users: suggestions, isLoading: suggestionsLoading } = useSuggestions();
  const { users: opponents, isLoading: opponentsLoading } = useRecentOpponents();

  const tabs = [
    { id: 'friends' as Tab, label: 'Friends', icon: Users, count: friends.length },
    { id: 'suggestions' as Tab, label: 'Suggestions', icon: UserPlus, count: suggestions.length },
    { id: 'opponents' as Tab, label: 'Recent', icon: Clock, count: opponents.length },
  ];

  const filteredUsers = (users: typeof friends) => {
    if (!search) return users;
    return users.filter(u => 
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.displayName?.toLowerCase().includes(search.toLowerCase())
    );
  };

  const displayFriends = filteredUsers(friends);
  const displaySuggestions = filteredUsers(suggestions);
  const displayOpponents = filteredUsers(opponents);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Friends</h1>
          <p className="text-gray-400 mt-1">Connect and compete with others</p>
        </div>
        <Link href="/challenges/new">
          <Button>
            <Trophy size={18} className="mr-2" />
            Challenge Friend
          </Button>
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Input
          placeholder="Search friends..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={18} />}
        />
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
              tab === t.id
                ? 'bg-primary-500 text-white'
                : 'bg-background-800 text-gray-400 hover:text-white'
            )}
          >
            <t.icon size={16} />
            {t.label}
            {t.count > 0 && (
              <Badge variant="secondary" size="sm">
                {t.count}
              </Badge>
            )}
          </button>
        ))}
      </motion.div>

      {/* Friends Tab */}
      {tab === 'friends' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Friends</CardTitle>
              <CardDescription>People you follow and who follow you back</CardDescription>
            </CardHeader>
            <CardContent>
              {friendsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3">
                      <div className="w-12 h-12 rounded-full bg-background-800 animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 w-32 bg-background-800 animate-pulse rounded" />
                        <div className="h-3 w-24 bg-background-800 animate-pulse rounded mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : displayFriends.length > 0 ? (
                <div className="space-y-2">
                  {displayFriends.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-background-800 transition-colors"
                    >
                      <div className="relative">
                        <Avatar 
                          src={user.avatarUrl} 
                          alt={user.displayName || user.username}
                          size="md"
                        />
                        {user.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background-900" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">
                          {user.displayName || user.username}
                        </p>
                        {user.level && <LevelBadge level={user.level} />}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/messages?user=${user.id}`}>
                          <Button variant="secondary" size="sm">
                            <MessageSquare size={16} />
                          </Button>
                        </Link>
                        <Link href={`/challenges/new?user=${user.id}`}>
                          <Button size="sm">
                            <Trophy size={16} />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400 mb-2">No friends yet</p>
                  <p className="text-sm text-gray-500">Follow people to connect!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Suggestions Tab */}
      {tab === 'suggestions' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Suggested for You</CardTitle>
              <CardDescription>People you might know</CardDescription>
            </CardHeader>
            <CardContent>
              {suggestionsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3">
                      <div className="w-12 h-12 rounded-full bg-background-800 animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 w-32 bg-background-800 animate-pulse rounded" />
                        <div className="h-3 w-24 bg-background-800 animate-pulse rounded mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : displaySuggestions.length > 0 ? (
                <div className="space-y-2">
                  {displaySuggestions.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-background-800 transition-colors"
                    >
                      <Avatar 
                        src={user.avatarUrl} 
                        alt={user.displayName || user.username}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">
                          {user.displayName || user.username}
                        </p>
                        {user.mutualTopics && user.mutualTopics.length > 0 && (
                          <p className="text-xs text-gray-400 truncate">
                            Mutual in {user.mutualTopics.slice(0, 2).join(', ')}
                          </p>
                        )}
                      </div>
                      <Button size="sm">
                        <UserPlus size={16} className="mr-1" />
                        Follow
                      </Button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <UserPlus size={48} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400">No suggestions right now</p>
                  <p className="text-sm text-gray-500 mt-1">Check back later!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent Opponents Tab */}
      {tab === 'opponents' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Opponents</CardTitle>
              <CardDescription>People you've played with recently</CardDescription>
            </CardHeader>
            <CardContent>
              {opponentsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3">
                      <div className="w-12 h-12 rounded-full bg-background-800 animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 w-32 bg-background-800 animate-pulse rounded" />
                        <div className="h-3 w-24 bg-background-800 animate-pulse rounded mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : displayOpponents.length > 0 ? (
                <div className="space-y-2">
                  {displayOpponents.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-background-800 transition-colors"
                    >
                      <div className="relative">
                        <Avatar 
                          src={user.avatarUrl} 
                          alt={user.displayName || user.username}
                          size="md"
                        />
                        {user.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background-900" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">
                          {user.displayName || user.username}
                        </p>
                        {user.level && <LevelBadge level={user.level} />}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/messages?user=${user.id}`}>
                          <Button variant="secondary" size="sm">
                            <MessageSquare size={16} />
                          </Button>
                        </Link>
                        <Button size="sm">
                          <Trophy size={16} className="mr-1" />
                          Rematch
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock size={48} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400">No recent opponents</p>
                  <p className="text-sm text-gray-500 mt-1">Play some matches to see who you've faced!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
