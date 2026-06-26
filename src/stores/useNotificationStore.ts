import { create } from "zustand";

export type NotificationType =
  | "task-created"
  | "task-completed"
  | "task-moved"
  | "pomodoro-completed"
  | "daily-streak"
  | "productivity-milestone";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  toggleOpen: () => void;
  open: () => void;
  close: () => void;
}

const STORAGE_KEY = "focusflow-notifications";

const getInitialNotifications = (): Notification[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

const syncStorage = (notifications: Notification[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
};

const countUnread = (notifications: Notification[]) => notifications.filter((notification) => !notification.read).length;

export const formatNotificationTime = (value: string) => {
  const timestamp = new Date(value).getTime();
  const deltaMs = Date.now() - timestamp;
  const deltaMinutes = Math.round(deltaMs / 60000);
  const deltaHours = Math.round(deltaMs / 3600000);
  const deltaDays = Math.round(deltaMs / 86400000);

  if (deltaMinutes < 1) return "Just now";
  if (deltaMinutes < 5) return "A few minutes ago";
  if (deltaMinutes < 60) return "5 minutes ago";
  if (deltaHours === 1) return "1 hour ago";
  if (deltaHours < 24) return `${deltaHours} hours ago`;
  if (deltaDays === 1) return "Yesterday";
  return `${deltaDays} days ago`;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: getInitialNotifications(),
  unreadCount: countUnread(getInitialNotifications()),
  isOpen: false,

  addNotification: (notification) => {
    const nextNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    const updated = [nextNotification, ...get().notifications].slice(0, 25);
    syncStorage(updated);

    set({
      notifications: updated,
      unreadCount: countUnread(updated),
    });
  },

  markAsRead: (id) => {
    const updated = get().notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    syncStorage(updated);

    set({
      notifications: updated,
      unreadCount: countUnread(updated),
    });
  },

  markAllAsRead: () => {
    const updated = get().notifications.map((notification) => ({ ...notification, read: true }));
    syncStorage(updated);

    set({
      notifications: updated,
      unreadCount: 0,
    });
  },

  clearNotifications: () => {
    syncStorage([]);
    set({
      notifications: [],
      unreadCount: 0,
    });
  },

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
