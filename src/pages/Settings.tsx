import React from "react";
import { Moon, Sun, Trash2, Sparkles, Download, RotateCcw } from "lucide-react";
import { Card, Button } from "../components/ui";
import { useThemeStore } from "../stores/useThemeStore";
import { useTaskStore } from "../stores/useTaskStore";
import { useTranslation } from "../hooks/useTranslation";

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { tasks, setTasks } = useTaskStore();
  const { t, isRTL } = useTranslation();
  const isCyberpunk = theme === "cyberpunk";

  const clearData = () => {
    const confirmed = window.confirm(t("settings.confirmReset"));
    if (!confirmed) return;

    localStorage.removeItem("focusflow-tasks");
    localStorage.removeItem("pomodoro-seconds");
    localStorage.removeItem("pomodoro-running");
    localStorage.removeItem("focusflow-theme");
    setTasks([]);
    window.location.reload();
  };

  const exportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      tasks,
      theme,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "focusflow-export.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-2 sm:p-4 lg:p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className={`rounded-[32px] border p-6 sm:p-8 ${isCyberpunk ? "border-cyan-500/20 bg-[#0f172a]/70 shadow-[0_0_35px_rgba(34,211,238,0.10)] backdrop-blur-2xl" : "border-slate-200/70 bg-white/80 shadow-[0_20px_55px_rgba(15,23,42,0.06)] backdrop-blur-xl"}`}>
        <h1 className={`text-3xl font-semibold tracking-tight sm:text-4xl ${isCyberpunk ? "text-cyan-300" : "text-slate-900"}`}>{t("settings.pageTitle")}</h1>
        <p className={`mt-3 text-sm sm:text-base ${isCyberpunk ? "text-cyan-100/75" : "text-slate-600"}`}>{t("settings.pageDescription")}</p>
      </div>

      <div className="grid gap-6">
        <Card className="p-5 sm:p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${isCyberpunk ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300" : "border-slate-200 bg-slate-100 text-slate-600"}`}>
                <Sparkles size={16} />
                {t("settings.appearance")}
              </div>
              <h2 className={`mt-4 text-xl font-semibold ${isCyberpunk ? "text-cyan-300" : "text-slate-900"}`}>{t("settings.themeTitle")}</h2>
              <p className={`mt-2 text-sm ${isCyberpunk ? "text-cyan-100/75" : "text-slate-600"}`}>{t("settings.themeDescription")}</p>
            </div>
            <Button onClick={toggleTheme} className={isCyberpunk ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950" : "bg-slate-900"}>
              {theme === "light" ? <><Moon size={18} />{t("settings.themeButtonLight")}</> : <><Sun size={18} />{t("settings.themeButtonCyberpunk")}</>}
            </Button>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className={`text-xl font-semibold ${isCyberpunk ? "text-cyan-300" : "text-slate-900"}`}>{t("settings.dataManagement")}</h2>
              <p className={`mt-2 text-sm ${isCyberpunk ? "text-cyan-100/75" : "text-slate-600"}`}>{t("settings.dataManagementDesc")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={exportData} className={isCyberpunk ? "bg-cyan-500/15 text-cyan-200" : "bg-slate-800"}>
                <Download size={18} />
                {t("settings.export")}
              </Button>
              <Button onClick={clearData} className="bg-rose-600 hover:bg-rose-700">
                <Trash2 size={18} />
                {t("settings.resetData")}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className={`rounded-2xl p-3 ${isCyberpunk ? "bg-cyan-500/10 text-cyan-300" : "bg-slate-100 text-slate-700"}`}>
              <RotateCcw size={18} />
            </div>
            <div>
              <h3 className={`font-semibold ${isCyberpunk ? "text-cyan-300" : "text-slate-900"}`}>{t("settings.aboutTitle")}</h3>
              <p className={`mt-1 text-sm ${isCyberpunk ? "text-cyan-100/75" : "text-slate-600"}`}>{t("settings.aboutDescription")}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;