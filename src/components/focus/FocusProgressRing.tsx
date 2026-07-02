import React, { memo } from "react";

interface FocusProgressRingProps {
  progress: number;
  seconds: number;
  isCyberpunk: boolean;
  isRunning: boolean;
}

const radius = 96;
const circumference = 2 * Math.PI * radius;

const FocusProgressRing: React.FC<FocusProgressRingProps> = memo(({ progress, seconds, isCyberpunk, isRunning }) => {
  const offset = circumference - (progress / 100) * circumference;
  const ringColor = isCyberpunk ? "#22d3ee" : "#2563eb";
  const glowColor = isCyberpunk ? "rgba(34,211,238,0.35)" : "rgba(37,99,235,0.22)";

  return (
    <div className={`relative flex h-64 w-64 items-center justify-center rounded-full sm:h-72 sm:w-72 ${isCyberpunk ? "animate-[focusPulse_3s_ease-in-out_infinite]" : "shadow-[0_20px_70px_rgba(15,23,42,0.06)]"}`}>
      <div className={`absolute inset-0 rounded-full border ${isCyberpunk ? "border-cyan-400/20" : "border-slate-200"}`} />
      <svg viewBox="0 0 240 240" className="h-full w-full -rotate-90">
        <circle cx="120" cy="120" r={radius} stroke={isCyberpunk ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"} strokeWidth="14" fill="none" />
        <circle
          cx="120"
          cy="120"
          r={radius}
          stroke={ringColor}
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 12px ${glowColor})`, transition: "stroke-dashoffset 0.6s ease-in-out" }}
        />
      </svg>
      <div className={`absolute inset-5 rounded-full border ${isCyberpunk ? "border-cyan-400/20 bg-slate-950/70" : "border-slate-200/70 bg-white/90"} backdrop-blur-xl`} />
      <div className={`absolute inset-10 rounded-full border border-white/10 ${isCyberpunk ? "bg-slate-900/70" : "bg-slate-50/90"}`} />
      <div className={`relative z-10 text-center ${isCyberpunk ? "text-cyan-100" : "text-slate-900"}`}>
        <div className="text-5xl font-semibold tracking-[0.2em] sm:text-6xl">{seconds > 0 ? formatPomodoroTime(seconds) : "00:00"}</div>
        <div className={`mt-2 text-sm ${isCyberpunk ? "text-cyan-100/70" : "text-slate-500"}`}>{isRunning ? "In focus" : "Ready"}</div>
      </div>
    </div>
  );
});

FocusProgressRing.displayName = "FocusProgressRing";

export default FocusProgressRing;

function formatPomodoroTime(time: number) {
  const mins = Math.floor(time / 60);
  const secs = time % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
