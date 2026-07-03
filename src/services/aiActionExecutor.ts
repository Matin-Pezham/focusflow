import { useTaskStore } from "../stores/useTaskStore";
import { usePomodoroStore } from "../stores/usePomodoroStore";
import { useThemeStore } from "../stores/useThemeStore";
import { useLanguageStore } from "../stores/useLanguageStore";
import type { AIActionCommand, AIActionCard } from "./aiTypes";

const localize = (locale: string, en: string, fa: string) => (locale === "fa" ? fa : en);

export const executeAIAction = (command: AIActionCommand, locale: string = "en"): AIActionCard | null => {
  const taskStore = useTaskStore.getState();
  const pomodoroStore = usePomodoroStore.getState();
  const themeStore = useThemeStore.getState();
  const languageStore = useLanguageStore.getState();

  switch (command.type) {
    case "createTask": {
      const title = String(command.payload.title ?? "New task").trim();
      if (!title) return null;
      taskStore.addTask(title, String(command.payload.priority || "medium") as any);
      return { title: localize(locale, "Task created", "وظیفه ایجاد شد"), subtitle: title, status: "✓" };
    }
    case "deleteTask": {
      const id = String(command.payload.id || command.payload.title || "");
      const task = id
        ? taskStore.tasks.find((item) => item.id === id || item.title === id)
        : taskStore.tasks[0];
      if (!task) return null;
      taskStore.deleteTask(task.id);
      return { title: localize(locale, "Task deleted", "وظیفه حذف شد"), subtitle: task.title, status: "✓" };
    }
    case "completeTask": {
      const id = String(command.payload.id || command.payload.title || "");
      const task = id
        ? taskStore.tasks.find((item) => item.id === id || item.title === id)
        : taskStore.tasks.find((item) => item.status === "progress") || taskStore.tasks.find((item) => item.status === "backlog");
      if (!task) return null;
      taskStore.moveTask(task.id, "completed");
      return {
        title: localize(locale, "Task completed", "وظیفه تکمیل شد"),
        subtitle: task.title,
        status: "✓",
      };
    }
    case "moveTask": {
      const taskId = String(command.payload.id || command.payload.title || "");
      const status = String(command.payload.status || "progress") as any;
      const task = taskId
        ? taskStore.tasks.find((item) => item.id === taskId || item.title === taskId)
        : taskStore.tasks.find((item) => item.status === "backlog") || taskStore.tasks[0];
      if (!task) return null;
      taskStore.moveTask(task.id, status);
      return {
        title: localize(locale, "Task moved", "وظیفه منتقل شد"),
        subtitle: localize(locale, ` ${task.title} → ${status}`, ` ${task.title} → ${status}`),
        status: "✓",
      };
    }
    case "startFocus": {
      if (!pomodoroStore.isRunning) {
        pomodoroStore.start();
        return {
          title: localize(locale, "Focus started", "تمرکز شروع شد"),
          subtitle: localize(locale, "Pomodoro session is running.", "جلسه پومودورو در حال اجرا است."),
          status: "✓",
        };
      }
      return {
        title: localize(locale, "Focus already active", "تمرکز از قبل فعال است"),
        subtitle: localize(locale, "Keep the momentum going.", "شتاب را حفظ کن."),
        status: "✓",
      };
    }
    case "switchTheme": {
      const nextTheme = String(command.payload.theme || "light") as any;
      themeStore.setTheme(nextTheme);
      return {
        title: localize(locale, "Theme switched", "پوسته تغییر کرد"),
        subtitle: localize(locale, `Theme set to ${nextTheme}.`, `پوسته به ${nextTheme} تغییر کرد.`),
        status: "✓",
      };
    }
    case "switchLanguage": {
      const nextLocale = String(command.payload.locale || "en") as any;
      languageStore.setLocale(nextLocale);
      return {
        title: localize(locale, "Language switched", "زبان تغییر کرد"),
        subtitle: localize(locale, `Language set to ${nextLocale}.`, `زبان به ${nextLocale} تنظیم شد.`),
        status: "✓",
      };
    }
    case "clearCompletedTasks": {
      const completed = taskStore.tasks.filter((task) => task.status === "completed");
      completed.forEach((task) => taskStore.deleteTask(task.id));
      return {
        title: localize(locale, "Completed cleared", "تکمیل‌شده‌ها پاک شد"),
        subtitle: localize(locale, `${completed.length} completed tasks removed.`, `${completed.length} وظیفه تکمیل‌شده حذف شد.`),
        status: "✓",
      };
    }
    default:
      return null;
  }
};
