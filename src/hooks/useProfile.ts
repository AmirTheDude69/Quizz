import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPatch } from '@/lib/api';
import type { User, GlobalStats, TopicStatsResponse } from '@/types';

export function useProfile(userId: string) {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<{ success: boolean; data: User }>(`/profile/${userId}`);
        
        if (response.success && response.data) {
          setProfile(response.data);
        } else {
          setError(response.error?.message || 'Failed to fetch profile');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  return {
    profile,
    isLoading,
    error,
    refresh: () => {
      setIsLoading(true);
      apiGet<{ success: boolean; data: User }>(`/profile/${userId}`)
        .then((response) => {
          if (response.success && response.data) {
            setProfile(response.data);
          }
        })
        .catch((err) => setError(err instanceof Error ? err.message : 'Failed to fetch profile'))
        .finally(() => setIsLoading(false));
    },
  };
}

export function useGlobalStats() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<{ success: boolean; data: GlobalStats }>('/profile/stats');
        
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError(response.error?.message || 'Failed to fetch stats');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
  };
}

export function useTopicStats(topicId: string) {
  const [stats, setStats] = useState<TopicStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<{ success: boolean; data: TopicStatsResponse }>(`/profile/stats/${topicId}`);
        
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError(response.error?.message || 'Failed to fetch topic stats');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch topic stats');
      } finally {
        setIsLoading(false);
      }
    };

    if (topicId) {
      fetchStats();
    }
  }, [topicId]);

  return {
    stats,
    isLoading,
    error,
  };
}

export function useUpdateProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiPatch<{ success: boolean; data: User }>('/profile', data);
      
      if (response.success) {
        return { success: true, data: response.data };
      }
      
      setError(response.error?.message || 'Failed to update profile');
      return { success: false, error: response.error?.message };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    update,
    isLoading,
    error,
  };
}

export function useUpdateAvatar() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAvatar = useCallback(async (avatarUrl: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiPatch<{ success: boolean }>('/profile/avatar', { avatarUrl });
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update avatar';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    updateAvatar,
    isLoading,
    error,
  };
}
