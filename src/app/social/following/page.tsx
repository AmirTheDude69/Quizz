'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Users, UserMinus, MessageSquare, Trophy, Search, ArrowLeft } from 'lucide-react';
import { useFollowing } from '@/hooks';
import { Card, CardContent, Badge, Button, Input, Loading } from '@/components/ui';
import { Avatar, LevelBadge } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function FollowingPage() {
  const params = useParams();
  const userId = params.id as string;
  const { users, isLoading, error, refresh, loadMore, hasMore } = useFollowing(userId);

  const filteredUsers = (users: typeof users) => {
    return users;
  };

  const displayUsers = filteredUsers(users);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link href={`/profile/${userId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Following</h1>
          <p className="text-gray-400 mt-1">People this user follows</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Input
          placeholder="Search following..."
          icon={<Search size={18} />}
        />
      </motion.div>

      {/* Following List */}
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
                      <div className="h-3 w-24 bg-background-800 animate-pulse rounded mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayUsers.length > 0 ? (
              <div className="space-y-2 py-4">
                {displayUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-background-800 transition-colors"
                  >
                    <Link href={`/profile/${user.id}`}>
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
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/profile/${user.id}`}>
                        <p className="font-medium text-white truncate hover:text-primary-400 transition-colors">
                          {user.displayName || user.username}
                        </p>
                      </Link>
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
                        Challenge
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
<Users size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">Not following anyone</p>
                <p className="text-sm text-gray-500 mt-1">When this user follows people, they'll appear here</p>
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
