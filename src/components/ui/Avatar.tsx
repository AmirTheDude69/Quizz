'use client';

import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';
import Image from 'next/image';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  status?: 'online' | 'offline' | 'away';
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  away: 'bg-yellow-500',
};

export function Avatar({ src, alt = 'Avatar', size = 'md', className, status }: AvatarProps) {
  const initials = alt ? getInitials(alt) : '?';

  return (
    <div className={cn('relative inline-block', className)}>
      {src ? (
        <div className={cn('relative rounded-full overflow-hidden', sizeClasses[size])}>
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes={size === 'xs' ? '24px' : size === 'sm' ? '32px' : size === 'md' ? '40px' : size === 'lg' ? '48px' : '64px'}
          />
        </div>
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-semibold bg-gradient-to-br from-primary-500 to-accent-500 text-white',
            sizeClasses[size]
          )}
        >
          {initials}
        </div>
      )}
      
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-background-900',
            statusColors[status],
            size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'
          )}
        />
      )}
    </div>
  );
}
