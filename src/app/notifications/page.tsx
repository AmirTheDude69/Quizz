'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bell, Check, CheckCheck, Trophy, Users, MessageSquare, Gift, Star, AlertCircle } from 'lucide-react';
import { useNotifications, useUnreadCount, useMarkNotificationRead, useDeleteNotification } from '@/hooks';
import { Card, CardContent, Badge, Button, Loading, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Avatar } from '@/components/ui';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { Notification } from '@/types';

type Tab = 'all' | 'unread';

export default function NotificationsPage() {
  const [tab, setTab] = useState<Tab>('all');
  const { notifications, isLoading, refresh, loadMore, hasMore } = useNotifications();
  const { count: unreadCount } = useUnreadCount();
  const { markAsRead, markAllAsRead, isLoading: markingRead } = useMarkNotificationRead();
  const { delete: deleteNotification, isLoading: deleting } = useDeleteNotification();

  const filteredNotifications = tab === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'challenge':
        return <Trophy className="w-5 h-5 text-warning-400" />;
      case 'match_result':
        return <Star className="w-5 h-5 text-primary-400" />;
      case 'follow':
        return <Users className="w-5 h-5 text-blue-400" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-green-400" />;
      case 'gift':
        return <Gift className="w-5 h-5 text-pink-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'challenge':
        return (
          <span>
            <strong>{notification.actor?.displayName || notification.actor?.username}</strong> challenged you to a match!
          </span>
        );
      case 'match_result':
        return (
          <span>
            {notification.data?.result === 'win' 
              ? 'You won your match against ' 
              : 'You lost to '}
            <strong>{notification.data?.opponentName || 'someone'}</strong>
          </span>
        );
      case 'follow':
        return (
          <span>
            <strong>{notification.actor?.displayName || notification.actor?.username}</strong> started following you
          </span>
        );
      case 'level_up':
        return (
          <span>
            Congratulations! You reached <strong>Level {notification.data?.level}</strong>
          </span>
        );
      case 'achievement':
        return (
          <span>
            You earned the achievement: <strong>{notification.data?.achievementName}</strong>
          </span>
        );
      default:
        return <span>{notification.data?.message || 'You have a new notification'}</span>;
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    // Navigate based on type
    if (notification.type === 'challenge' || notification.type === 'match_result') {
      // Navigate to match/challenge
    } else if (notification.type === 'follow') {
      // Navigate to profile
    } else if (notification.type === 'message') {
      // Navigate to messages
    }
  };

  // Demo notifications
  const demoNotifications: Notification[] = [
    {
      id: '1',
      type: 'challenge',
      actor: { id: '2', username: 'QuizMaster', displayName: 'Quiz Master', avatarUrl: null },
      data: { topicName: 'Science', challengeId: 'ch-1' },
      read: false,
      createdAt: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: '2',
      type: 'match_result',
      data: { result: 'win', opponentName: 'Brainiac', score: 1250 },
      read: false,
      createdAt: new Date(Date.now() - 600000).toISOString(),
    },
    {
      id: '3',
      type: 'follow',
      actor: { id: '3', username: 'SmartCookie', displayName: 'Smart Cookie', avatarUrl: null },
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '4',
      type: 'level_up',
      data: { level: 15 },
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '5',
      type: 'achievement',
      data: { achievementName: 'Quiz Champion' },
      read: true,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  const displayNotifications = notifications.length > 0 ? notifications : demoNotifications;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Notifications</h1>
            <p className="text-gray-400">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" onClick={markAllAsRead} disabled={markingRead}>
            <CheckCheck size={18} className="mr-2" />
            Mark All Read
          </Button>
        )}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <TabsList>
            <TabsTrigger value="all">
              All
              {notifications.length > 0 && (
                <Badge variant="secondary" size="sm" className="ml-2">
                  {notifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge variant="warning" size="sm" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-background-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : displayNotifications.length > 0 ? (
              <div className="space-y-2">
                {displayNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      hover={!notification.read}
                      className={cn(
                        'cursor-pointer transition-all',
                        !notification.read && 'border-l-4 border-l-primary-500 bg-primary-500/5'
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center',
                            notification.read ? 'bg-background-800' : 'bg-primary-500/20'
                          )}>
                            {notification.actor ? (
                              <Avatar 
                                src={notification.actor.avatarUrl} 
                                alt={notification.actor.username}
                                size="sm"
                              />
                            ) : (
                              getNotificationIcon(notification.type)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'text-sm',
                              notification.read ? 'text-gray-400' : 'text-white'
                            )}>
                              {getNotificationText(notification)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatRelativeTime(new Date(notification.createdAt))}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-primary-500" />
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              disabled={deleting}
                            >
                              <AlertCircle size={16} className="text-gray-500" />
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
                <Bell size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No notifications yet</p>
                <p className="text-sm text-gray-500 mt-1">When you get notifications, they'll appear here</p>
              </div>
            )}

            {hasMore && (
              <div className="text-center pt-4">
                <Button variant="secondary" onClick={loadMore} disabled={isLoading}>
                  Load More
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="unread" className="mt-4">
            {filteredNotifications.filter(n => !n.read).length > 0 ? (
              <div className="space-y-2">
                {filteredNotifications.filter(n => !n.read).map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card hover className="cursor-pointer border-l-4 border-l-primary-500 bg-primary-500/5">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                            {notification.actor ? (
                              <Avatar 
                                src={notification.actor.avatarUrl} 
                                alt={notification.actor.username}
                                size="sm"
                              />
                            ) : (
                              getNotificationIcon(notification.type)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white">
                              {getNotificationText(notification)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatRelativeTime(new Date(notification.createdAt))}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check size={16} className="text-primary-400" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCheck size={48} className="mx-auto text-green-400 mb-4" />
                <p className="text-gray-400">All caught up!</p>
                <p className="text-sm text-gray-500 mt-1">No unread notifications</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
