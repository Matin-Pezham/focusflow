import { useMemo, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { Search } from "lucide-react";
import { useThemeStore } from "../stores/useThemeStore";
import { useTaskStore, type TaskPriority } from "../stores/useTaskStore";
import AddTaskForm from "../components/kanban/AddTaskForm";
import TaskCard from "../components/kanban/TaskCard";
import KanbanColumn from "../components/kanban/KanbanColumn";
import { useTranslation } from "../hooks/useTranslation";

const Tasks = () => {
  const { tasks, addTask, deleteTask, moveTask } = useTaskStore();
  const { theme } = useThemeStore();
  const { t, isRTL } = useTranslation();
  const isCyberpunk = theme === "cyberpunk";
  const [query, setQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"all" | TaskPriority>("all");

  const filteredTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesQuery = normalizedQuery.length === 0 || task.title.toLowerCase().includes(normalizedQuery);
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      return matchesQuery && matchesPriority;
    });
  }, [query, priorityFilter, tasks]);

  const backlog = filteredTasks.filter((task) => task.status === "backlog");
  const progress = filteredTasks.filter((task) => task.status === "progress");
  const completed = filteredTasks.filter((task) => task.status === "completed");

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const task = tasks.find((item) => item.id === active.id);
    if (!task) return;

    const targetColumn = over.id as "backlog" | "progress" | "completed";
    if (targetColumn !== "backlog" && targetColumn !== "progress" && targetColumn !== "completed") return;

    moveTask(task.id, targetColumn);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-2 sm:p-4 lg:p-6">
      <div className={`rounded-[32px] border p-6 sm:p-8 ${isCyberpunk ? "border-cyan-500/20 bg-[#0f172a]/70 shadow-[0_0_35px_rgba(34,211,238,0.10)] backdrop-blur-2xl" : "border-slate-200/70 bg-white/80 shadow-[0_20px_55px_rgba(15,23,42,0.06)] backdrop-blur-xl"}`}>
        <h1 className={`text-3xl font-semibold tracking-tight sm:text-4xl ${isCyberpunk ? "text-cyan-300" : "text-slate-900"}`}>{t("tasks.pageTitle")}</h1>
        <p className={`mt-3 max-w-2xl text-sm sm:text-base ${isCyberpunk ? "text-cyan-100/75" : "text-slate-600"}`}>{t("tasks.pageDescription")}</p>
      </div>

      <AddTaskForm onAddTask={(title, priority) => addTask(title, priority)} />

      <div className={`flex flex-col gap-3 rounded-[28px] border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${isCyberpunk ? "border-cyan-500/20 bg-[#0f172a]/70 shadow-[0_0_20px_rgba(34,211,238,0.06)] backdrop-blur-2xl" : "border-slate-200/80 bg-white/80 shadow-[0_12px_28px_rgba(15,23,42,0.05)] backdrop-blur-xl"}`} dir={isRTL ? "rtl" : "ltr"}>
        <div className="relative flex-1">
          <Search size={18} className={`pointer-events-none absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 ${isCyberpunk ? "text-cyan-300/70" : "text-slate-400"}`} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("tasks.searchPlaceholder")}
            aria-label={t("tasks.searchLabel")}
            className={`w-full rounded-2xl border py-2.5 ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} text-sm outline-none ${isCyberpunk ? "border-cyan-500/20 bg-black/20 text-white placeholder:text-cyan-100/40 focus:border-cyan-400/50" : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-slate-300"}`}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(["all", "high", "medium", "low"] as const).map((option) => {
            const isActive = priorityFilter === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setPriorityFilter(option)}
                className={`rounded-full px-3 py-2 text-sm font-medium capitalize transition-all ${isActive ? (isCyberpunk ? "bg-cyan-400 text-slate-950" : "bg-slate-900 text-white") : (isCyberpunk ? "border border-cyan-500/20 bg-cyan-500/10 text-cyan-100/80" : "border border-slate-200 bg-white text-slate-600")}`}
              >
                {option === "all" ? t("common.allPriorities") : t(`common.${option}`)}
              </button>
            );
          })}
        </div>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid gap-6 xl:grid-cols-3">
          <KanbanColumn id="backlog" title={t("dashboard.backlog")} count={backlog.length}>
            {backlog.length === 0 ? (
              <div className={`rounded-2xl border border-dashed p-4 text-sm ${isCyberpunk ? "border-cyan-500/20 bg-cyan-500/5 text-cyan-100/70" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                {t("tasks.emptyBacklog")}
              </div>
            ) : backlog.map((task) => <TaskCard key={task.id} id={task.id} title={task.title} priority={task.priority} onDelete={() => deleteTask(task.id)} />)}
          </KanbanColumn>

          <KanbanColumn id="progress" title={t("dashboard.inProgress")} count={progress.length}>
            {progress.length === 0 ? (
              <div className={`rounded-2xl border border-dashed p-4 text-sm ${isCyberpunk ? "border-cyan-500/20 bg-cyan-500/5 text-cyan-100/70" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                {t("tasks.emptyProgress")}
              </div>
            ) : progress.map((task) => <TaskCard key={task.id} id={task.id} title={task.title} priority={task.priority} onDelete={() => deleteTask(task.id)} />)}
          </KanbanColumn>

          <KanbanColumn id="completed" title={t("dashboard.completed")} count={completed.length}>
            {completed.length === 0 ? (
              <div className={`rounded-2xl border border-dashed p-4 text-sm ${isCyberpunk ? "border-cyan-500/20 bg-cyan-500/5 text-cyan-100/70" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                {t("tasks.emptyCompleted")}
              </div>
            ) : completed.map((task) => <TaskCard key={task.id} id={task.id} title={task.title} priority={task.priority} onDelete={() => deleteTask(task.id)} />)}
          </KanbanColumn>
        </div>
      </DndContext>
    </div>
  );
};

export default Tasks;