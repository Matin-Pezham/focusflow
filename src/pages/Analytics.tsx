import React from "react";
import { BarChart3, CheckCircle2, CircleDashed, Sparkles } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, MetricCard, Section } from "../components/ui";
import PageHero from "../components/ui/PageHero";
import { useThemeStore } from "../stores/useThemeStore";
import { useTaskStore } from "../stores/useTaskStore";
import { useTranslation } from "../hooks/useTranslation";

const Analytics: React.FC = () => {
  const { theme } = useThemeStore();
  const { t, isRTL } = useTranslation();
  const isCyberpunk = theme === "cyberpunk";
  const tasks = useTaskStore((state) => state.tasks);

  const totalTasks = tasks.length;
  const backlogTasks = tasks.filter((task) => task.status === "backlog").length;
  const progressTasks = tasks.filter((task) => task.status === "progress").length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const highPriorityTasks = tasks.filter((task) => task.priority === "high").length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const insightLabel = completionRate >= 80 ? t("analytics.insightStrong") : completionRate >= 50 ? t("analytics.insightSteady") : t("analytics.insightReset");
  const insightCopy = completionRate >= 80 ? t("analytics.insightStrongCopy") : completionRate >= 50 ? t("analytics.insightSteadyCopy") : t("analytics.insightResetCopy");

  const chartData = [
    { name: t("analytics.backlog"), value: backlogTasks },
    { name: t("analytics.inProgress"), value: progressTasks },
    { name: t("analytics.completed"), value: completedTasks },
  ];

  const COLORS = ["#64748b", "#f59e0b", "#22c55e"];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-2 sm:p-4 lg:p-6" dir={isRTL ? "rtl" : "ltr"}>
      <PageHero
        title={t("analytics.pageTitle")}
        description={t("analytics.pageDescription")}
        badge={t("analytics.pageBadge")}
        icon={Sparkles}
        action={
          <div className={`rounded-[20px] border px-4 py-3 text-sm ${isCyberpunk ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-200" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
            <div className="font-medium">{t("analytics.weeklyCompletion")}</div>
            <div className="mt-1 text-2xl font-semibold">{completionRate}%</div>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title={t("dashboard.totalTasks")} value={totalTasks} description={t("dashboard.totalTasksDesc")} icon={BarChart3} trend="Stable view" />
        <MetricCard title={t("dashboard.backlog")} value={backlogTasks} description={t("dashboard.backlogDesc")} icon={CircleDashed} trend="Needs a plan" />
        <MetricCard title={t("dashboard.inProgress")} value={progressTasks} description={t("dashboard.inProgressDesc")} icon={Sparkles} trend="Strong flow" />
        <MetricCard title={t("dashboard.completed")} value={completedTasks} description={t("dashboard.completedDesc")} icon={CheckCircle2} trend="Great momentum" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5 sm:p-6">
          <Section title={t("analytics.focusSummary")} description={t("analytics.focusSummaryDesc")}>
            <div className={`mt-4 rounded-[24px] border p-6 ${isCyberpunk ? "border-cyan-500/20 bg-cyan-500/5" : "border-slate-200 bg-slate-50"}`}>
              <div className={`text-2xl font-semibold ${isCyberpunk ? "text-cyan-300" : "text-slate-900"}`}>{insightLabel}</div>
              <p className={`mt-2 text-sm ${isCyberpunk ? "text-cyan-100/75" : "text-slate-600"}`}>{insightCopy}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className={`rounded-2xl border p-3 ${isCyberpunk ? "border-cyan-500/20" : "border-slate-200"}`}>
                  <div className={`text-sm ${isCyberpunk ? "text-cyan-100/70" : "text-slate-500"}`}>{t("analytics.completed")}</div>
                  <div className="mt-1 text-xl font-semibold">{completedTasks}</div>
                </div>
                <div className={`rounded-2xl border p-3 ${isCyberpunk ? "border-cyan-500/20" : "border-slate-200"}`}>
                  <div className={`text-sm ${isCyberpunk ? "text-cyan-100/70" : "text-slate-500"}`}>{t("analytics.highPriority")}</div>
                  <div className="mt-1 text-xl font-semibold">{highPriorityTasks}</div>
                </div>
                <div className={`rounded-2xl border p-3 ${isCyberpunk ? "border-cyan-500/20" : "border-slate-200"}`}>
                  <div className={`text-sm ${isCyberpunk ? "text-cyan-100/70" : "text-slate-500"}`}>{t("analytics.flowState")}</div>
                  <div className="mt-1 text-xl font-semibold">{completionRate >= 70 ? t("analytics.healthy") : t("analytics.needsCare")}</div>
                </div>
              </div>
            </div>
          </Section>
        </Card>

        <Card className="p-5 sm:p-6">
          <Section title={t("analytics.priorityMix")} description={t("analytics.priorityMixDesc")}>
            <div className="mt-4 space-y-3">
              {[
                { label: t("common.high"), value: tasks.filter((task) => task.priority === "high").length, tone: isCyberpunk ? "text-rose-300" : "text-rose-600" },
                { label: t("common.medium"), value: tasks.filter((task) => task.priority === "medium").length, tone: isCyberpunk ? "text-cyan-300" : "text-blue-600" },
                { label: t("common.low"), value: tasks.filter((task) => task.priority === "low").length, tone: isCyberpunk ? "text-slate-300" : "text-slate-600" },
              ].map((item) => (
                <div key={item.label} className={`flex items-center justify-between rounded-2xl border px-3 py-3 ${isCyberpunk ? "border-cyan-500/20 bg-cyan-500/5" : "border-slate-200 bg-slate-50"}`}>
                  <span className={`font-medium ${item.tone}`}>{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </Section>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-5 sm:p-6">
          <Section title={t("analytics.taskDistribution")} description={t("analytics.taskDistributionDesc")}>
            <div className="mt-4 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={2} dataKey="value" label>
                    {chartData.map((_, index) => <Cell key={index} fill={COLORS[index]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </Card>

        <Card className="p-5 sm:p-6">
          <Section title={t("analytics.completionInsights")} description={t("analytics.completionInsightsDesc")}>
            <div className={`rounded-3xl border p-6 ${isCyberpunk ? "border-cyan-500/20 bg-cyan-500/5" : "border-slate-200 bg-slate-50"}`}>
              <div className={`text-6xl font-semibold ${isCyberpunk ? "text-cyan-300" : "text-slate-900"}`}>{completionRate}%</div>
              <p className={`mt-3 text-sm ${isCyberpunk ? "text-cyan-100/75" : "text-slate-600"}`}>{t("analytics.completionInsightBody")}</p>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between"><span className={isCyberpunk ? "text-cyan-100/70" : "text-slate-600"}>{t("analytics.completed")}</span><span className="font-semibold">{completedTasks}</span></div>
                <div className="flex items-center justify-between"><span className={isCyberpunk ? "text-cyan-100/70" : "text-slate-600"}>{t("analytics.inProgress")}</span><span className="font-semibold">{progressTasks}</span></div>
                <div className="flex items-center justify-between"><span className={isCyberpunk ? "text-cyan-100/70" : "text-slate-600"}>{t("analytics.backlog")}</span><span className="font-semibold">{backlogTasks}</span></div>
              </div>
            </div>
          </Section>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;