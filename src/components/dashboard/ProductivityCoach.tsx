import { useEffect, useMemo, useState } from "react";
import { Bot, BrainCircuit, CheckCircle2, Sparkles, TrendingUp, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProductivityCoach } from "../../hooks/useProductivityCoach";
import { useThemeStore } from "../../stores/useThemeStore";
import { useTranslation } from "../../hooks/useTranslation";
import Card from "../ui/Card";

const CoachScoreRing = ({ score, isCyberpunk }: { score: number; isCyberpunk: boolean }) => {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg viewBox="0 0 140 140" className="h-28 w-28 -rotate-90">
        <circle cx="70" cy="70" r={radius} stroke={isCyberpunk ? "rgba(34,211,238,0.16)" : "rgba(15,23,42,0.08)"} strokeWidth="12" fill="none" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke={isCyberpunk ? "url(#coachGradient)" : "#2563eb"}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
        <defs>
          <linearGradient id="coachGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`text-2xl font-semibold ${isCyberpunk ? "text-cyan-50" : "text-slate-900"}`}>{score}</span>
        <span className={`text-[10px] font-medium uppercase tracking-[0.24em] ${isCyberpunk ? "text-cyan-100/70" : "text-slate-500"}`}>{score >= 70 ? "Peak" : "Flow"}</span>
      </div>
    </div>
  );
};

const ProductivityCoach = () => {
  const { theme } = useThemeStore();
  const { t } = useTranslation();
  const coach = useProductivityCoach();
  const navigate = useNavigate();
  const [isThinking, setIsThinking] = useState(true);
  const isCyberpunk = theme === "cyberpunk";

  useEffect(() => {
    const timer = window.setTimeout(() => setIsThinking(false), 1000);
    return () => window.clearTimeout(timer);
  }, []);

  const summaryCards = useMemo(
    () => [
      { label: t("dashboard.coach.completed"), value: `${coach.completedTasks}` },
      { label: t("dashboard.coach.focusSessions"), value: `${coach.focusSessions}` },
      { label: t("dashboard.coach.streak"), value: `${coach.streak}${t("common.days")}` },
      { label: t("dashboard.coach.avgFocus"), value: `${coach.averageFocusTime}${t("dashboard.coach.minutesLabel")}` },
    ],
    [coach.averageFocusTime, coach.completedTasks, coach.focusSessions, coach.streak, t]
  );

  return (
    <Card className={`relative overflow-hidden p-5 sm:p-6 ${isCyberpunk ? "border-cyan-400/20 bg-slate-950/70 shadow-[0_0_50px_rgba(34,211,238,0.12)]" : "border-slate-200/70 bg-white/80 shadow-[0_20px_70px_rgba(15,23,42,0.08)]"}`}>
      <div className={`pointer-events-none absolute inset-0 ${isCyberpunk ? "bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.16),transparent_28%)]" : "bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.08),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.06),transparent_28%)]"}`} />
      <div className={`pointer-events-none absolute inset-0 animate-[float_7s_ease-in-out_infinite] ${isCyberpunk ? "bg-[linear-gradient(110deg,transparent,rgba(34,211,238,0.08),transparent)]" : "bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.55),transparent)]"}`} />

      <div className="relative z-10 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${isCyberpunk ? "bg-cyan-500/15 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]" : "bg-slate-100 text-slate-700"}`}>
              <div className={`absolute inset-0 rounded-2xl animate-pulse ${isCyberpunk ? "bg-cyan-400/10" : "bg-slate-200/60"}`} />
              <Bot className="relative h-5 w-5" />
            </div>
            <div>
              <div className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${isCyberpunk ? "text-cyan-300" : "text-slate-500"}`}>{t("dashboard.coach.badge")}</div>
              <h2 className={`mt-1 text-lg font-semibold ${isCyberpunk ? "text-cyan-50" : "text-slate-900"}`}>{t("dashboard.coach.title")}</h2>
              <p className={`mt-1 text-sm ${isCyberpunk ? "text-cyan-100/70" : "text-slate-600"}`}>{t("dashboard.coach.subtitle")}</p>
            </div>
          </div>
          <div className={`rounded-full px-3 py-1 text-xs font-medium ${isCyberpunk ? "bg-cyan-500/10 text-cyan-300" : "bg-slate-100 text-slate-600"}`}>
            {isThinking ? t("dashboard.coach.generating") : t("dashboard.coach.live")}
          </div>
        </div>

        {coach.isEmpty ? (
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className={`rounded-[24px] border p-5 ${isCyberpunk ? "border-cyan-400/20 bg-cyan-500/10" : "border-slate-200 bg-slate-50"}`}>
              <div className={`mb-3 inline-flex rounded-full p-2 ${isCyberpunk ? "bg-cyan-500/10 text-cyan-300" : "bg-white text-slate-700"}`}>
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className={`text-base font-semibold ${isCyberpunk ? "text-cyan-50" : "text-slate-900"}`}>{t("dashboard.coach.emptyTitle")}</h3>
              <p className={`mt-2 text-sm ${isCyberpunk ? "text-cyan-100/70" : "text-slate-600"}`}>{t("dashboard.coach.emptyDescription")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => navigate("/tasks")} className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${isCyberpunk ? "bg-cyan-400/90 text-slate-950 hover:bg-cyan-300" : "bg-slate-900 text-white hover:bg-slate-700"}`}>
                  {t("dashboard.coach.createTask")}
                </button>
                <button onClick={() => navigate("/pomodoro")} className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${isCyberpunk ? "border-cyan-400/20 text-cyan-200 hover:bg-cyan-500/10" : "border-slate-200 text-slate-700 hover:bg-slate-100"}`}>
                  {t("dashboard.coach.startFocus")}
                </button>
              </div>
            </div>
            <div className={`rounded-[24px] border p-5 ${isCyberpunk ? "border-cyan-400/20 bg-slate-900/60" : "border-slate-200 bg-white/90"}`}>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <BrainCircuit className={`h-4 w-4 ${isCyberpunk ? "text-cyan-300" : "text-indigo-500"}`} />
                {t("dashboard.coach.emptyCoach")}
              </div>
              <p className={`mt-3 text-sm leading-6 ${isCyberpunk ? "text-cyan-100/70" : "text-slate-600"}`}>{t("dashboard.coach.emptyCoachBody")}</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
            <div className={`rounded-[24px] border p-4 sm:p-5 ${isCyberpunk ? "border-cyan-400/20 bg-slate-900/60" : "border-slate-200 bg-slate-50/80"}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${isCyberpunk ? "text-cyan-300" : "text-slate-500"}`}>{t("dashboard.coach.productivityScore")}</div>
                  <div className={`mt-2 text-sm ${isCyberpunk ? "text-cyan-100/70" : "text-slate-600"}`}>{coach.mood.description}</div>
                </div>
                <div className={`rounded-full p-2 ${isCyberpunk ? "bg-cyan-500/10 text-cyan-300" : "bg-white text-slate-700"}`}>
                  <Zap className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <CoachScoreRing score={coach.score} isCyberpunk={isCyberpunk} />
                <div className="min-w-0">
                  <div className={`flex items-center gap-2 text-base font-semibold ${isCyberpunk ? "text-cyan-50" : "text-slate-900"}`}>
                    <span>{coach.mood.icon}</span>
                    <span>{coach.mood.label}</span>
                  </div>
                  <p className={`mt-2 text-sm leading-6 ${isCyberpunk ? "text-cyan-100/70" : "text-slate-600"}`}>{t("dashboard.coach.scoreHint")}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className={`rounded-[24px] border p-4 sm:p-5 ${isCyberpunk ? "border-cyan-400/20 bg-cyan-500/10" : "border-slate-200 bg-white/85"}`}>
                <div className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${isCyberpunk ? "text-cyan-300" : "text-slate-500"}`}>{t("dashboard.coach.todayPulse")}</div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {summaryCards.map((card) => (
                    <div key={card.label} className={`rounded-[18px] border p-3 ${isCyberpunk ? "border-cyan-400/15 bg-slate-950/55" : "border-slate-200 bg-slate-50"}`}>
                      <div className={`text-[11px] uppercase tracking-[0.2em] ${isCyberpunk ? "text-cyan-100/60" : "text-slate-500"}`}>{card.label}</div>
                      <div className={`mt-2 text-lg font-semibold ${isCyberpunk ? "text-cyan-50" : "text-slate-900"}`}>{card.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`rounded-[24px] border p-4 sm:p-5 ${isCyberpunk ? "border-cyan-400/20 bg-slate-900/60" : "border-slate-200 bg-white/85"}`}>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <TrendingUp className={`h-4 w-4 ${isCyberpunk ? "text-cyan-300" : "text-indigo-500"}`} />
                  {t("dashboard.coach.insights")}
                </div>
                <div className="mt-3 space-y-2">
                  {coach.insights.map((insight, index) => (
                    <div key={`${insight}-${index}`} className={`flex items-start gap-2 rounded-[16px] border px-3 py-2 text-sm ${isCyberpunk ? "border-cyan-400/15 bg-cyan-500/5 text-cyan-100/80" : "border-slate-200 bg-slate-50 text-slate-700"}`} style={{ animationDelay: `${index * 90}ms` }}>
                      <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${isCyberpunk ? "text-cyan-300" : "text-emerald-500"}`} />
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!coach.isEmpty && (
          <div className="grid gap-4 lg:grid-cols-[1.02fr_0.98fr]">
            <div className={`rounded-[24px] border p-4 sm:p-5 ${isCyberpunk ? "border-cyan-400/20 bg-slate-900/60" : "border-slate-200 bg-white/85"}`}>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className={`h-4 w-4 ${isCyberpunk ? "text-cyan-300" : "text-indigo-500"}`} />
                {t("dashboard.coach.recommendations")}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {coach.recommendations.map((recommendation) => (
                  <span key={recommendation} className={`rounded-full px-3 py-1.5 text-sm ${isCyberpunk ? "bg-cyan-500/10 text-cyan-200" : "bg-slate-100 text-slate-700"}`}>
                    {recommendation}
                  </span>
                ))}
              </div>
            </div>

            <div className={`rounded-[24px] border p-4 sm:p-5 ${isCyberpunk ? "border-cyan-400/20 bg-slate-900/60" : "border-slate-200 bg-white/85"}`}>
              <div className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${isCyberpunk ? "text-cyan-300" : "text-slate-500"}`}>{t("dashboard.coach.weeklySummary")}</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className={`rounded-[16px] p-3 ${isCyberpunk ? "bg-cyan-500/10" : "bg-slate-50"}`}>
                  <div className={`text-[11px] uppercase tracking-[0.2em] ${isCyberpunk ? "text-cyan-100/60" : "text-slate-500"}`}>{t("dashboard.coach.summaryCompleted")}</div>
                  <div className={`mt-1 text-lg font-semibold ${isCyberpunk ? "text-cyan-50" : "text-slate-900"}`}>{coach.weeklySummary.completed}</div>
                </div>
                <div className={`rounded-[16px] p-3 ${isCyberpunk ? "bg-cyan-500/10" : "bg-slate-50"}`}>
                  <div className={`text-[11px] uppercase tracking-[0.2em] ${isCyberpunk ? "text-cyan-100/60" : "text-slate-500"}`}>{t("dashboard.coach.summarySessions")}</div>
                  <div className={`mt-1 text-lg font-semibold ${isCyberpunk ? "text-cyan-50" : "text-slate-900"}`}>{coach.weeklySummary.sessions}</div>
                </div>
                <div className={`rounded-[16px] p-3 ${isCyberpunk ? "bg-cyan-500/10" : "bg-slate-50"}`}>
                  <div className={`text-[11px] uppercase tracking-[0.2em] ${isCyberpunk ? "text-cyan-100/60" : "text-slate-500"}`}>{t("dashboard.coach.summaryCompletion")}</div>
                  <div className={`mt-1 text-lg font-semibold ${isCyberpunk ? "text-cyan-50" : "text-slate-900"}`}>{coach.weeklySummary.completion}%</div>
                </div>
                <div className={`rounded-[16px] p-3 ${isCyberpunk ? "bg-cyan-500/10" : "bg-slate-50"}`}>
                  <div className={`text-[11px] uppercase tracking-[0.2em] ${isCyberpunk ? "text-cyan-100/60" : "text-slate-500"}`}>{t("dashboard.coach.summaryBestDay")}</div>
                  <div className={`mt-1 text-lg font-semibold ${isCyberpunk ? "text-cyan-50" : "text-slate-900"}`}>{coach.weeklySummary.bestDay}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!coach.isEmpty && (
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div className={`rounded-[24px] border p-4 sm:p-5 ${isCyberpunk ? "border-cyan-400/20 bg-slate-900/60" : "border-slate-200 bg-white/85"}`}>
              <div className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${isCyberpunk ? "text-cyan-300" : "text-slate-500"}`}>{t("dashboard.coach.achievements")}</div>
              <div className="mt-3 space-y-2">
                {coach.achievements.map((achievement) => (
                  <div key={achievement} className={`flex items-center gap-2 rounded-[16px] border px-3 py-2 text-sm ${isCyberpunk ? "border-cyan-400/15 bg-cyan-500/5 text-cyan-100/80" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
                    <Sparkles className={`h-4 w-4 ${isCyberpunk ? "text-cyan-300" : "text-indigo-500"}`} />
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`rounded-[24px] border p-4 sm:p-5 ${isCyberpunk ? "border-cyan-400/20 bg-slate-900/60" : "border-slate-200 bg-white/85"}`}>
              <div className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${isCyberpunk ? "text-cyan-300" : "text-slate-500"}`}>{t("dashboard.coach.activity")}</div>
              <div className="mt-3 space-y-2">
                {coach.recentActivity.map((item) => (
                  <div key={`${item.label}-${item.detail}`} className={`rounded-[16px] border px-3 py-2 text-sm ${isCyberpunk ? "border-cyan-400/15 bg-cyan-500/5 text-cyan-100/80" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
                    <div className="font-medium">{item.label}</div>
                    <div className={`mt-1 text-xs ${isCyberpunk ? "text-cyan-100/60" : "text-slate-500"}`}>{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProductivityCoach;
