import { useMemo } from "react";
import { useLanguageStore } from "../stores/useLanguageStore";
import { useThemeStore } from "../stores/useThemeStore";
import { usePomodoroStore } from "../stores/usePomodoroStore";
import { useTaskStore } from "../stores/useTaskStore";
import type { AIContext } from "./aiTypes";
import { useProductivityCoach } from "../hooks/useProductivityCoach";

export const useAIContext = (): AIContext => {
  const tasks = useTaskStore((state) => state.tasks);
  const locale = useLanguageStore((state) => state.locale);
  const theme = useThemeStore((state) => state.theme);
  const seconds = usePomodoroStore((state) => state.seconds);
  const isPomodoroRunning = usePomodoroStore((state) => state.isRunning);
  const coach = useProductivityCoach();

  return useMemo(
    () => ({
      tasks,
      totalTasks: coach.totalTasks,
      backlogTasks: coach.backlogTasks,
      progressTasks: coach.progressTasks,
      completedTasks: coach.completedTasks,
      completionRate: coach.completionRate,
      productivityScore: coach.score,
      focusSessions: coach.focusSessions,
      averageFocusTime: coach.averageFocusTime,
      streak: coach.streak,
      isPomodoroRunning,
      pomodoroSeconds: seconds,
      theme,
      locale,
      historyLength: coach.recentActivity.length,
    }),
    [tasks, coach, isPomodoroRunning, seconds, theme, locale]
  );
};
