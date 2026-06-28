import React from "react";
import { useThemeStore } from "../../stores/useThemeStore";
import { themes } from "../../theme/theme";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const isCyberpunk = theme === "cyberpunk";

  return (
    <div className={`group relative overflow-hidden rounded-[24px] border p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_24px_80px_rgba(15,23,42,0.12)] ${currentTheme.card} ${isCyberpunk ? "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_35%)] before:opacity-80" : "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.08),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.06),transparent_37%)] before:opacity-80"} ${className}`}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default Card;