import React from "react";
import { useThemeStore } from "../../stores/useThemeStore";
import { themes } from "../../theme/theme";
import { cn } from "../../utils/cn";

interface SectionProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, description, actions, children, className }) => {
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {description ? <p className={cn("mt-1 text-sm", currentTheme.secondary)}>{description}</p> : null}
        </div>
        {actions ? <div>{actions}</div> : null}
      </div>
      {children}
    </section>
  );
};

export default Section;
