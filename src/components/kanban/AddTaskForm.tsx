import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useThemeStore } from "../../stores/useThemeStore";
import type { TaskPriority } from "../../stores/useTaskStore";
import { useTranslation } from "../../hooks/useTranslation";

interface Props {
  onAddTask: (title: string, priority: TaskPriority) => void;
}

const AddTaskForm: React.FC<Props> = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const { theme } = useThemeStore();
  const { t, isRTL } = useTranslation();
  const isCyberpunk = theme === "cyberpunk";

  const handleSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    onAddTask(trimmed, priority);
    setTitle("");
    setPriority("medium");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`mb-8 flex flex-col gap-3 rounded-[28px] border p-4 sm:flex-row sm:items-center sm:p-5 ${isCyberpunk ? "border-cyan-500/20 bg-[#0f172a]/70 shadow-[0_0_25px_rgba(34,211,238,0.08)] backdrop-blur-2xl" : "border-slate-200/70 bg-white/80 shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t("tasks.addTaskPlaceholder")}
        aria-label={t("tasks.addTaskButton")}
        className={`flex-1 rounded-[16px] border px-4 py-3 text-sm outline-none transition-all ${isCyberpunk ? "border-cyan-500/20 bg-black/20 text-white placeholder:text-cyan-100/40 focus:border-cyan-400/50 focus:shadow-[0_0_16px_rgba(34,211,238,0.2)]" : "border-slate-200/80 bg-slate-50/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:shadow-[0_10px_30px_rgba(59,130,246,0.10)]"}`}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as TaskPriority)}
        aria-label={t("tasks.priorityLabel")}
        className={`rounded-[16px] border px-3 py-3 text-sm outline-none ${isCyberpunk ? "border-cyan-500/20 bg-black/20 text-white" : "border-slate-200/80 bg-slate-50/80 text-slate-900"}`}
      >
        <option value="low">{t("tasks.priorityLow")}</option>
        <option value="medium">{t("tasks.priorityMedium")}</option>
        <option value="high">{t("tasks.priorityHigh")}</option>
      </select>
      <button
        type="submit"
        className={`inline-flex items-center justify-center gap-2 rounded-[16px] px-5 py-3 text-sm font-semibold transition-all ${isCyberpunk ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:scale-[1.01]" : "bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-600 text-white shadow-[0_16px_40px_rgba(15,23,42,0.16)] hover:scale-[1.01]"}`}
      >
        <Plus size={18} />
        {t("tasks.addTaskButton")}
      </button>
    </form>
  );
};

export default AddTaskForm;