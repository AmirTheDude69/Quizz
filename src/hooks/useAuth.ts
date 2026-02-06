import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';
import type { User, AuthResponse, SettingsResponse } from '@/types';

// Auth hooks
export function useAuth() {
  const { user, isAuthenticated, isLoading, setAuth, logout, updateUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const response = await apiPost<{ success: boolean; data: AuthResponse }>('/auth/login', {
        email,
        password,
      });

      if (response.success && response.data) {
        setAuth(response.data.user, response.data.accessToken, response.data.refreshToken);
        return { success: true };
      }
      
      setError(response.error?.message || 'Login failed');
      return { success: false, error: response.error?.message };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  }, [setAuth]);

  const signup = useCallback(async (email: string, password: string, username: string) => {
    try {
      setError(null);
      const response = await apiPost<{ success: boolean; data: AuthResponse }>('/auth/signup', {
        email,
        password,
        username,
      });

      if (response.success && response.data) {
        setAuth(response.data.user, response.data.accessToken, response.data.refreshToken);
        return { success: true };
      }
      
      setError(response.error?.message || 'Signup failed');
      return { success: false, error: response.error?.message };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(message);
      return { success: false, error: message };
    }
  }, [setAuth]);

  const logoutUser = useCallback(() => {
    apiPost('/auth/logout').finally(() => {
      logout();
    });
  }, [logout]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout: logoutUser,
    updateUser,
  };
}

export function useUser() {
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    fetchUser();
  }, [isAuthenticated]);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await apiGet<{ success: boolean; data: User }>('/profile/me');
      
      if (response.success && response.data) {
        updateUser(response.data);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (settings: Partial<User>) => {
    try {
      const response = await apiPatch<{ success: boolean; data: SettingsResponse }>('/settings', settings);
      
      if (response.success && response.data) {
        updateUser(settings);
        return { success: true };
      }
      
      return { success: false, error: response.error?.message };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Update failed' };
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    refreshUser: fetchUser,
    updateSettings,
  };
}
