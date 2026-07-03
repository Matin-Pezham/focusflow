export type Locale = "en" | "fa";

export type TaskStatus = "backlog" | "progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
}

export type ThemeType = "light" | "cyberpunk";

export interface AIContext {
  tasks: Task[];
  totalTasks: number;
  backlogTasks: number;
  progressTasks: number;
  completedTasks: number;
  completionRate: number;
  productivityScore: number;
  focusSessions: number;
  averageFocusTime: number;
  streak: number;
  isPomodoroRunning: boolean;
  pomodoroSeconds: number;
  theme: ThemeType;
  locale: Locale;
  historyLength: number;
}

export type AIActionType =
  | "createTask"
  | "deleteTask"
  | "completeTask"
  | "moveTask"
  | "startFocus"
  | "switchTheme"
  | "switchLanguage"
  | "clearCompletedTasks"
  | "openPage";

export interface AIActionCommand {
  type: AIActionType;
  payload: Record<string, string | number>;
}

export interface AIActionCard {
  title: string;
  subtitle?: string;
  status?: string;
}

export interface AIQuickAction {
  label: string;
  command: string;
}

export interface AIAssistantResponse {
  text: string;
  actionCard?: AIActionCard;
  quickActions?: AIQuickAction[];
  actionCommand?: AIActionCommand;
}
