import React, { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, TimerReset } from "lucide-react";
import { Card } from "../components/ui";
import { useThemeStore } from "../stores/useThemeStore";
import { useTranslation } from "../hooks/useTranslation";
import { useNotificationStore } from "../stores/useNotificationStore";

const INITIAL_TIME = 25 * 60;

const Pomodoro: React.FC = () => {
  const { theme } = useThemeStore();
  const { t, isRTL } = useTranslation();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const isCyberpunk = theme === "cyberpunk";

  const [seconds, setSeconds] = useState(() => {
    const saved = localStorage.getItem("pomodoro-seconds");
    return saved ? Number(saved) : INITIAL_TIME;
  });

  const [isRunning, setIsRunning] = useState(() => {
    const saved = localStorage.getItem("pomodoro-running");
    return saved === "true";
  });

  useEffect(() => {
    let timer: number;
    if (isRunning && seconds > 0) {
      timer = window.setInterval(() => setSeconds((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, seconds]);

  useEffect(() => {
    localStorage.setItem("pomodoro-seconds", String(seconds));
  }, [seconds]);

  useEffect(() => {
    if (seconds === 0 && isRunning) {
      addNotification({
        type: "pomodoro-completed",
        title: "Pomodoro complete",
        message: "A focused session has finished. Great work.",
      });
      setIsRunning(false);
    }
  }, [seconds, isRunning, addNotification]);

  useEffect(() => {
    localStorage.setItem("pomodoro-running", String(isRunning));
  }, [isRunning]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        setIsRunning((value) => !value);
      }
      if (event.code === "KeyR") {
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const progress = useMemo(() => (seconds / INITIAL_TIME) * 100, [seconds]);

  const handleReset = () => {
    setSeconds(INITIAL_TIME);
    setIsRunning(false);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-2 sm:p-4 lg:p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className={`rounded-[32px] border p-6 sm:p-8 ${isCyberpunk ? "border-cyan-500/20 bg-[#0f172a]/70 shadow-[0_0_35px_rgba(34,211,238,0.10)] backdrop-blur-2xl" : "border-slate-200/70 bg-white/80 shadow-[0_20px_55px_rgba(15,23,42,0.06)] backdrop-blur-xl"}`}>
        <h1 className={`text-3xl font-semibold tracking-tight sm:text-4xl ${isCyberpunk ? "text-cyan-300" : "text-slate-900"}`}>{t("pomodoro.pageTitle")}</h1>
        <p className={`mt-3 text-sm sm:text-base ${isCyberpunk ? "text-cyan-100/75" : "text-slate-600"}`}>{t("pomodoro.pageDescription")}</p>
      </div>

      <Card className="p-6 sm:p-8">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-center lg:items-start">
            <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${isCyberpunk ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300" : "border-slate-200 bg-slate-100 text-slate-600"}`}>
              <TimerReset size={16} />
              {t("pomodoro.shortcutHint")}
            </div>
            <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-900/5 to-violet-500/15 p-6 shadow-inner">
              <div className="absolute inset-4 rounded-full border border-white/10" />
              <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(${isCyberpunk ? "#22d3ee" : "#2563eb"} ${progress}%, rgba(255,255,255,0.08) ${progress}% 100%)` }} />
              <div className={`relative z-10 rounded-full px-8 py-4 text-center ${isCyberpunk ? "bg-[#0f172a]/90 text-cyan-200" : "bg-white text-slate-900"}`}>
                <div className="text-6xl font-semibold tracking-[0.2em]">{formatTime(seconds)}</div>
                <div className={`mt-2 text-sm ${isCyberpunk ? "text-cyan-100/70" : "text-slate-500"}`}>{isRunning ? t("pomodoro.inSession") : t("pomodoro.ready")}</div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm space-y-4">
            <div className={`rounded-2xl border p-4 ${isCyberpunk ? "border-cyan-500/20 bg-cyan-500/5" : "border-slate-200 bg-slate-50"}`}>
              <div className="text-sm font-medium">{t("pomodoro.sessionStats")}</div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className={isCyberpunk ? "text-cyan-100/70" : "text-slate-600"}>{t("pomodoro.focusBlock")}</span>
                <span className="font-semibold">{t("pomodoro.focusBlockValue")}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className={isCyberpunk ? "text-cyan-100/70" : "text-slate-600"}>{t("pomodoro.shortcut")}</span>
                <span className="font-semibold">{t("pomodoro.shortcutValue")}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => setIsRunning(true)} className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold ${isCyberpunk ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.25)]" : "bg-slate-900 text-white"}`}>
                <Play size={16} />
                {t("pomodoro.start")}
              </button>
              <button onClick={() => setIsRunning(false)} className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold ${isCyberpunk ? "border-cyan-500/20 text-cyan-200 hover:bg-cyan-500/10" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}>
                <Pause size={16} />
                {t("pomodoro.pause")}
              </button>
              <button onClick={handleReset} className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold ${isCyberpunk ? "border-cyan-500/20 text-cyan-200 hover:bg-cyan-500/10" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}>
                <RotateCcw size={16} />
                {t("pomodoro.reset")}
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Pomodoro;