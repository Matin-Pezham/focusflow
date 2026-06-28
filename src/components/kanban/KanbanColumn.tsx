import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { useThemeStore } from "../../stores/useThemeStore";

interface Props {
  id: string;
  title: string;
  count: number;
  children: React.ReactNode;
  isActive?: boolean;
}

const KanbanColumn: React.FC<Props> = ({ id, title, count, children, isActive = false }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const { theme } = useThemeStore();
  const isCyberpunk = theme === "cyberpunk";

  return (
    <div ref={setNodeRef} className={`min-h-[500px] rounded-[28px] border p-5 transition-all duration-300 ${isOver || isActive ? (isCyberpunk ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.12)]" : "border-indigo-300 bg-indigo-50/70 shadow-[0_16px_40px_rgba(79,70,229,0.08)]") : isCyberpunk ? "border-cyan-500/20 bg-[#0f172a]/70 backdrop-blur-2xl" : "border-slate-200/70 bg-white/75 shadow-[0_20px_60px_rgba(15,23,42,0.05)] backdrop-blur-xl"}`}>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className={`text-base font-semibold ${isCyberpunk ? "text-cyan-300" : "text-slate-900"}`}>{title}</h2>
          <p className={`mt-1 text-sm ${isCyberpunk ? "text-cyan-100/60" : "text-slate-500"}`}>{count === 1 ? "1 item" : `${count} items`}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${isCyberpunk ? "bg-cyan-500/10 text-cyan-300" : "bg-slate-100 text-slate-600"}`}>{count}</span>
      </div>

      <div className="space-y-3">{children}</div>
    </div>
  );
};

export default KanbanColumn;