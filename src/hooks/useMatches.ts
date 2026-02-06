import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost } from '@/lib/api';
import type { MatchSummary, MatchResult } from '@/types';

export function useMatchHistory(options?: { limit?: number; offset?: number; topicId?: string }) {
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchMatches = useCallback(async (params?: { limit?: number; offset?: number; topicId?: string }) => {
    try {
      setIsLoading(true);
      const response = await apiGet<{ success: boolean; data: { matches: MatchSummary[]; total: number; hasMore: boolean } }>(
        '/matches/history',
        params
      );
      
      if (response.success && response.data) {
        if (params?.offset && params.offset > 0) {
          setMatches((prev) => [...prev, ...response.data.matches]);
        } else {
          setMatches(response.data.matches);
        }
        setTotal(response.data.total);
        setHasMore(response.data.hasMore);
      } else {
        setError(response.error?.message || 'Failed to fetch match history');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch match history');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches(options);
  }, [fetchMatches, options]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchMatches({ ...options, offset: matches.length });
    }
  };

  return {
    matches,
    isLoading,
    error,
    hasMore,
    total,
    refresh: () => fetchMatches(options),
    loadMore,
  };
}

export function useMatch(matchId: string) {
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<{ success: boolean; data: MatchResult }>(`/matches/${matchId}`);
        
        if (response.success && response.data) {
          setMatch(response.data);
        } else {
          setError(response.error?.message || 'Failed to fetch match');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch match');
      } finally {
        setIsLoading(false);
      }
    };

    if (matchId) {
      fetchMatch();
    }
  }, [matchId]);

  return {
    match,
    isLoading,
    error,
  };
}
