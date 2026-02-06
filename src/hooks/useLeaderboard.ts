import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost } from '@/lib/api';
import type { LeaderboardEntry, LeaderboardResponse, LeaderboardScope } from '@/types';

export function useLeaderboard(topicId: string, options?: { scope?: LeaderboardScope; limit?: number; offset?: number }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [total, setTotal] = useState(0);

  const fetchLeaderboard = useCallback(async (params?: { scope?: LeaderboardScope; limit?: number; offset?: number }) => {
    try {
      setIsLoading(true);
      const response = await apiGet<LeaderboardResponse>(`/leaderboard/${topicId}`, params);
      
      if (response.entries) {
        setEntries(response.entries);
        setUserRank(response.userRank ?? null);
        setTotal(response.total);
      } else {
        setError('Failed to fetch leaderboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
    } finally {
      setIsLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    fetchLeaderboard(options);
  }, [fetchLeaderboard, options]);

  return {
    entries,
    isLoading,
    error,
    userRank,
    total,
    refresh: () => fetchLeaderboard(options),
  };
}

export function useMyRank(topicId: string, scope: LeaderboardScope = 'global') {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    const fetchMyRank = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<{ entries: LeaderboardEntry[]; userRank: number }>(
          `/leaderboard/${topicId}/me`,
          { scope }
        );
        
        if (response.entries) {
          setEntries(response.entries);
          setUserRank(response.userRank);
        } else {
          setError('Failed to fetch rank');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rank');
      } finally {
        setIsLoading(false);
      }
    };

    if (topicId) {
      fetchMyRank();
      }
    }, [fetchMyRank, topicId, scope]);

  return {
    entries,
    isLoading,
    error,
    userRank,
  };
}
