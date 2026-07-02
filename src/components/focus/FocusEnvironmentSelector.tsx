import React from "react";
import { CloudRain, Coffee, Disc3, Trees } from "lucide-react";
import { useThemeStore } from "../../stores/useThemeStore";
import { useTranslation } from "../../hooks/useTranslation";

export type AmbientEnvironment = "rain" | "forest" | "coffee" | "lofi";

interface FocusEnvironmentSelectorProps {
  value: AmbientEnvironment;
  onChange: (value: AmbientEnvironment) => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
}

const environments: Array<{
  id: AmbientEnvironment;
  icon: React.ElementType;
}> = [
  { id: "rain", icon: CloudRain },
  { id: "forest", icon: Trees },
  { id: "coffee", icon: Coffee },
  { id: "lofi", icon: Disc3 },
];

const FocusEnvironmentSelector: React.FC<FocusEnvironmentSelectorProps> = ({ value, onChange, isPlaying, onPlayToggle }) => {
  const { theme } = useThemeStore();
  const { t, isRTL } = useTranslation();
  const isCyberpunk = theme === "cyberpunk";

  return (
    <div className={`rounded-3xl border p-4 sm:p-5 ${isCyberpunk ? "border-cyan-400/20 bg-slate-900/70" : "border-slate-200 bg-white/80"}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${isCyberpunk ? "text-cyan-300" : "text-slate-500"}`}>{t("focusMode.environmentLabel")}</p>
          <p className={`mt-1 text-sm ${isCyberpunk ? "text-cyan-100/70" : "text-slate-600"}`}>{t("focusMode.environmentHint")}</p>
        </div>
        <button
          type="button"
          onClick={onPlayToggle}
          className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-all ${isCyberpunk ? "bg-cyan-500/15 text-cyan-200 hover:bg-cyan-500/25" : "bg-slate-900 text-white hover:bg-slate-700"}`}
        >
          {isPlaying ? t("focusMode.stopAmbient") : t("focusMode.playAmbient")}
        </button>
      </div>

      <div className={`mt-4 grid gap-3 sm:grid-cols-2 ${isRTL ? "text-right" : "text-left"}`}>
        {environments.map((environment) => {
          const Icon = environment.icon;
          const isActive = value === environment.id;

          return (
            <button
              key={environment.id}
              type="button"
              onClick={() => onChange(environment.id)}
              className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-medium transition-all ${isActive ? (isCyberpunk ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.12)]" : "border-slate-900 bg-slate-900 text-white shadow-[0_14px_30px_rgba(15,23,42,0.08)]") : (isCyberpunk ? "border-cyan-400/10 bg-slate-950/70 text-cyan-100/80 hover:border-cyan-400/25" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300")}`}
            >
              <span className={`rounded-full p-2 ${isActive ? (isCyberpunk ? "bg-cyan-400/20 text-cyan-300" : "bg-white/20 text-white") : (isCyberpunk ? "bg-cyan-500/10 text-cyan-300" : "bg-slate-100 text-slate-600")}`}>
                <Icon size={16} />
              </span>
              <span>{t(`focusMode.environment${environment.id === "rain" ? "Rain" : environment.id === "forest" ? "Forest" : environment.id === "coffee" ? "CoffeeShop" : "LoFi"}`)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FocusEnvironmentSelector;
