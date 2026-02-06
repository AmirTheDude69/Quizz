import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '@/lib/api';
import type { Category, Topic, TopicListItem } from '@/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiGet<{ success: boolean; data: Category[] }>('/categories');
      
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch categories');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    refresh: fetchCategories,
  };
}

export function useTopics(categoryId?: string) {
  const [topics, setTopics] = useState<TopicListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchTopics = useCallback(async (params?: { categoryId?: string; featured?: boolean; limit?: number; offset?: number }) => {
    try {
      setIsLoading(true);
      const response = await apiGet<{ success: boolean; data: { topics: TopicListItem[]; total: number } }>('/topics', params);
      
      if (response.success && response.data) {
        setTopics(response.data.topics);
        setTotal(response.data.total);
      } else {
        setError(response.error?.message || 'Failed to fetch topics');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch topics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopics({ categoryId });
  }, [fetchTopics, categoryId]);

  return {
    topics,
    total,
    isLoading,
    error,
    refresh: () => fetchTopics({ categoryId }),
  };
}

export function useFeaturedTopics() {
  const [topics, setTopics] = useState<TopicListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<{ success: boolean; data: TopicListItem[] }>('/topics/featured');
        
        if (response.success && response.data) {
          setTopics(response.data);
        } else {
          setError(response.error?.message || 'Failed to fetch featured topics');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch featured topics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return {
    topics,
    isLoading,
    error,
  };
}

export function useRecentTopics() {
  const [topics, setTopics] = useState<TopicListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<{ success: boolean; data: TopicListItem[] }>('/topics/recent');
        
        if (response.success && response.data) {
          setTopics(response.data);
        } else {
          setError(response.error?.message || 'Failed to fetch recent topics');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recent topics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecent();
  }, []);

  return {
    topics,
    isLoading,
    error,
  };
}

export function useTopic(idOrSlug: string) {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<{ success: boolean; data: Topic }>(`/topics/${idOrSlug}`);
        
        if (response.success && response.data) {
          setTopic(response.data);
        } else {
          setError(response.error?.message || 'Failed to fetch topic');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch topic');
      } finally {
        setIsLoading(false);
      }
    };

    if (idOrSlug) {
      fetchTopic();
    }
  }, [idOrSlug]);

  return {
    topic,
    isLoading,
    error,
  };
}
