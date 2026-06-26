import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useTaskStore } from "../../stores/useTaskStore";
import { useThemeStore } from "../../stores/useThemeStore";
import { useLanguageStore } from "../../stores/useLanguageStore";
import { themes } from "../../theme/theme";
import { isRTLLocale } from "../../i18n";

const SIDEBAR_WIDTH = "260px";

const AppLayout: React.FC = () => {
  const { theme } = useThemeStore();
  const locale = useLanguageStore((state) => state.locale);
  const loadTasks = useTaskStore((state) => state.loadTasks);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const currentTheme = themes[theme];
  const isCyberpunk = theme === "cyberpunk";
  const isRTL = isRTLLocale(locale);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [isRTL, locale]);

  return (
    <div className={`relative min-h-screen overflow-hidden ${currentTheme.background} ${currentTheme.text} transition-all duration-500`} dir={isRTL ? "rtl" : "ltr"}>
      {isCyberpunk ? (
        <>
          <div className="pointer-events-none fixed right-[-120px] top-[-180px] h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[180px]" />
          <div className="pointer-events-none fixed bottom-[-220px] left-[-150px] h-[520px] w-[520px] rounded-full bg-violet-500/20 blur-[200px]" />
        </>
      ) : null}

      <div className={`fixed ${isRTL ? "right-0" : "left-0"} top-0 z-20 hidden h-screen lg:block`} style={{ width: SIDEBAR_WIDTH }}>
        <Sidebar />
      </div>

      <div className={`relative z-10 ${isRTL ? "lg:mr-[260px]" : "lg:ml-[260px]"}`}>
        <Topbar />
        <main className="min-h-screen overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mt-2">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;