import React from "react";
import { NavLink } from "react-router-dom";
import { BarChart3, CheckSquare, Flame, LayoutDashboard, Settings, Timer } from "lucide-react";
import { useThemeStore } from "../../stores/useThemeStore";
import { useTranslation } from "../../hooks/useTranslation";

const Sidebar: React.FC = () => {
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
    <aside className={`hidden h-screen w-[260px] flex-col border-r p-6 transition-all duration-500 lg:flex ${isCyberpunk ? "border-cyan-500/20 bg-[#0f172a]/85 shadow-[0_0_45px_rgba(34,211,238,0.10)] backdrop-blur-2xl" : "border-slate-200/80 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-8 flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br font-semibold text-white shadow-lg ${isCyberpunk ? "from-cyan-400 via-sky-500 to-violet-500 shadow-cyan-500/30" : "from-indigo-500 via-violet-500 to-pink-500"}`}>
          FF
        </div>
        <div>
          <h2 className={`font-semibold ${isCyberpunk ? "text-cyan-300" : "text-slate-900"}`}>{t("common.appName")}</h2>
          <p className={`text-xs ${isCyberpunk ? "text-cyan-100/60" : "text-slate-500"}`}>{t("nav.productivityOs")}</p>
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map(({ name, to, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${isActive ? (isCyberpunk ? "border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 shadow-[0_0_22px_rgba(34,211,238,0.14)]" : "bg-slate-100 text-slate-900") : isCyberpunk ? "text-slate-300 hover:bg-white/5 hover:text-cyan-300" : "text-slate-700 hover:bg-slate-50"}`}
              >
                <Icon size={18} />
                <span>{name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={`mb-4 rounded-2xl border p-4 ${isCyberpunk ? "border-cyan-500/20 bg-cyan-500/10" : "border-slate-200 bg-slate-50"}`}>
        <div className="mb-2 flex items-center gap-2">
          <Flame size={18} className={isCyberpunk ? "text-cyan-300" : "text-orange-500"} />
          <span className="text-sm font-medium">{t("nav.focusScore")}</span>
        </div>
        <div className="text-2xl font-semibold">86%</div>
      </div>

      <div className={`border-t pt-4 ${isCyberpunk ? "border-cyan-500/20" : "border-slate-200"}`}>
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${isCyberpunk ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-200 text-slate-800"}`}>
            M
          </div>
          <div>
            <div className={isCyberpunk ? "text-white" : "text-slate-900"}>Matin</div>
            <div className={`text-xs ${isCyberpunk ? "text-cyan-200/60" : "text-slate-500"}`}>{t("nav.profileRole")}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;