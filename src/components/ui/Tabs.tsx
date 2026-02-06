'use client';

import { cn } from '@/lib/utils';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return <div className={className}>{children}</div>;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={cn('flex gap-1 p-1 bg-background-800/50 rounded-lg', className)}>
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  // We'll use a simple approach - parent controls the active state
  return null; // This won't render - use TabsTriggerButton instead
}

export function TabsTriggerButton({ 
  value, 
  active, 
  onClick, 
  children, 
  className 
}: { 
  value: string; 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-lg text-sm font-medium transition-all',
        active 
          ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' 
          : 'text-gray-400 hover:text-white hover:bg-background-700/50',
        className
      )}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  activeValue: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({ value, activeValue, children, className }: TabsContentProps) {
  if (value !== activeValue) return null;
  return <div className={className}>{children}</div>;
}
