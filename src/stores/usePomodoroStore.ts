import { create } from "zustand";
import { useNotificationStore } from "./useNotificationStore";

export const INITIAL_TIME = 25 * 60;

const STORAGE_KEYS = {
  seconds: "pomodoro-seconds",
  running: "pomodoro-running",
};

const loadStoredSeconds = () => {
  const saved = window.localStorage.getItem(STORAGE_KEYS.seconds);
  const parsed = Number(saved);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return INITIAL_TIME;
  }

  return Math.floor(parsed);
};

const loadStoredRunning = () => {
  const saved = window.localStorage.getItem(STORAGE_KEYS.running);
  return saved === "true";
};

interface PomodoroStore {
  seconds: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
  tick: () => void;
}

export const usePomodoroStore = create<PomodoroStore>((set, get) => ({
  seconds: loadStoredSeconds(),
  isRunning: loadStoredRunning(),

  start: () => {
    set({ isRunning: true });
    window.localStorage.setItem(STORAGE_KEYS.running, "true");
  },

  pause: () => {
    set({ isRunning: false });
    window.localStorage.setItem(STORAGE_KEYS.running, "false");
  },

  toggle: () => {
    const nextIsRunning = !get().isRunning;
    set({ isRunning: nextIsRunning });
    window.localStorage.setItem(STORAGE_KEYS.running, String(nextIsRunning));
  },

  reset: () => {
    set({ seconds: INITIAL_TIME, isRunning: false });
    window.localStorage.setItem(STORAGE_KEYS.seconds, String(INITIAL_TIME));
    window.localStorage.setItem(STORAGE_KEYS.running, "false");
  },

  tick: () => {
    const current = get();

    if (!current.isRunning || current.seconds <= 0) {
      return;
    }

    const nextSeconds = current.seconds - 1;

    if (nextSeconds <= 0) {
      set({ seconds: 0, isRunning: false });
      window.localStorage.setItem(STORAGE_KEYS.seconds, "0");
      window.localStorage.setItem(STORAGE_KEYS.running, "false");
      useNotificationStore.getState().addNotification({
        type: "pomodoro-completed",
        title: "Pomodoro complete",
        message: "A focused session has finished. Great work.",
      });
      return;
    }

    set({ seconds: nextSeconds });
    window.localStorage.setItem(STORAGE_KEYS.seconds, String(nextSeconds));
  },
}));

export const formatPomodoroTime = (time: number) => {
  const mins = Math.floor(time / 60);
  const secs = time % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};
