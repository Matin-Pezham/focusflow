import React from "react";
import { NavLink } from "react-router-dom";
import { BarChart3, CheckSquare, LayoutDashboard, Settings, Timer } from "lucide-react";
import { useThemeStore } from "../../stores/useThemeStore";
import { useTranslation } from "../../hooks/useTranslation";

const MobileBottomNav: React.FC = () => {
  const { theme } = useThemeStore();
  const { t, isRTL } = useTranslation();
  const isCyberpunk = theme === "cyberpunk";

  const navItems = [
    { name: t("nav.dashboard"), to: "/", Icon: LayoutDashboard },
    { name: t("nav.tasks"), to: "/tasks", Icon: CheckSquare },
    { name: t("nav.focus"), to: "/pomodoro", Icon: Timer },
    { name: t("nav.analytics"), to: "/analytics", Icon: BarChart3 },
    { name: t("nav.settings"), to: "/settings", Icon: Settings },
  ];

  return (
    <div className={`fixed inset-x-0 bottom-0 z-30 border-t backdrop-blur-2xl lg:hidden ${isCyberpunk ? "border-cyan-500/20 bg-slate-950/85" : "border-slate-200/80 bg-white/85"}`} dir={isRTL ? "rtl" : "ltr"}>
      <nav className="mx-auto flex max-w-7xl items-center justify-around px-2 py-2">
        {navItems.map(({ name, to, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => `flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-medium transition-all ${isActive ? (isCyberpunk ? "bg-cyan-500/15 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.12)]" : "bg-slate-900 text-white") : isCyberpunk ? "text-slate-300 hover:bg-white/5 hover:text-cyan-300" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
          >
            <Icon size={18} />
            <span className="mt-1 leading-none">{name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MobileBottomNav;
