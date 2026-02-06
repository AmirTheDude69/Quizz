import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiDelete } from '@/lib/api';
import type { FollowersResponse, FollowingResponse, FriendsResponse, SuggestionsResponse, RecentOpponentsResponse, FollowStatusResponse } from '@/types';

export function useFollowers(userId: string, options?: { limit?: number; cursor?: string }) {
  const [users, setUsers] = useState<FollowersResponse['users']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchFollowers = useCallback(async (params?: { limit?: number; cursor?: string }) => {
    try {
      setIsLoading(true);
      const response = await apiGet<FollowersResponse>(`/social/${userId}/followers`, params);
      
      if (response.users) {
        if (params?.cursor) {
          setUsers((prev) => [...prev, ...response.users]);
        } else {
          setUsers(response.users);
        }
        setNextCursor(response.nextCursor);
        setHasMore(!!response.nextCursor);
        setTotalCount(response.totalCount);
      } else {
        setError('Failed to fetch followers');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch followers');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFollowers(options);
  }, [fetchFollowers, options]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchFollowers({ ...options, cursor: nextCursor });
    }
  };

  return {
    users,
    isLoading,
    error,
    hasMore,
    totalCount,
    refresh: () => fetchFollowers(options),
    loadMore,
  };
}

export function useFollowing(userId: string, options?: { limit?: number; cursor?: string }) {
  const [users, setUsers] = useState<FollowingResponse['users']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchFollowing = useCallback(async (params?: { limit?: number; cursor?: string }) => {
    try {
      setIsLoading(true);
      const response = await apiGet<FollowingResponse>(`/social/${userId}/following`, params);
      
      if (response.users) {
        if (params?.cursor) {
          setUsers((prev) => [...prev, ...response.users]);
        } else {
          setUsers(response.users);
        }
        setNextCursor(response.nextCursor);
        setHasMore(!!response.nextCursor);
        setTotalCount(response.totalCount);
      } else {
        setError('Failed to fetch following');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch following');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFollowing(options);
  }, [fetchFollowing, options]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchFollowing({ ...options, cursor: nextCursor });
    }
  };

  return {
    users,
    isLoading,
    error,
    hasMore,
    totalCount,
    refresh: () => fetchFollowing(options),
    loadMore,
  };
}

export function useFriends(options?: { limit?: number; cursor?: string }) {
  const [users, setUsers] = useState<FriendsResponse['users']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchFriends = useCallback(async (params?: { limit?: number; cursor?: string }) => {
    try {
      setIsLoading(true);
      const response = await apiGet<FriendsResponse>('/social/friends', params);
      
      if (response.users) {
        if (params?.cursor) {
          setUsers((prev) => [...prev, ...response.users]);
        } else {
          setUsers(response.users);
        }
        setNextCursor(response.nextCursor);
        setHasMore(!!response.nextCursor);
        setTotalCount(response.totalCount);
      } else {
        setError('Failed to fetch friends');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch friends');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFriends(options);
  }, [fetchFriends, options]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchFriends({ ...options, cursor: nextCursor });
    }
  };

  return {
    users,
    isLoading,
    error,
    hasMore,
    totalCount,
    refresh: () => fetchFriends(options),
    loadMore,
  };
}

export function useSuggestions() {
  const [users, setUsers] = useState<SuggestionsResponse['users']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<SuggestionsResponse>('/social/suggestions');
        
        if (response.users) {
          setUsers(response.users);
        } else {
          setError('Failed to fetch suggestions');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch suggestions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  return {
    users,
    isLoading,
    error,
  };
}

export function useRecentOpponents() {
  const [users, setUsers] = useState<RecentOpponentsResponse['users']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpponents = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<RecentOpponentsResponse>('/social/opponents/recent');
        
        if (response.users) {
          setUsers(response.users);
        } else {
          setError('Failed to fetch recent opponents');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recent opponents');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpponents();
  }, []);

  return {
    users,
    isLoading,
    error,
  };
}

export function useFollowStatus(userId: string) {
  const [status, setStatus] = useState<FollowStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<FollowStatusResponse>(`/social/${userId}/follow-status`);
        setStatus(response);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch follow status');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchStatus();
    }
  }, [userId]);

  const follow = useCallback(async () => {
    try {
      const response = await apiPost<{ success: boolean }>(`/social/${userId}/follow`);
      if (response.success) {
        setStatus((prev) => prev ? { ...prev, status: 'following' as const, followersCount: prev.followersCount + 1 } : null);
      }
      return response;
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Follow failed' };
    }
  }, [userId]);

  const unfollow = useCallback(async () => {
    try {
      const response = await apiDelete<{ success: boolean }>(`/social/${userId}/follow`);
      if (response.success) {
        setStatus((prev) => prev ? { ...prev, status: 'none' as const, followersCount: prev.followersCount - 1 } : null);
      }
      return response;
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Unfollow failed' };
    }
  }, [userId]);

  return {
    status,
    isLoading,
    error,
    follow,
    unfollow,
  };
}
