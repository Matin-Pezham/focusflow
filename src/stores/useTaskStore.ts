import { create } from "zustand";
import { useNotificationStore } from "./useNotificationStore";

export type ColumnType =
  | "backlog"
  | "progress"
  | "completed";

export type TaskPriority =
  | "low"
  | "medium"
  | "high";

export interface Task {
  id: string;
  title: string;
  status: ColumnType;
  priority: TaskPriority;
}

interface TaskStore {
  tasks: Task[];

  addTask: (
    title: string,
    priority?: TaskPriority
  ) => void;

  deleteTask: (
    id: string
  ) => void;

  moveTask: (
    id: string,
    status: ColumnType
  ) => void;

  updateTaskPriority: (
    id: string,
    priority: TaskPriority
  ) => void;

  setTasks: (
    tasks: Task[]
  ) => void;

  loadTasks: () => void;
}

const normalizeTask = (
  task: Partial<Task>
): Task => ({
  id: task.id ?? crypto.randomUUID(),
  title: task.title ?? "Untitled task",
  status: task.status ?? "backlog",
  priority: task.priority ?? "medium",
});

export const useTaskStore =
  create<TaskStore>((set, get) => ({
    tasks: [],

    loadTasks: () => {
      const saved =
        localStorage.getItem(
          "focusflow-tasks"
        );

      if (!saved) return;

      try {
        const parsed = JSON.parse(saved);
        const normalized = Array.isArray(parsed)
          ? parsed.map(normalizeTask)
          : [];

        set({
          tasks: normalized,
        });
      } catch {
        localStorage.removeItem("focusflow-tasks");
      }
    },

    addTask: (title, priority = "medium") => {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        status: "backlog",
        priority,
      };

      const updated = [
        ...get().tasks,
        newTask,
      ];

      useNotificationStore.getState().addNotification({
        type: "task-created",
        title: "Task created",
        message: `${title} is now on your board.`,
      });

      localStorage.setItem(
        "focusflow-tasks",
        JSON.stringify(updated)
      );

      set({
        tasks: updated,
      });
    },

    deleteTask: (id) => {
      const updated =
        get().tasks.filter(
          (task) => task.id !== id
        );

      localStorage.setItem(
        "focusflow-tasks",
        JSON.stringify(updated)
      );

      set({
        tasks: updated,
      });
    },

    moveTask: (
      id,
      status
    ) => {
      const updated =
        get().tasks.map((task) =>
          task.id === id
            ? {
                ...task,
                status,
              }
            : task
        );

      const previousTask = get().tasks.find((item) => item.id === id);
      const nextTask = updated.find((item) => item.id === id);

      if (previousTask && nextTask && previousTask.status !== nextTask.status) {
        useNotificationStore.getState().addNotification({
          type: "task-moved",
          title: "Task moved",
          message: `${nextTask.title} moved to ${nextTask.status}.`,
        });
      }

      if (nextTask?.status === "completed") {
        useNotificationStore.getState().addNotification({
          type: "task-completed",
          title: "Task completed",
          message: `${nextTask.title} is complete.`,
        });

        const completedCount = updated.filter((task) => task.status === "completed").length;
        const today = new Date().toDateString();
        const lastStreakDate = window.localStorage.getItem("focusflow-last-streak-date");

        if (completedCount > 0 && completedCount % 3 === 0 && lastStreakDate !== today) {
          useNotificationStore.getState().addNotification({
            type: "daily-streak",
            title: "Daily streak achieved",
            message: `You completed ${completedCount} tasks today. Nice rhythm.`,
          });
          window.localStorage.setItem("focusflow-last-streak-date", today);
        }

        const milestoneCounts = [5, 10, 25, 50];
        const lastMilestoneCount = Number(window.localStorage.getItem("focusflow-last-milestone-count") ?? "0");
        if (milestoneCounts.includes(completedCount) && lastMilestoneCount !== completedCount) {
          useNotificationStore.getState().addNotification({
            type: "productivity-milestone",
            title: "Productivity milestone achieved",
            message: `You reached ${completedCount} completed tasks. Keep the momentum going.`,
          });
          window.localStorage.setItem("focusflow-last-milestone-count", String(completedCount));
        }
      }

      localStorage.setItem(
        "focusflow-tasks",
        JSON.stringify(updated)
      );

      set({
        tasks: updated,
      });
    },

    updateTaskPriority: (id, priority) => {
      const updated = get().tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              priority,
            }
          : task
      );

      localStorage.setItem(
        "focusflow-tasks",
        JSON.stringify(updated)
      );

      set({ tasks: updated });
    },

    setTasks: (tasks) => {
      const normalized = tasks.map(normalizeTask);

      localStorage.setItem(
        "focusflow-tasks",
        JSON.stringify(normalized)
      );

      set({
        tasks: normalized,
      });
    },
  }));