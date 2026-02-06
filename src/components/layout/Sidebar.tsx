'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Trophy, 
  Users, 
  MessageSquare, 
  Bell, 
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  User,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore, useNotificationStore } from '@/store';
import { Avatar, Badge, LevelBadge } from '@/components/ui';
import { useUser } from '@/hooks';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/play', label: 'Play', icon: Zap },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/social', label: 'Friends', icon: Users },
  { href: '/challenges', label: 'Challenges', icon: Sparkles },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-background-800 text-white"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? '80px' : '280px',
          x: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? '-100%' : 0)
        }}
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen z-50',
          'bg-background-900/80 backdrop-blur-xl',
          'border-r border-background-700/50',
          'flex flex-col',
          'transition-all duration-300'
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-background-700/50">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-xl font-bold gradient-text whitespace-nowrap overflow-hidden"
                >
                  Quizz
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* User info */}
        {isAuthenticated && user && (
          <div className="p-4 border-b border-background-700/50">
            <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
              <Avatar src={user.avatarUrl} alt={user.displayName || user.username || 'User'} size="md" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="font-semibold text-white truncate">
                      {user.displayName || user.username}
                    </p>
                    <div className="flex items-center gap-2">
                      <LevelBadge level={user.topicStats ? Object.values(user.topicStats)[0]?.level || 1 : 1} />
                      <XPBadge xp={user.topicStats ? Object.values(user.topicStats).reduce((acc, s) => acc + s.xp, 0) : 0} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'nav-link',
                      isActive && 'active',
                      isCollapsed && 'justify-center px-3'
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <Icon size={20} />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {item.href === '/notifications' && unreadCount > 0 && (
                      <Badge variant="error" size="sm" className="ml-auto">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                    {item.href === '/challenges' && (
                      <Badge variant="info" size="sm" className="ml-auto">
                        New
                      </Badge>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-background-700/50">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'w-full nav-link justify-center',
              'hidden lg:flex'
            )}
          >
            <Menu size={20} />
          </button>
          
          {isAuthenticated && (
            <button
              onClick={() => logout()}
              className={cn(
                'w-full nav-link text-red-400 hover:text-red-300 hover:bg-red-500/10',
                isCollapsed && 'justify-center'
              )}
            >
              <LogOut size={20} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
}
