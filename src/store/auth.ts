import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
      
      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },
      
      updateUser: (userData) => {
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          set({ user: updatedUser });
        }
      },
      
      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const storedUser = localStorage.getItem('user');
          const storedToken = localStorage.getItem('accessToken');
          
          if (storedUser && storedToken) {
            try {
              const user = JSON.parse(storedUser);
              state.setAuth(user, storedToken, localStorage.getItem('refreshToken') || '');
            } catch {
              state.logout();
            }
          } else {
            state.setLoading(false);
          }
        }
      },
    }
  )
);

// Initialize auth on load
if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('accessToken');
  
  if (storedUser && storedToken) {
    try {
      const user = JSON.parse(storedUser);
      useAuthStore.getState().setAuth(user, storedToken, localStorage.getItem('refreshToken') || '');
    } catch {
      useAuthStore.getState().logout();
    }
  } else {
    useAuthStore.getState().setLoading(false);
  }
}
