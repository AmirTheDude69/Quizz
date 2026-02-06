import { create } from 'zustand';

interface NotificationState {
  unreadCount: number;
  notifications: Array<{
    id: string;
    type: string;
    read: boolean;
    createdAt: string;
  }>;
  
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  decrementUnread: () => void;
  addNotification: (notification: { id: string; type: string; createdAt: string }) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  notifications: [],
  
  setUnreadCount: (count) => set({ unreadCount: count }),
  
  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  
  decrementUnread: () => set((state) => ({ 
    unreadCount: Math.max(0, state.unreadCount - 1) 
  })),
  
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications].slice(0, 50),
    unreadCount: state.unreadCount + 1,
  })),
  
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),
  
  clearNotifications: () => set({ unreadCount: 0, notifications: [] }),
}));
