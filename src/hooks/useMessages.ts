import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiDelete } from '@/lib/api';
import type { InboxResponse, MessagesResponse, Message, ConversationPreview } from '@/types';

export function useInbox(options?: { limit?: number; cursor?: string }) {
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);

  const fetchInbox = useCallback(async (params?: { limit?: number; cursor?: string }) => {
    try {
      setIsLoading(true);
      const response = await apiGet<InboxResponse>('/messages', params);
      
      if (response.conversations) {
        if (params?.cursor) {
          setConversations((prev) => [...prev, ...response.conversations]);
        } else {
          setConversations(response.conversations);
        }
        setNextCursor(response.nextCursor);
        setHasMore(!!response.nextCursor);
      } else {
        setError('Failed to fetch inbox');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inbox');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInbox(options);
  }, [fetchInbox, options]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchInbox({ ...options, cursor: nextCursor });
    }
  };

  return {
    conversations,
    isLoading,
    error,
    hasMore,
    refresh: () => fetchInbox(options),
    loadMore,
  };
}

export function useMessages(conversationId: string, options?: { limit?: number; cursor?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);

  const fetchMessages = useCallback(async (params?: { limit?: number; cursor?: string }) => {
    try {
      setIsLoading(true);
      const response = await apiGet<MessagesResponse>(`/messages/${conversationId}`, params);
      
      if (response.messages) {
        if (params?.cursor) {
          setMessages((prev) => [...prev, ...response.messages]);
        } else {
          setMessages(response.messages);
        }
        setNextCursor(response.nextCursor);
        setHasMore(!!response.nextCursor);
      } else {
        setError('Failed to fetch messages');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchMessages(options);
  }, [fetchMessages, options]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchMessages({ ...options, cursor: nextCursor });
    }
  };

  return {
    messages,
    isLoading,
    error,
    hasMore,
    refresh: () => fetchMessages(options),
    loadMore,
  };
}

export function useSendMessage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (conversationId: string, content: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiPost<{ success: boolean; data: Message }>(`/messages/${conversationId}`, { content });
      
      if (response.success) {
        return { success: true, data: response.data };
      }
      
      setError(response.error?.message || 'Failed to send message');
      return { success: false, error: response.error?.message };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send message';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    send,
    isLoading,
    error,
  };
}

export function useStartConversation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async (userId: string, initialMessage?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiPost<{ success: boolean; data: ConversationPreview }>('/messages/start', { 
        userId,
        initialMessage 
      });
      
      if (response.success) {
        return { success: true, data: response.data };
      }
      
      setError(response.error?.message || 'Failed to start conversation');
      return { success: false, error: response.error?.message };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to start conversation';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    start,
    isLoading,
    error,
  };
}

export function useMarkMessagesRead() {
  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      await apiPost<{ success: boolean }>(`/messages/${conversationId}/read`);
    } catch (err) {
      console.error('Failed to mark messages as read:', err);
    }
  }, []);

  return {
    markAsRead,
  };
}

export function useDeleteConversation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const del = useCallback(async (conversationId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiDelete<{ success: boolean }>(`/messages/${conversationId}`);
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete conversation';
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

export function useMuteConversation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mute = useCallback(async (conversationId: string, muted: boolean) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiPost<{ success: boolean }>(`/messages/${conversationId}/mute`, { muted });
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to mute conversation';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    mute,
    isLoading,
    error,
  };
}
