'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import { LoadingPage } from '@/components/ui';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuthStore();

  // For now, we'll show the content even for unauthenticated users
  // The individual pages will handle authentication redirects

  if (isLoading) {
    return <LoadingPage />;
  }

  return <>{children}</>;
}
