'use client';

import Link from 'next/link';
import { Search, Bell, MessageSquare } from 'lucide-react';
import { useAuthStore, useNotificationStore } from '@/store';
import { Input, Avatar, Badge } from '@/components/ui';

export function Header() {
  const { user, isAuthenticated } = useAuthStore();
  const { unreadCount: notificationCount } = useNotificationStore();

  return (
    <header className="sticky top-0 z-30 bg-background-950/80 backdrop-blur-xl border-b border-background-700/50">
      <div className="px-4 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <Input
              placeholder="Search topics, players..."
              icon={<Search size={18} />}
              className="bg-background-800/50 border-background-700"
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 ml-auto">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Link
                  href="/notifications"
                  className="relative p-2 rounded-xl hover:bg-background-800 transition-colors"
                >
                  <Bell size={20} className="text-gray-400" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                </Link>

                {/* Messages */}
                <Link
                  href="/messages"
                  className="relative p-2 rounded-xl hover:bg-background-800 transition-colors"
                >
                  <MessageSquare size={20} className="text-gray-400" />
                </Link>

                {/* Profile */}
                <Link
                  href="/profile/me"
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-background-800 transition-colors"
                >
                  <Avatar
                    src={user?.avatarUrl}
                    alt={user?.displayName || user?.username || 'User'}
                    size="sm"
                  />
                  <span className="hidden lg:block text-sm font-medium text-white">
                    {user?.displayName || user?.username}
                  </span>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="btn-secondary text-sm">
                  Login
                </Link>
                <Link href="/auth/signup" className="btn-glow text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
