import React from "react";
import type { LucideIcon } from "lucide-react";
import { useThemeStore } from "../../stores/useThemeStore";
import { themes } from "../../theme/theme";

interface PageHeroProps {
  title: string;
  description: string;
  badge?: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

const PageHero: React.FC<PageHeroProps> = ({ title, description, badge, action, icon: Icon, className = "" }) => {
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const isCyberpunk = theme === "cyberpunk";

  return (
    <section className={`relative overflow-hidden rounded-[32px] border p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-8 ${isCyberpunk ? "border-cyan-400/20 bg-[#0f172a]/70" : "border-white/80 bg-white/75"} ${className}`}>
      <div className={`absolute inset-0 opacity-90 ${isCyberpunk ? "bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.16),transparent_34%)]" : "bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.10),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_34%)]"}`} />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {badge ? (
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium backdrop-blur ${isCyberpunk ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300" : "border-slate-200/80 bg-white/70 text-slate-600 shadow-[0_8px_22px_rgba(15,23,42,0.05)]"}`}>
              {Icon ? <Icon size={16} /> : null}
              {badge}
            </div>
          ) : null}
          <h1 className={`mt-4 text-3xl font-semibold tracking-tight sm:text-4xl ${currentTheme.text}`}>{title}</h1>
          <p className={`mt-3 max-w-xl text-sm leading-7 sm:text-base ${currentTheme.secondary}`}>{description}</p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </section>
  );
};

export default PageHero;
