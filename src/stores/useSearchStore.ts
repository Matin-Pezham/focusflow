import { create } from "zustand";
import { useTaskStore, type Task } from "./useTaskStore";

export type SearchCategory = "tasks" | "goals" | "analytics";

export interface SearchResult {
  id: string;
  category: SearchCategory;
  title: string;
  description: string;
  route: string;
}

export interface SearchResultGroup {
  category: SearchCategory;
  title: string;
  items: SearchResult[];
}

interface SearchStore {
  query: string;
  isOpen: boolean;
  selectedIndex: number;
  results: SearchResultGroup[];
  recentSearches: string[];
  setQuery: (query: string) => void;
  openSearch: () => void;
  closeSearch: () => void;
  clearSearch: () => void;
  setSelectedIndex: (index: number) => void;
  selectNext: () => void;
  selectPrevious: () => void;
  addRecentSearch: (value: string) => void;
  clearRecentSearches: () => void;
}

const STORAGE_KEY = "focusflow-search-query";
const RECENT_SEARCHES_KEY = "focusflow-recent-searches";

const goalItems: SearchResult[] = [
  {
    id: "goal-portfolio",
    category: "goals",
    title: "Polish the portfolio experience",
    description: "Bring the product feel closer to a premium client presentation.",
    route: "/tasks",
  },
  {
    id: "goal-focus",
    category: "goals",
    title: "Protect deep work blocks",
    description: "Keep your best work protected with a calm focus routine.",
    route: "/pomodoro",
  },
  {
    id: "goal-analytics",
    category: "goals",
    title: "Review weekly momentum",
    description: "Inspect completion trends and improve your weekly rhythm.",
    route: "/analytics",
  },
];

const normalizeQuery = (value: string) => value.trim().toLowerCase();

const matchesQuery = (value: string, query: string) => {
  if (!query) return true;
  return value.toLowerCase().includes(query);
};

const buildAnalyticsResults = (tasks: Task[], query: string): SearchResult[] => {
  const totalTasks = tasks.length;
  const backlogTasks = tasks.filter((task) => task.status === "backlog").length;
  const progressTasks = tasks.filter((task) => task.status === "progress").length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const items: SearchResult[] = [
    {
      id: "analytics-overview",
      category: "analytics",
      title: "Analytics overview",
      description: `${completionRate}% completion rate across ${totalTasks} tracked tasks.`,
      route: "/analytics",
    },
    {
      id: "analytics-backlog",
      category: "analytics",
      title: "Backlog focus",
      description: `${backlogTasks} tasks are still queued for attention.`,
      route: "/analytics",
    },
    {
      id: "analytics-progress",
      category: "analytics",
      title: "In-progress momentum",
      description: `${progressTasks} tasks are moving right now.`,
      route: "/analytics",
    },
    {
      id: "analytics-complete",
      category: "analytics",
      title: "Completed wins",
      description: `${completedTasks} tasks have been finished with confidence.`,
      route: "/analytics",
    },
  ];

  return items.filter((item) =>
    matchesQuery(`${item.title} ${item.description}`.toLowerCase(), query)
  );
};

const buildSearchResults = (query: string, tasks: Task[]): SearchResultGroup[] => {
  const normalizedQuery = normalizeQuery(query);

  const taskItems = tasks
    .filter((task) =>
      matchesQuery(`${task.title} ${task.priority} ${task.status}`.toLowerCase(), normalizedQuery)
    )
    .map((task) => ({
      id: `task-${task.id}`,
      category: "tasks" as const,
      title: task.title,
      description: `${task.priority} priority • ${task.status}`,
      route: "/tasks",
    }));

  const goalItemsFiltered = goalItems.filter((item) =>
    matchesQuery(`${item.title} ${item.description}`.toLowerCase(), normalizedQuery)
  );

  const analyticsItems = buildAnalyticsResults(tasks, normalizedQuery);

  const groups: SearchResultGroup[] = [
    { category: "tasks", title: "Tasks", items: taskItems },
    { category: "goals", title: "Goals", items: goalItemsFiltered },
    { category: "analytics", title: "Analytics", items: analyticsItems },
  ];

  return groups.filter((group) => group.items.length > 0);
};

const getInitialQuery = (): string => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(STORAGE_KEY) ?? "";
};

const getInitialRecentSearches = (): string[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const useSearchStore = create<SearchStore>((set, get) => ({
  query: getInitialQuery(),
  isOpen: false,
  selectedIndex: 0,
  results: buildSearchResults(getInitialQuery(), useTaskStore.getState().tasks),
  recentSearches: getInitialRecentSearches(),

  setQuery: (query) => {
    const normalized = query.trim();
    const hasQuery = normalized.length > 0;

    if (typeof window !== "undefined") {
      if (normalized.length > 0) {
        window.localStorage.setItem(STORAGE_KEY, normalized);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    set({
      query: normalized,
      isOpen: hasQuery,
      selectedIndex: 0,
      results: buildSearchResults(normalized, useTaskStore.getState().tasks),
    });
  },

  openSearch: () => set({ isOpen: true }),
  closeSearch: () => set({ isOpen: false, selectedIndex: 0 }),
  clearSearch: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }

    set({ query: "", isOpen: false, selectedIndex: 0, results: [] });
  },

  setSelectedIndex: (index) => set({ selectedIndex: index }),
  addRecentSearch: (value) => {
    const cleaned = value.trim();
    if (!cleaned) return;

    const recent = [cleaned, ...get().recentSearches.filter((item) => item !== cleaned)].slice(0, 6);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent));
    }

    set({ recentSearches: recent });
  },
  clearRecentSearches: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(RECENT_SEARCHES_KEY);
    }
    set({ recentSearches: [] });
  },
  selectNext: () => {
    const total = get().results.reduce((count, group) => count + group.items.length, 0);
    if (total === 0) return;

    set((state) => ({
      selectedIndex: (state.selectedIndex + 1) % total,
    }));
  },
  selectPrevious: () => {
    const total = get().results.reduce((count, group) => count + group.items.length, 0);
    if (total === 0) return;

    set((state) => ({
      selectedIndex: (state.selectedIndex - 1 + total) % total,
    }));
  },
}));

useTaskStore.subscribe((state) => {
  const searchStore = useSearchStore.getState();
  if (searchStore.query.length > 0) {
    useSearchStore.setState({
      results: buildSearchResults(searchStore.query, state.tasks),
    });
  }
});
