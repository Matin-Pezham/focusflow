export interface ProductivityHistoryEntry {
  id: string;
  type: "task-completed" | "focus-session";
  timestamp: string;
  title?: string;
  value?: number;
}

const HISTORY_KEY = "focusflow-productivity-history";

export const getStoredProductivityHistory = (): ProductivityHistoryEntry[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

export const recordProductivityEvent = (type: ProductivityHistoryEntry["type"], title?: string, value?: number) => {
  if (typeof window === "undefined") return;

  const entry: ProductivityHistoryEntry = {
    id: typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now()),
    type,
    title,
    value,
    timestamp: new Date().toISOString(),
  };

  const existing = getStoredProductivityHistory();
  const next = [entry, ...existing].slice(0, 40);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
};
