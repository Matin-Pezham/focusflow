import React, { useEffect, useMemo } from "react";
import { Pause, Play, RotateCcw, TimerReset } from "lucide-react";
import { Card, Button } from "../components/ui";
import PageHero from "../components/ui/PageHero";
import { useThemeStore } from "../stores/useThemeStore";
import { useTranslation } from "../hooks/useTranslation";
import { usePomodoroStore, formatPomodoroTime, INITIAL_TIME } from "../stores/usePomodoroStore";

const Pomodoro: React.FC = () => {
  const { theme } = useThemeStore();
  const { t, isRTL } = useTranslation();
  const isCyberpunk = theme === "cyberpunk";
  const { seconds, isRunning, start, pause, reset, toggle, tick } = usePomodoroStore();

  useEffect(() => {
    const timer = window.setInterval(() => {
      tick();
    }, 1000);

    return () => window.clearInterval(timer);
  }, [tick]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        toggle();
      }
      if (event.code === "KeyR") {
        reset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const progress = useMemo(() => (seconds / INITIAL_TIME) * 100, [seconds]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-2 sm:p-4 lg:p-6" dir={isRTL ? "rtl" : "ltr"}>
      <PageHero title={t("pomodoro.pageTitle")} description={t("pomodoro.pageDescription")} badge={t("pomodoro.shortcutHint")} icon={TimerReset} />

      <Card className="p-6 sm:p-8">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-center lg:items-start">
            <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${isCyberpunk ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300" : "border-slate-200 bg-slate-100 text-slate-600"}`}>
              <TimerReset size={16} />
              {t("pomodoro.shortcutHint")}
            </div>
            <div className={`relative flex h-64 w-64 items-center justify-center rounded-full border p-6 shadow-inner ${isCyberpunk ? "border-cyan-400/20 bg-linear-to-br from-cyan-500/15 via-slate-900/5 to-violet-500/15" : "border-slate-200 bg-linear-to-br from-slate-50 via-white to-slate-100"}`}>
              <div className="absolute inset-4 rounded-full border border-white/10" />
              <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(${isCyberpunk ? "#22d3ee" : "#2563eb"} ${progress}%, rgba(255,255,255,0.08) ${progress}% 100%)` }} />
              <div className={`relative z-10 rounded-full px-8 py-4 text-center shadow-[0_20px_50px_rgba(15,23,42,0.12)] ${isCyberpunk ? "bg-[#0f172a]/90 text-cyan-200" : "bg-white text-slate-900"}`}>
                <div className="text-6xl font-semibold tracking-[0.2em]">{formatPomodoroTime(seconds)}</div>
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
              <Button onClick={start} variant="primary">
                <Play size={16} />
                {t("pomodoro.start")}
              </Button>
              <Button onClick={pause} variant="secondary">
                <Pause size={16} />
                {t("pomodoro.pause")}
              </Button>
              <Button onClick={reset} variant="secondary">
                <RotateCcw size={16} />
                {t("pomodoro.reset")}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Pomodoro;