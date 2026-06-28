import { CheckCircle, Clock3, Flame, ListTodo, Sparkles } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis } from "recharts";
import { Card, MetricCard, Section } from "../components/ui";
import PageHero from "../components/ui/PageHero";
import { useTranslation } from "../hooks/useTranslation";
import { useTaskStore } from "../stores/useTaskStore";
import { useThemeStore } from "../stores/useThemeStore";

const Dashboard = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const { theme } = useThemeStore();
  const { t } = useTranslation();
  const isCyberpunk = theme === "cyberpunk";

  const chartData = [
    { day: t("dashboard.chartMon"), value: 2 },
    { day: t("dashboard.chartTue"), value: 4 },
    { day: t("dashboard.chartWed"), value: 3 },
    { day: t("dashboard.chartThu"), value: 5 },
    { day: t("dashboard.chartFri"), value: 7 },
    { day: t("dashboard.chartSat"), value: 4 },
    { day: t("dashboard.chartSun"), value: 6 },
  ];

  const totalTasks = tasks.length;
  const backlogTasks = tasks.filter((task) => task.status === "backlog").length;
  const progressTasks = tasks.filter((task) => task.status === "progress").length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const streak = Math.max(1, Math.min(7, Math.round(completionRate / 15)));
  const nextMilestone = Math.max(1, 80 - completionRate);

  const taskStatusLabel = (status: string) => {
    if (status === "completed") return t("dashboard.statusCompleted");
    if (status === "progress") return t("dashboard.statusInProgress");
    return t("dashboard.statusBacklog");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-2 sm:p-4 lg:p-6">
      <PageHero
        title={t("dashboard.title")}
        description={t("dashboard.description")}
        badge={t("dashboard.heroBadge")}
        icon={Sparkles}
        action={
          <div className={`rounded-[20px] border px-4 py-3 text-sm ${isCyberpunk ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-200" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
            <div className="font-medium">{t("dashboard.completionPace")}</div>
            <div className="mt-1 text-2xl font-semibold">{completionRate}%</div>
            <div className={`mt-1 ${isCyberpunk ? "text-cyan-100/70" : "text-slate-500"}`}>{t("dashboard.completionPaceValue")} {streak} {t("common.days")} • {nextMilestone}% {t("common.milestone")}</div>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title={t("dashboard.totalTasks")} value={totalTasks} description={t("dashboard.totalTasksDesc")} icon={ListTodo} trend="+2 planned this week" />
        <MetricCard title={t("dashboard.backlog")} value={backlogTasks} description={t("dashboard.backlogDesc")} icon={Clock3} trend="Ready for prioritization" />
        <MetricCard title={t("dashboard.inProgress")} value={progressTasks} description={t("dashboard.inProgressDesc")} icon={Flame} trend="Momentum is healthy" />
        <MetricCard title={t("dashboard.completed")} value={completedTasks} description={t("dashboard.completedDesc")} icon={CheckCircle} trend="Steady completion" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="p-5 sm:p-6">
          <Section title={t("dashboard.weeklyProductivity")} description={t("dashboard.weeklyProductivityDesc")} actions={<span className={`rounded-full px-3 py-1 text-sm ${isCyberpunk ? "bg-cyan-500/10 text-cyan-300" : "bg-slate-100 text-slate-600"}`}>{t("common.score")} {completionRate}%</span>}>
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="day" stroke={isCyberpunk ? "#67e8f9" : "#64748b"} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke={isCyberpunk ? "#22d3ee" : "#2563eb"} strokeWidth={3} dot={{ r: 4, strokeWidth: 0, fill: isCyberpunk ? "#22d3ee" : "#2563eb" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </Card>

        <Card className="p-5 sm:p-6">
          <Section title={t("dashboard.recentTasks")} description={t("dashboard.recentTasksDesc")}>
            {tasks.length === 0 ? (
              <div className={`rounded-[20px] border border-dashed p-6 text-sm ${isCyberpunk ? "border-cyan-400/20 bg-cyan-500/5 text-cyan-100/70" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                <div className="font-medium">{t("dashboard.emptyTitle")}</div>
                <div className="mt-2">{t("dashboard.emptyDescription")}</div>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className={`flex items-center justify-between rounded-[18px] border px-4 py-3 transition-all duration-250 hover:-translate-y-0.5 ${isCyberpunk ? "border-cyan-500/20 bg-cyan-500/5" : "border-slate-200 bg-slate-50"}`}>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{task.title}</p>
                      <p className={`mt-1 text-xs ${isCyberpunk ? "text-cyan-100/60" : "text-slate-500"}`}>{taskStatusLabel(task.status)}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${task.status === "completed" ? "bg-emerald-500/15 text-emerald-500" : task.status === "progress" ? "bg-amber-500/15 text-amber-500" : "bg-slate-500/15 text-slate-600"}`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;