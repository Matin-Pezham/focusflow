import React from "react";
import { useThemeStore } from "../../stores/useThemeStore";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

const Button: React.FC<Props> = ({ children, className = "", variant = "primary", ...props }) => {
  const { theme } = useThemeStore();
  const isCyberpunk = theme === "cyberpunk";

  const base = "inline-flex items-center justify-center gap-2 rounded-[16px] px-4 py-2.5 font-medium transition-all duration-250 hover:-translate-y-0.5 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60";

  const variants = {
    primary: isCyberpunk
      ? "bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.22)]"
      : "bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-600 text-white shadow-[0_16px_40px_rgba(15,23,42,0.18)] hover:shadow-[0_22px_50px_rgba(59,130,246,0.24)]",
    secondary: isCyberpunk
      ? "border border-cyan-400/25 bg-cyan-500/10 text-cyan-100 backdrop-blur-xl"
      : "border border-slate-200/80 bg-white/80 text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl hover:border-slate-300 hover:bg-white",
    ghost: isCyberpunk
      ? "text-cyan-200 hover:bg-cyan-500/10"
      : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900",
    danger: isCyberpunk
      ? "bg-rose-600 text-white shadow-[0_10px_24px_rgba(244,63,94,0.2)] hover:bg-rose-700"
      : "bg-rose-50 text-rose-700 border border-rose-200 shadow-[0_10px_24px_rgba(244,63,94,0.12)] hover:bg-rose-100",
  };

  return (
    <button {...props} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default Button;