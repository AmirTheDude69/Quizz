'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Trophy, Sparkles, Users, ChevronRight, ArrowLeft, Zap } from 'lucide-react';
import { useTopics, useFriends, useCreateChallenge } from '@/hooks';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button, Input, Loading } from '@/components/ui';
import { Avatar, LevelBadge } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function NewChallengePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedUserId = searchParams.get('user');
  
  const [step, setStep] = useState<'selectUser' | 'selectTopic' | 'confirm'>('selectUser');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(preselectedUserId);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  
  const { topics, isLoading: topicsLoading } = useTopics();
  const { users: friends, isLoading: friendsLoading } = useFriends();
  const { create, isLoading: creating } = useCreateChallenge();

  const filteredFriends = friends.filter(u => 
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedUser = friends.find(u => u.id === selectedUserId);
  const selectedTopic = topics.find(t => t.id === selectedTopicId);

  const handleCreateChallenge = async () => {
    if (!selectedUserId || !selectedTopicId) return;
    
    const result = await create({
      challengedId: selectedUserId,
      topicId: selectedTopicId,
    });
    
    if (result.success) {
      router.push('/challenges');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">New Challenge</h1>
          <p className="text-gray-400 mt-1">Challenge a friend to a quiz battle</p>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-center gap-2">
          {['Select Friend', 'Choose Topic', 'Confirm'].map((label, index) => {
            const stepNames = ['selectUser', 'selectTopic', 'confirm'];
            const currentIndex = stepNames.indexOf(step);
            const isActive = index === currentIndex;
            const isComplete = index < currentIndex;
            
            return (
              <div key={label} className="flex items-center">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                  isComplete ? 'bg-primary-500 text-white' :
                  isActive ? 'bg-primary-500/20 text-primary-400 border-2 border-primary-500' :
                  'bg-background-800 text-gray-500'
                )}>
                  {isComplete ? <Sparkles size={16} /> : index + 1}
                </div>
                {index < 2 && (
                  <ChevronRight size={16} className="text-gray-600 mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Step 1: Select User */}
      {step === 'selectUser' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Select a Friend</CardTitle>
              <CardDescription>Choose who you want to challenge</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Search friends..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search size={18} />}
              />
              
              {friendsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3">
                      <div className="w-12 h-12 rounded-full bg-background-800 animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 w-32 bg-background-800 animate-pulse rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredFriends.length > 0 ? (
                <div className="space-y-2">
                  {filteredFriends.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setStep('selectTopic');
                      }}
                      className={cn(
                        'w-full flex items-center gap-4 p-3 rounded-xl transition-all',
                        selectedUserId === user.id
                          ? 'bg-primary-500/20 border-2 border-primary-500'
                          : 'hover:bg-background-800 border-2 border-transparent'
                      )}
                    >
                      <Avatar 
                        src={user.avatarUrl} 
                        alt={user.displayName || user.username}
                        size="md"
                      />
                      <div className="flex-1 text-left">
                        <p className="font-medium text-white">
                          {user.displayName || user.username}
                        </p>
                        {user.level && <LevelBadge level={user.level} />}
                      </div>
                      <Users size={18} className="text-gray-400" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users size={40} className="mx-auto text-gray-600 mb-3" />
                  <p className="text-gray-400">No friends found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Select Topic */}
      {step === 'selectTopic' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Choose a Topic</CardTitle>
                  <CardDescription>What will you battle about?</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStep('selectUser')}>
                  Change
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selected User */}
              {selectedUser && (
                <div className="flex items-center gap-3 p-3 bg-background-800 rounded-xl">
                  <Avatar 
                    src={selectedUser.avatarUrl} 
                    alt={selectedUser.displayName || selectedUser.username}
                    size="sm"
                  />
                  <span className="font-medium text-white">
                    vs {selectedUser.displayName || selectedUser.username}
                  </span>
                </div>
              )}
              
              {topicsLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-24 bg-background-800 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => {
                        setSelectedTopicId(topic.id);
                        setStep('confirm');
                      }}
                      className={cn(
                        'relative p-4 rounded-xl text-left transition-all',
                        selectedTopicId === topic.id
                          ? 'bg-primary-500/20 border-2 border-primary-500'
                          : 'hover:bg-background-800 border-2 border-transparent'
                      )}
                    >
                      <div 
                        className="absolute inset-0 rounded-xl opacity-10"
                        style={{ backgroundColor: topic.iconColor }}
                      />
                      <span className="text-3xl mb-2 block">{topic.icon}</span>
                      <p className="font-medium text-white truncate">{topic.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{topic.questionCount} questions</p>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Confirm */}
      {step === 'confirm' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card glow className="bg-gradient-to-br from-primary-500/10 to-accent-500/10">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Ready to Challenge!</h3>
                <p className="text-gray-400 mt-1">Send this challenge to your friend</p>
              </div>

              {/* Challenge Summary */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4 p-4 bg-background-800/50 rounded-xl">
                  <Avatar 
                    src={selectedUser?.avatarUrl} 
                    alt={selectedUser?.displayName || selectedUser?.username}
                    size="lg"
                  />
                  <div>
                    <p className="font-medium text-white">
                      {selectedUser?.displayName || selectedUser?.username}
                    </p>
                    <p className="text-sm text-gray-400">Your Opponent</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-background-800/50 rounded-xl">
                  {selectedTopic && (
                    <>
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${selectedTopic.iconColor}20` }}
                      >
                        {selectedTopic.icon}
                      </div>
                      <div>
                        <p className="font-medium text-white">{selectedTopic.name}</p>
                        <p className="text-sm text-gray-400">{selectedTopic.questionCount} questions</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setStep('selectTopic')}>
                  Change
                </Button>
                <Button className="flex-1" onClick={handleCreateChallenge} disabled={creating}>
                  {creating ? (
                    <>
                      <Zap size={18} className="mr-2 animate-pulse" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} className="mr-2" />
                      Send Challenge
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
