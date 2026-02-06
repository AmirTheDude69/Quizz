'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Plus, Clock, Trophy, Check, X, ChevronRight, ArrowRight } from 'lucide-react';
import { useChallenges, useChallengeCount } from '@/hooks';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button, Loading, Tabs, TabsContent, TabsList, TabsTriggerButton } from '@/components/ui';
import { Avatar, LevelBadge } from '@/components/ui';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { ChallengeStatus } from '@/types';

type Tab = 'pending' | 'active' | 'completed';

export default function ChallengesPage() {
  const [tab, setTab] = useState<Tab>('pending');
  const { challenges, isLoading, refresh, loadMore, hasMore } = useChallenges({ status: tab });
  const { count: pendingCount } = useChallengeCount();

  const getStatusBadge = (status: ChallengeStatus) => {
    const variants: Record<ChallengeStatus, 'warning' | 'success' | 'error' | 'info' | 'secondary'> = {
      PENDING: 'warning',
      ACCEPTED: 'info',
      COMPLETED: 'success',
      DECLINED: 'error',
      CANCELLED: 'secondary',
      EXPIRED: 'secondary',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const tabs = [
    { id: 'pending' as Tab, label: 'Pending', count: pendingCount },
    { id: 'active' as Tab, label: 'Active', count: 0 },
    { id: 'completed' as Tab, label: 'Completed', count: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Challenges</h1>
          <p className="text-gray-400 mt-1">Challenge friends or accept theirs</p>
        </div>
        <Link href="/challenges/new">
          <Button>
            <Plus size={18} className="mr-2" />
            New Challenge
          </Button>
        </Link>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card hover>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning-500/20 flex items-center justify-center">
                <Clock size={20} className="text-warning-400" />
              </div>
              <div>
                <p className="font-semibold text-white">{pendingCount}</p>
                <p className="text-sm text-gray-400">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card hover>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
                <Trophy size={20} className="text-accent-400" />
              </div>
              <div>
                <p className="font-semibold text-white">0</p>
                <p className="text-sm text-gray-400">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card hover>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Check size={20} className="text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-white">0</p>
                <p className="text-sm text-gray-400">Won</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card hover>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <X size={20} className="text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-white">0</p>
                <p className="text-sm text-gray-400">Lost</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <TabsList>
            {tabs.map((t) => (
              <TabsTriggerButton key={t.id} value={t.id}>
                {t.label}
                {t.count > 0 && (
                  <Badge variant="secondary" size="sm" className="ml-2">
                    {t.count}
                  </Badge>
                )}
              </TabsTriggerButton>
            ))}
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-background-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : challenges.length > 0 ? (
              <div className="space-y-3">
                {challenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-gray-400">From</span>
                              <Avatar 
                                src={challenge.challenger.avatarUrl} 
                                alt={challenge.challenger.username}
                                size="sm"
                              />
                              <span className="font-medium text-white">
                                {challenge.challenger.displayName || challenge.challenger.username}
                              </span>
                              {getStatusBadge(challenge.status)}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Trophy size={14} />
                              <span>{challenge.topic.name}</span>
                              <Clock size={14} className="ml-2" />
                              <span>{formatRelativeTime(new Date(challenge.expiresAt))}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="secondary" size="sm">
                              <X size={16} className="mr-1" />
                              Decline
                            </Button>
                            <Button size="sm">
                              <Check size={16} className="mr-1" />
                              Accept
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Sparkles size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400 mb-2">No pending challenges</p>
                <Link href="/challenges/new">
                  <Button variant="secondary">
                    Create a Challenge
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="mt-4">
            <div className="text-center py-12">
              <Trophy size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No active challenges</p>
              <p className="text-sm text-gray-500 mt-1">Challenges you're playing will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <div className="text-center py-12">
              <Check size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No completed challenges</p>
              <p className="text-sm text-gray-500 mt-1">Finished matches will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
