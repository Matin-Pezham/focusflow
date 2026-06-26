import React from "react";
import type { LucideIcon } from "lucide-react";
import { useThemeStore } from "../../stores/useThemeStore";
import { themes } from "../../theme/theme";
import { cn } from "../../utils/cn";
import Card from "./Card";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: string;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}) => {
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={cn("text-sm font-medium", currentTheme.secondary)}>{title}</p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight">{value}</h3>
          {description ? <p className={cn("mt-2 text-sm", currentTheme.secondary)}>{description}</p> : null}
        </div>
        {Icon ? (
          <div
            className={cn(
              "rounded-2xl p-3",
              theme === "cyberpunk"
                ? "bg-cyan-400/10 text-cyan-300"
                : "bg-slate-100 text-slate-700"
            )}
          >
            <Icon size={18} />
          </div>
        ) : null}
      </div>
      {trend ? <p className={cn("mt-4 text-sm font-medium", theme === "cyberpunk" ? "text-cyan-200/80" : "text-emerald-600")}>{trend}</p> : null}
    </Card>
  );
};

export default MetricCard;
