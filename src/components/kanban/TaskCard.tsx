import React from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { useThemeStore } from "../../stores/useThemeStore";
import type { TaskPriority } from "../../stores/useTaskStore";

interface Props {
  id: string;
  title: string;
  priority: TaskPriority;
  onDelete: () => void;
}

const TaskCard: React.FC<Props> = ({ id, title, priority, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const { theme } = useThemeStore();
  const isCyberpunk = theme === "cyberpunk";

  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  const priorityMeta = {
    low: { label: "Low", className: isCyberpunk ? "bg-slate-500/15 text-slate-300" : "bg-slate-100 text-slate-600" },
    medium: { label: "Medium", className: isCyberpunk ? "bg-cyan-500/15 text-cyan-300" : "bg-blue-50 text-blue-700" },
    high: { label: "High", className: isCyberpunk ? "bg-rose-500/15 text-rose-300" : "bg-rose-50 text-rose-700" },
  }[priority];

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={`cursor-grab rounded-2xl border p-4 transition-all hover:scale-[1.01] ${isCyberpunk ? "border-cyan-500/20 bg-[#10182c]/80 shadow-[0_8px_24px_rgba(34,211,238,0.08)]" : "border-slate-200 bg-white shadow-sm"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <div className={`mt-0.5 rounded-lg p-1 ${isCyberpunk ? "bg-cyan-500/10 text-cyan-300" : "bg-slate-100 text-slate-600"}`}>
            <GripVertical size={14} />
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-medium ${isCyberpunk ? "text-slate-50" : "text-slate-800"}`}>{title}</p>
            <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${priorityMeta.className}`}>
              {priorityMeta.label}
            </span>
          </div>
        </div>
        <button onClick={(event) => { event.stopPropagation(); onDelete(); }} className={`rounded-lg p-1.5 transition-colors ${isCyberpunk ? "text-rose-300 hover:bg-rose-500/10" : "text-rose-500 hover:bg-rose-50"}`} aria-label={`Delete ${title}`}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;