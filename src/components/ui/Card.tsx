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

  return (
    <div className={`rounded-[28px] border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] ${currentTheme.card} ${className}`}>
      {children}
    </div>
  );
};

export default Card;