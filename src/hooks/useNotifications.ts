import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost } from '@/lib/api';
import { useNotificationStore } from '@/store';
import type { NotificationListResponse, UnreadNotificationCountResponse, Notification } from '@/types';

export function useNotifications(options?: { limit?: number; cursor?: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const { setUnreadCount } = useNotificationStore();

  const fetchNotifications = useCallback(async (params?: { limit?: number; cursor?: string }) => {
    try {
      setIsLoading(true);
      const response = await apiGet<NotificationListResponse>('/notifications', params);
      
      if (response.notifications) {
        if (params?.cursor) {
          setNotifications((prev) => [...prev, ...response.notifications]);
        } else {
          setNotifications(response.notifications);
        }
        setNextCursor(response.nextCursor);
        setHasMore(!!response.nextCursor);
      } else {
        setError('Failed to fetch notifications');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(options);
  }, [fetchNotifications, options]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchNotifications({ ...options, cursor: nextCursor });
    }
  };

  return {
    notifications,
    isLoading,
    error,
    hasMore,
    refresh: () => fetchNotifications(options),
    loadMore,
  };
}

export function useUnreadCount() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setUnreadCount } = useNotificationStore();

  const fetchCount = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiGet<UnreadNotificationCountResponse>('/notifications/unread-count');
      setCount(response.count);
      setUnreadCount(response.count);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch unread count');
    } finally {
      setIsLoading(false);
    }
  }, [setUnreadCount]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return {
    count,
    isLoading,
    error,
    refresh: fetchCount,
  };
}

export function useMarkNotificationRead() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUnreadCount } = useNotificationStore();

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiPost<{ success: boolean }>(`/notifications/${notificationId}/read`);
      if (response.success) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to mark as read';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [setUnreadCount]);

  const markAllAsRead = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiPost<{ success: boolean }>('/notifications/read-all');
      if (response.success) {
        setUnreadCount(0);
      }
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to mark all as read';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [setUnreadCount]);

  return {
    markAsRead,
    markAllAsRead,
    isLoading,
    error,
  };
}

export function useDeleteNotification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const del = useCallback(async (notificationId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiPost<{ success: boolean }>(`/notifications/${notificationId}/delete`);
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete notification';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    delete: del,
    isLoading,
    error,
  };
}
