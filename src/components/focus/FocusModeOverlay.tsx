import React, { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Pause, Play, Sparkles, X } from "lucide-react";
import { useThemeStore } from "../../stores/useThemeStore";
import { useTaskStore, type Task } from "../../stores/useTaskStore";
import { usePomodoroStore, INITIAL_TIME } from "../../stores/usePomodoroStore";
import { useTranslation } from "../../hooks/useTranslation";
import Overlay from "../ui/Overlay";
import Button from "../ui/Button";
import FocusEnvironmentSelector, { type AmbientEnvironment } from "./FocusEnvironmentSelector";
import FocusProgressRing from "./FocusProgressRing";

interface FocusModeOverlayProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

const FocusModeOverlay: React.FC<FocusModeOverlayProps> = ({ task, isOpen, onClose }) => {
  const { theme } = useThemeStore();
  const { t, isRTL } = useTranslation();
  const { moveTask } = useTaskStore();
  const { seconds, isRunning, start, pause, tick } = usePomodoroStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const [completionMessage, setCompletionMessage] = useState("");
  const [hasCompleted, setHasCompleted] = useState(false);
  const [ambientEnvironment, setAmbientEnvironment] = useState<AmbientEnvironment>(() => (window.localStorage.getItem("focusflow-focus-environment") as AmbientEnvironment | null) ?? "rain");
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [quote, setQuote] = useState("");
  const [focusStats] = useState(() => ({
    today: 1,
    sessions: 3,
    streak: 2,
    minutes: 45,
  }));
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isCyberpunk = theme === "cyberpunk";

  useEffect(() => {
    if (!isOpen || !task) {
      return;
    }

    const timer = window.setInterval(() => {
      tick();
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isOpen, task, tick]);

  useEffect(() => {
    if (!isOpen) {
      setIsAmbientPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    if (!audioRef.current) {
      const audio = document.createElement("audio");
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = 0.2;
      audioRef.current = audio;
      document.body.appendChild(audio);
    }

    if (isAmbientPlaying) {
      const ambientUrl = ambientEnvironment === "rain"
        ? "https://cdn.pixabay.com/audio/2022/10/20/audio_4c7820f9af.mp3"
        : ambientEnvironment === "forest"
          ? "https://cdn.pixabay.com/audio/2022/10/20/audio_05d45d0c7b.mp3"
          : ambientEnvironment === "coffee"
            ? "https://cdn.pixabay.com/audio/2022/10/20/audio_4f5f205f9d.mp3"
            : "https://cdn.pixabay.com/audio/2022/10/20/audio_2ac19733f8.mp3";

      if (audioRef.current.src !== ambientUrl) {
        audioRef.current.src = ambientUrl;
      }
      void audioRef.current.play().catch(() => {
        setIsAmbientPlaying(false);
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [ambientEnvironment, isAmbientPlaying, isOpen]);

  useEffect(() => {
    if (!isOpen || !task) {
      return;
    }

    if (seconds === 0 && !hasCompleted) {
      setHasCompleted(true);
      setShowSuccess(true);
      setIsAmbientPlaying(false);
      setCompletionMessage(t("focusMode.completionMessage").replace("{taskTitle}", task.title));
      moveTask(task.id, "completed");
    }
  }, [hasCompleted, isOpen, moveTask, seconds, task]);

  useEffect(() => {
    if (!isOpen) {
      setShowSuccess(false);
      setCompletionMessage("");
      setHasCompleted(false);
      setIsAmbientPlaying(false);
      return;
    }

    const quotes = [
      t("focusMode.quoteOne"),
      t("focusMode.quoteTwo"),
      t("focusMode.quoteThree"),
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [isOpen, t]);

  const progress = useMemo(() => {
    if (!task) return 0;
    return ((INITIAL_TIME - seconds) / INITIAL_TIME) * 100;
  }, [seconds, task]);

  const handleComplete = () => {
    if (!task) return;
    moveTask(task.id, "completed");
    setShowSuccess(true);
    setIsAmbientPlaying(false);
    setCompletionMessage(t("focusMode.successDescription"));
    setHasCompleted(true);
  };

  const handleExit = () => {
    if (!task) {
      onClose();
      return;
    }

    if (seconds <= 0 && !hasCompleted) {
      moveTask(task.id, "completed");
    }
    setIsAmbientPlaying(false);
    onClose();
  };

  const content = (
    <div className={`relative min-h-screen w-full overflow-hidden px-3 py-4 sm:px-6 sm:py-6 lg:px-8 ${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className={`pointer-events-none absolute inset-0 ${isCyberpunk ? "bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_36%),linear-gradient(140deg,rgba(2,6,23,0.96),rgba(10,16,30,0.92))]" : "bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.16),transparent_32%),linear-gradient(135deg,rgba(248,250,252,0.97),rgba(241,245,249,0.95))]"}`} />
      <div className={`pointer-events-none absolute inset-0 ${isCyberpunk ? "bg-[radial-gradient(circle_at_10%_20%,rgba(34,211,238,0.13),transparent_24%),radial-gradient(circle_at_90%_24%,rgba(167,139,250,0.12),transparent_24%)]" : "bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.8),transparent_24%),radial-gradient(circle_at_90%_24%,rgba(129,140,248,0.08),transparent_24%)]"}`} />
      <div className={`pointer-events-none absolute inset-0 ${ambientEnvironment === "rain" ? "animate-[drift_12s_ease-in-out_infinite]" : ambientEnvironment === "forest" ? "animate-[drift_16s_ease-in-out_infinite]" : ambientEnvironment === "coffee" ? "animate-[drift_20s_ease-in-out_infinite]" : "animate-[drift_18s_ease-in-out_infinite]"}`} />

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className={`w-full max-w-5xl rounded-4xl border p-4 shadow-2xl backdrop-blur-2xl sm:p-6 lg:p-8 xl:p-10 ${isCyberpunk ? "border-cyan-400/25 bg-slate-950/70 shadow-[0_0_60px_rgba(34,211,238,0.12)]" : "border-slate-200/80 bg-white/80 shadow-[0_22px_70px_rgba(15,23,42,0.12)]"}`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className={`text-sm font-semibold uppercase tracking-[0.25em] ${isCyberpunk ? "text-cyan-300" : "text-slate-500"}`}>{t("focusMode.title")}</p>
              <h2 className={`mt-2 truncate text-xl font-semibold sm:text-2xl ${isCyberpunk ? "text-cyan-50" : "text-slate-900"}`}>{task?.title ?? t("focusMode.title")}</h2>
            </div>
            <button onClick={handleExit} className={`rounded-full p-2 transition-colors ${isCyberpunk ? "bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`} aria-label={t("focusMode.exitLabel")}>
              <X size={18} />
            </button>
          </div>

          {showSuccess ? (
            <div className={`rounded-[28px] border p-6 text-center ${isCyberpunk ? "border-cyan-400/25 bg-cyan-500/10" : "border-emerald-200 bg-emerald-50"}`}>
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full animate-pulse ${isCyberpunk ? "bg-cyan-500/20 text-cyan-300" : "bg-emerald-100 text-emerald-600"}`}>
                <CheckCircle2 size={32} />
              </div>
              <h3 className={`mt-4 text-xl font-semibold ${isCyberpunk ? "text-cyan-50" : "text-slate-900"}`}>{t("focusMode.successTitle")}</h3>
              <p className={`mt-2 text-sm ${isCyberpunk ? "text-cyan-100/80" : "text-slate-600"}`}>{completionMessage || t("focusMode.successDescription")}</p>
              <div className="mt-5 flex justify-center">
                <Button onClick={handleExit} variant="primary">{t("focusMode.continue")}</Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div className="flex flex-col items-center justify-center">
                <div className={`relative mb-3 flex h-64 w-64 items-center justify-center rounded-full border p-4 sm:h-72 sm:w-72 sm:p-6 ${isCyberpunk ? "border-cyan-400/30 bg-linear-to-br from-cyan-500/15 via-slate-950/10 to-violet-500/15 shadow-[0_0_60px_rgba(34,211,238,0.14)]" : "border-slate-200 bg-linear-to-br from-slate-50 via-white to-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"}`}>
                  <div className="pointer-events-none absolute inset-4 rounded-full border border-white/10" />
                  <FocusProgressRing progress={progress} seconds={seconds} isCyberpunk={isCyberpunk} isRunning={isRunning} />
                </div>
                <p className={`mt-2 max-w-sm text-center text-sm ${isCyberpunk ? "text-cyan-100/70" : "text-slate-600"}`}>{quote}</p>
              </div>

              <div className="space-y-3">
                <div className={`rounded-3xl border p-4 ${isCyberpunk ? "border-cyan-400/20 bg-cyan-500/10" : "border-slate-200 bg-slate-50/90"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className={`text-xs font-semibold uppercase tracking-[0.2em] ${isCyberpunk ? "text-cyan-300" : "text-slate-500"}`}>{t("focusMode.objectiveTitle")}</div>
                      <p className={`mt-1 text-base font-medium ${isCyberpunk ? "text-cyan-50" : "text-slate-900"}`}>{task?.title}</p>
                    </div>
                    <div className={`rounded-full p-2 ${isCyberpunk ? "bg-cyan-400/10 text-cyan-300" : "bg-white text-slate-700"}`}>
                      <Sparkles size={16} />
                    </div>
                  </div>
                </div>

                <div className={`rounded-3xl border p-4 ${isCyberpunk ? "border-cyan-400/20 bg-slate-900/60" : "border-slate-200 bg-white/80"}`}>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button onClick={start} variant="primary">
                      <Play size={16} />
                      {isRunning ? t("focusMode.resume") : t("focusMode.start")}
                    </Button>
                    <Button onClick={pause} variant="secondary">
                      <Pause size={16} />
                      {t("focusMode.pause")}
                    </Button>
                    <Button onClick={handleComplete} variant="secondary">
                      <CheckCircle2 size={16} />
                      {t("focusMode.complete")}
                    </Button>
                    <Button onClick={handleExit} variant="ghost">
                      <X size={16} />
                      {t("focusMode.exitLabel")}
                    </Button>
                  </div>
                </div>

                <FocusEnvironmentSelector
                  value={ambientEnvironment}
                  onChange={(value) => {
                    setAmbientEnvironment(value);
                    window.localStorage.setItem("focusflow-focus-environment", value);
                  }}
                  isPlaying={isAmbientPlaying}
                  onPlayToggle={() => setIsAmbientPlaying((value) => !value)}
                />

                <div className={`grid gap-3 rounded-3xl border p-4 text-sm sm:grid-cols-2 ${isCyberpunk ? "border-cyan-400/20 bg-slate-900/60" : "border-slate-200 bg-white/80"}`}>
                  {[
                    { label: t("focusMode.todayStats"), value: `${focusStats.today}` },
                    { label: t("focusMode.completedSessions"), value: `${focusStats.sessions}` },
                    { label: t("focusMode.currentStreak"), value: `${focusStats.streak}` },
                    { label: t("focusMode.totalFocusMinutes"), value: `${focusStats.minutes}` },
                  ].map((stat) => (
                    <div key={stat.label} className={`rounded-2xl p-3 ${isCyberpunk ? "bg-cyan-500/10" : "bg-slate-50"}`}>
                      <div className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${isCyberpunk ? "text-cyan-300" : "text-slate-500"}`}>{stat.label}</div>
                      <div className={`mt-2 text-lg font-semibold ${isCyberpunk ? "text-cyan-50" : "text-slate-900"}`}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Overlay isOpen={isOpen} onClose={handleExit} backdropClassName={isCyberpunk ? "bg-slate-950/70 backdrop-blur-2xl" : "bg-slate-950/35 backdrop-blur-xl"} contentClassName="w-full" closeOnBackdropClick={false} closeOnEscape={false} disableBodyScroll>
      {content}
    </Overlay>
  );
};

export default FocusModeOverlay;
