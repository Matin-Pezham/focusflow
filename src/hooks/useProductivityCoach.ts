import { useMemo } from "react";
import { usePomodoroStore } from "../stores/usePomodoroStore";
import { useTaskStore } from "../stores/useTaskStore";
import { useTranslation } from "./useTranslation";

const HISTORY_KEY = "focusflow-productivity-history";
const ACHIEVEMENTS_KEY = "focusflow-achievements";
const DEFAULT_SESSION_MINUTES = 25;

interface HistoryEntry {
  id: string;
  type: "task-completed" | "focus-session";
  timestamp: string;
  title?: string;
  value?: number;
}

interface ProductivityCoachData {
  totalTasks: number;
  backlogTasks: number;
  progressTasks: number;
  completedTasks: number;
  completionRate: number;
  focusSessions: number;
  completedFocusSessions: number;
  averageFocusTime: number;
  streak: number;
  weeklyCompletion: number;
  dailyCompletion: number;
  activityHeat: number[];
  mostActiveDay: string;
  leastActiveDay: string;
  averageCompletionPercentage: number;
  longestUnfinishedTask: string | null;
  recentActivity: Array<{ label: string; detail: string }>;
  insights: string[];
  recommendations: string[];
  score: number;
  mood: { label: string; icon: string; accent: string; description: string };
  achievements: string[];
  weeklySummary: {
    completed: number;
    sessions: number;
    completion: number;
    bestDay: string;
    streak: number;
  };
  isEmpty: boolean;
}

const formatDayLabel = (date: Date, t: (key: string) => string) => {
  const day = date.getDay();
  const labels = [
    t("dashboard.coach.weekdaySun"),
    t("dashboard.coach.weekdayMon"),
    t("dashboard.coach.weekdayTue"),
    t("dashboard.coach.weekdayWed"),
    t("dashboard.coach.weekdayThu"),
    t("dashboard.coach.weekdayFri"),
    t("dashboard.coach.weekdaySat"),
  ];
  return labels[day];
};

const replacePlaceholders = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));

const getStoredHistory = (): HistoryEntry[] => {
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

const appendHistoryEntry = (entry: HistoryEntry) => {
  if (typeof window === "undefined") return;

  const existing = getStoredHistory();
  const next = [entry, ...existing].slice(0, 40);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
};

export const useProductivityCoach = (): ProductivityCoachData => {
  const tasks = useTaskStore((state) => state.tasks);
  const seconds = usePomodoroStore((state) => state.seconds);
  const { t } = useTranslation();

  const storedHistory = useMemo(() => getStoredHistory(), [tasks, seconds]);

  return useMemo(() => {
    const totalTasks = tasks.length;
    const backlogTasks = tasks.filter((task) => task.status === "backlog").length;
    const progressTasks = tasks.filter((task) => task.status === "progress").length;
    const completedTasks = tasks.filter((task) => task.status === "completed").length;
    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const focusSessions = storedHistory.filter((item) => item.type === "focus-session").length;
    const completedFocusSessions = focusSessions;
    const averageFocusTime = focusSessions === 0 ? 0 : Math.round((storedHistory.filter((item) => item.type === "focus-session").reduce((sum, item) => sum + (item.value ?? DEFAULT_SESSION_MINUTES), 0) / focusSessions));

    const now = new Date();
    const activityByDay = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - index));
      const dayKey = date.toDateString();
      const count = storedHistory.filter((entry) => new Date(entry.timestamp).toDateString() === dayKey).length;
      return { dayKey, count };
    });

    const activityHeat = activityByDay.map((day) => day.count);
    const mostActiveDay = activityByDay.reduce((best, current) => (current.count > best.count ? current : best), activityByDay[0]);
    const leastActiveDay = activityByDay.reduce((best, current) => (current.count < best.count ? current : best), activityByDay[0]);

    const dailyCompletion = completedTasks;
    const weeklyCompletion = completedTasks + focusSessions;

    const streak = (() => {
      let streakCount = 0;
      const seenDates = new Set<string>();
      const orderedDates = activityByDay.map((day) => day.dayKey).reverse();

      for (const day of orderedDates) {
        if (seenDates.has(day)) continue;
        const count = activityByDay.find((item) => item.dayKey === day)?.count ?? 0;
        if (count > 0) {
          streakCount += 1;
          seenDates.add(day);
        } else if (streakCount > 0) {
          break;
        }
      }

      return Math.max(1, streakCount);
    })();

    const longestUnfinishedTask = tasks
      .filter((task) => task.status !== "completed")
      .sort((a, b) => b.title.length - a.title.length)[0]?.title ?? null;

    const recentActivity = storedHistory.slice(0, 4).map((entry) => ({
      label: entry.type === "focus-session" ? t("dashboard.coach.activitySession") : t("dashboard.coach.activityTask"),
      detail: entry.type === "focus-session" ? replacePlaceholders(t("dashboard.coach.activitySessionDetail"), { minutes: entry.value ?? DEFAULT_SESSION_MINUTES }) : replacePlaceholders(t("dashboard.coach.activityTaskDetail"), { title: entry.title ?? t("dashboard.coach.activityGenericTask") }),
    }));

    const insights = [
      completionRate > 0 ? replacePlaceholders(t("dashboard.coach.insightCompletion"), { percent: completionRate }) : t("dashboard.coach.insightStart"),
      focusSessions > 0 ? replacePlaceholders(t("dashboard.coach.insightFocusSessions"), { count: focusSessions }) : t("dashboard.coach.insightNoFocus"),
      backlogTasks > 0 ? replacePlaceholders(t("dashboard.coach.insightBacklog"), { count: backlogTasks }) : t("dashboard.coach.insightMomentum"),
      longestUnfinishedTask ? replacePlaceholders(t("dashboard.coach.insightTaskHint"), { task: longestUnfinishedTask }) : t("dashboard.coach.insightNoTaskHint"),
      streak > 4 ? replacePlaceholders(t("dashboard.coach.insightStreak"), { count: streak }) : t("dashboard.coach.insightConsistency"),
    ].filter(Boolean);

    const recommendations = [
      backlogTasks > 0 ? t("dashboard.coach.recommendationFinishOldest") : null,
      progressTasks > backlogTasks ? t("dashboard.coach.recommendationReduceProgress") : null,
      focusSessions === 0 && totalTasks > 0 ? t("dashboard.coach.recommendationStartFocus") : null,
      completedTasks > 0 && streak > 2 ? t("dashboard.coach.recommendationMaintainStreak") : null,
      backlogTasks > 0 && completionRate < 70 ? t("dashboard.coach.recommendationPrioritizeBacklog") : null,
      completedTasks === 0 && totalTasks > 0 ? t("dashboard.coach.recommendationEasyTask") : null,
      completedTasks > 0 && completionRate >= 70 ? t("dashboard.coach.recommendationMomentum") : null,
      focusSessions > 0 ? t("dashboard.coach.recommendationCelebrate") : null,
    ].filter(Boolean) as string[];

    const score = Math.max(0, Math.min(100, Math.round(completionRate * 0.45 + Math.min(focusSessions * 7, 25) + Math.min(streak * 4, 20) + Math.max(0, 10 - progressTasks * 2) + Math.max(0, 10 - backlogTasks * 1.2))));

    const mood = (() => {
      if (score >= 85) return { label: t("dashboard.coach.moodPeak"), icon: "🚀", accent: "text-cyan-500", description: t("dashboard.coach.moodPeakDesc") };
      if (score >= 70) return { label: t("dashboard.coach.moodProductive"), icon: "⚡", accent: "text-emerald-500", description: t("dashboard.coach.moodProductiveDesc") };
      if (score >= 50) return { label: t("dashboard.coach.moodSteady"), icon: "🙂", accent: "text-sky-500", description: t("dashboard.coach.moodSteadyDesc") };
      if (score >= 30) return { label: t("dashboard.coach.moodLow"), icon: "😴", accent: "text-amber-500", description: t("dashboard.coach.moodLowDesc") };
      return { label: t("dashboard.coach.moodOnFire"), icon: "🔥", accent: "text-rose-500", description: t("dashboard.coach.moodOnFireDesc") };
    })();

    const storedAchievements = (() => {
      if (typeof window === "undefined") return [];
      try {
        const raw = window.localStorage.getItem(ACHIEVEMENTS_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    })();

    const achievements = storedAchievements.length > 0 ? storedAchievements.slice(0, 3) : [
      t("dashboard.coach.achievementTask"),
      t("dashboard.coach.achievementPomodoro"),
      t("dashboard.coach.achievementStreak"),
    ];

    const weeklySummary = {
      completed: completedTasks,
      sessions: focusSessions,
      completion: completionRate,
      bestDay: mostActiveDay.dayKey ? formatDayLabel(new Date(mostActiveDay.dayKey), t) : t("dashboard.coach.weekdayMon"),
      streak,
    };

    return {
      totalTasks,
      backlogTasks,
      progressTasks,
      completedTasks,
      completionRate,
      focusSessions,
      completedFocusSessions,
      averageFocusTime,
      streak,
      weeklyCompletion,
      dailyCompletion,
      activityHeat,
      mostActiveDay: mostActiveDay.dayKey ? formatDayLabel(new Date(mostActiveDay.dayKey), t) : t("dashboard.coach.weekdayMon"),
      leastActiveDay: leastActiveDay.dayKey ? formatDayLabel(new Date(leastActiveDay.dayKey), t) : t("dashboard.coach.weekdaySun"),
      averageCompletionPercentage: completionRate,
      longestUnfinishedTask,
      recentActivity,
      insights,
      recommendations,
      score,
      mood,
      achievements,
      weeklySummary,
      isEmpty: totalTasks === 0 && focusSessions === 0 && storedHistory.length === 0,
    };
  }, [tasks, storedHistory, seconds, t]);
};

export const recordProductivityEvent = (type: HistoryEntry["type"], title?: string, value?: number) => {
  appendHistoryEntry({
    id: typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now()),
    type,
    title,
    value,
    timestamp: new Date().toISOString(),
  });
};
