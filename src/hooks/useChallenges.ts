import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiDelete } from '@/lib/api';
import type { ChallengeListResponse, ChallengePreview, CreateChallengeRequest, ChallengeCountResponse } from '@/types';

export function useChallenges(options?: { status?: string; limit?: number; cursor?: string }) {
  const [challenges, setChallenges] = useState<ChallengePreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);

  const fetchChallenges = useCallback(async (params?: { status?: string; limit?: number; cursor?: string }) => {
    try {
      setIsLoading(true);
      const response = await apiGet<ChallengeListResponse>('/challenges', params);
      
      if (response.challenges) {
        if (params?.cursor) {
          setChallenges((prev) => [...prev, ...response.challenges]);
        } else {
          setChallenges(response.challenges);
        }
        setNextCursor(response.nextCursor);
        setHasMore(!!response.nextCursor);
      } else {
        setError('Failed to fetch challenges');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch challenges');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChallenges(options);
  }, [fetchChallenges, options]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchChallenges({ ...options, cursor: nextCursor });
    }
  };

  return {
    challenges,
    isLoading,
    error,
    hasMore,
    refresh: () => fetchChallenges(options),
    loadMore,
  };
}

export function useChallengeCount() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<ChallengeCountResponse>('/challenges/count');
        setCount(response.count);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch challenge count');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();
  }, []);

  return {
    count,
    isLoading,
    error,
  };
}

export function useCreateChallenge() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: CreateChallengeRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiPost<{ success: boolean; data: ChallengePreview }>('/challenges', data);
      
      if (response.success) {
        return { success: true, data: response.data };
      }
      
      setError(response.error?.message || 'Failed to create challenge');
      return { success: false, error: response.error?.message };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create challenge';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    create,
    isLoading,
    error,
  };
}

export function useAcceptChallenge() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accept = useCallback(async (challengeId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiPost<{ success: boolean; matchId: string }>(`/challenges/${challengeId}/accept`);
      
      if (response.success) {
        return { success: true, matchId: response.matchId };
      }
      
      setError(response.error?.message || 'Failed to accept challenge');
      return { success: false, error: response.error?.message };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to accept challenge';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    accept,
    isLoading,
    error,
  };
}

export function useDeclineChallenge() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const decline = useCallback(async (challengeId: string, reason?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiPost<{ success: boolean }>(`/challenges/${challengeId}/decline`, { reason });
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to decline challenge';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    decline,
    isLoading,
    error,
  };
}

export function useCancelChallenge() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancel = useCallback(async (challengeId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiDelete<{ success: boolean }>(`/challenges/${challengeId}`);
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to cancel challenge';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    cancel,
    isLoading,
    error,
  };
}
