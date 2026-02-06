'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, MessageSquare, Users, Plus, ArrowRight } from 'lucide-react';
import { useInbox } from '@/hooks';
import { Card, CardContent, Badge, Button, Input, Loading } from '@/components/ui';
import { Avatar } from '@/components/ui';
import { cn, formatRelativeTime } from '@/lib/utils';

export default function MessagesPage() {
  const [search, setSearch] = useState('');
  const { conversations, isLoading, refresh, loadMore, hasMore } = useInbox();

  const filteredConversations = conversations.filter(c => 
    c.otherUser.username?.toLowerCase().includes(search.toLowerCase()) ||
    c.otherUser.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage?.content.toLowerCase().includes(search.toLowerCase())
  );

  const getOtherUser = (conversation: typeof conversations[0]) => {
    return conversation.otherUser;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Messages</h1>
          <p className="text-gray-400 mt-1">Chat with friends</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Input
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={18} />}
        />
      </motion.div>

      {/* Conversations List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3 py-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3">
                    <div className="w-12 h-12 rounded-full bg-background-800 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-background-800 animate-pulse rounded" />
                      <div className="h-3 w-48 bg-background-800 animate-pulse rounded mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length > 0 ? (
              <div className="space-y-1 py-4">
                {filteredConversations.map((conversation, index) => {
                  const otherUser = getOtherUser(conversation);
                  return (
                    <Link key={conversation.id} href={`/messages/${conversation.id}`}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer',
                          'hover:bg-background-800',
                          conversation.unreadCount > 0 && 'bg-primary-500/5'
                        )}
                      >
                        <div className="relative">
                          <Avatar 
                            src={otherUser.avatarUrl} 
                            alt={otherUser.displayName || otherUser.username}
                            size="md"
                          />
                          {otherUser.isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background-900" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-white truncate">
                              {otherUser.displayName || otherUser.username}
                            </p>
                            {conversation.lastMessage && (
                              <span className="text-xs text-gray-500">
                                {formatRelativeTime(new Date(conversation.lastMessage.createdAt))}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {conversation.lastMessage && (
                              <p className="text-sm text-gray-400 truncate flex-1">
                                {conversation.lastMessage.isFromMe && <span className="text-primary-400 mr-1">You:</span>}
                                {conversation.lastMessage.content}
                              </p>
                            )}
                            {conversation.unreadCount > 0 && (
                              <Badge variant="primary" size="sm">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                            {conversation.muted && (
                              <MessageSquare size={14} className="text-gray-500" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400 mb-2">No conversations yet</p>
                <p className="text-sm text-gray-500 mb-4">Start chatting with friends!</p>
                <Link href="/social">
                  <Button variant="secondary" size="sm">
                    <Users size={16} className="mr-2" />
                    Find Friends
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            )}

            {hasMore && (
              <div className="text-center pt-4">
                <Button variant="secondary" onClick={loadMore} disabled={isLoading}>
                  Load More
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
