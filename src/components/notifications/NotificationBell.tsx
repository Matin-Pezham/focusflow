import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCheck, CircleCheckBig, Sparkles, TimerReset, Trash2, TrendingUp } from "lucide-react";
import { useThemeStore } from "../../stores/useThemeStore";
import { useNotificationStore, formatNotificationTime, type NotificationType } from "../../stores/useNotificationStore";
import { useTranslation } from "../../hooks/useTranslation";
import { Overlay } from "../ui";

const NotificationBell: React.FC = () => {
  const { theme } = useThemeStore();
  const { t, isRTL } = useTranslation();
  const isCyberpunk = theme === "cyberpunk";
  const bellButtonRef = useRef<HTMLButtonElement | null>(null);
  const [panelPosition, setPanelPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { notifications, unreadCount, isOpen, toggleOpen, markAsRead, markAllAsRead, clearNotifications, close } = useNotificationStore();

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    if (!isOpen || isMobile) return;

    const updatePosition = () => {
      const button = bellButtonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const width = Math.min(Math.max(viewportWidth - 32, 280), 420);
      const maxLeft = Math.max(16, viewportWidth - width - 16);
      const left = Math.min(Math.max(rect.right - width, 16), maxLeft);

      setPanelPosition({
        top: Math.min(rect.bottom + 12, viewportHeight - 24),
        left,
        width,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isMobile, isOpen]);

  const notificationMeta = useMemo(() => {
    const map: Record<NotificationType, { icon: React.ReactNode; tint: string }> = {
      "task-completed": {
        icon: <CircleCheckBig size={16} />,
        tint: isCyberpunk ? "bg-cyan-500/15 text-cyan-300" : "bg-emerald-500/10 text-emerald-600",
      },
      "task-created": {
        icon: <Sparkles size={16} />,
        tint: isCyberpunk ? "bg-violet-500/15 text-violet-300" : "bg-indigo-500/10 text-indigo-600",
      },
      "task-moved": {
        icon: <TrendingUp size={16} />,
        tint: isCyberpunk ? "bg-sky-500/15 text-sky-300" : "bg-sky-500/10 text-sky-600",
      },
      "pomodoro-completed": {
        icon: <TimerReset size={16} />,
        tint: isCyberpunk ? "bg-fuchsia-500/15 text-fuchsia-300" : "bg-rose-500/10 text-rose-600",
      },
      "daily-streak": {
        icon: <Sparkles size={16} />,
        tint: isCyberpunk ? "bg-amber-500/15 text-amber-300" : "bg-amber-500/10 text-amber-600",
      },
      "productivity-milestone": {
        icon: <TrendingUp size={16} />,
        tint: isCyberpunk ? "bg-emerald-500/15 text-emerald-300" : "bg-lime-500/10 text-lime-600",
      },
    };

    return map;
  }, [isCyberpunk]);

  return (
    <div className="relative" dir={isRTL ? "rtl" : "ltr"}>
      <button
        ref={bellButtonRef}
        type="button"
        onClick={toggleOpen}
        className={`relative rounded-[14px] border p-2.5 transition-all duration-300 ${isCyberpunk ? "border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]" : "border-slate-200/80 bg-white/70 text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:bg-slate-50 hover:text-slate-900"}`}
        aria-label={t("notifications.label")}
      >
        <Bell size={18} />
        {unreadCount > 0 ? (
          <span className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold ${isCyberpunk ? "bg-cyan-400 text-slate-950" : "bg-rose-500 text-white"}`}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      <Overlay
        isOpen={isOpen}
        onClose={close}
        backdropClassName="bg-slate-950/55 backdrop-blur-xl"
        positionClassName={isMobile ? "items-end justify-center" : "items-start justify-start"}
        contentClassName="pointer-events-auto w-full"
        contentStyle={isMobile ? { left: 0, right: 0, bottom: 0, width: "100%", position: "fixed" } : panelPosition ? { top: panelPosition.top, left: panelPosition.left, width: panelPosition.width, position: "fixed" } : undefined}
      >
        <div className={`overflow-hidden border shadow-[0_26px_80px_rgba(15,23,42,0.24)] backdrop-blur-2xl ${isMobile ? "rounded-t-[28px] border-b-0" : "rounded-[28px]"} ${isCyberpunk ? "border-cyan-500/20 bg-slate-950/90 text-white" : "border-slate-200/80 bg-white/95 text-slate-900"}`}>
          <div className={`flex items-center justify-between border-b px-4 py-4 ${isCyberpunk ? "border-cyan-500/20" : "border-slate-200"}`}>
            <div>
              <div className="text-sm font-semibold">{t("notifications.title")}</div>
              <div className={`text-xs ${isCyberpunk ? "text-cyan-200/70" : "text-slate-500"}`}>
                {unreadCount} {t("notifications.unread")}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {notifications.length > 0 ? (
                <button type="button" onClick={markAllAsRead} className={`rounded-full p-2 transition-colors ${isCyberpunk ? "text-cyan-300 hover:bg-cyan-500/10" : "text-slate-500 hover:bg-slate-100"}`} aria-label={t("notifications.markAll")}>
                  <CheckCheck size={16} />
                </button>
              ) : null}
              {notifications.length > 0 ? (
                <button type="button" onClick={clearNotifications} className={`rounded-full p-2 transition-colors ${isCyberpunk ? "text-rose-300 hover:bg-rose-500/10" : "text-rose-500 hover:bg-rose-50"}`} aria-label={t("notifications.clear")}>
                  <Trash2 size={16} />
                </button>
              ) : null}
            </div>
          </div>

          <div className={`max-h-[min(70vh,460px)] overflow-y-auto px-2 py-2 ${isMobile ? "pb-4" : "pb-3"}`}>
            {notifications.length === 0 ? (
              <div className={`mx-2 rounded-[24px] border border-dashed px-4 py-10 text-center text-sm ${isCyberpunk ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-100/80" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
                <div className={`mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full ${isCyberpunk ? "bg-cyan-500/15 text-cyan-300" : "bg-slate-900/5 text-slate-700"}`}>
                  <Bell size={18} />
                </div>
                <div className="font-medium">{t("notifications.empty")}</div>
                <div className={`mt-1 text-xs ${isCyberpunk ? "text-cyan-100/70" : "text-slate-400"}`}>
                  {isRTL ? "هنوز هیچ اعلان جدیدی ندارید." : "You are all caught up for now."}
                </div>
              </div>
            ) : (
              notifications.map((notification) => {
                const meta = notificationMeta[notification.type];
                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => markAsRead(notification.id)}
                    className={`flex w-full items-start gap-3 rounded-[20px] border px-3 py-3 text-left transition-all ${isCyberpunk ? "border-cyan-500/10 hover:bg-cyan-500/10" : "border-slate-100 hover:bg-slate-50"} ${notification.read ? "opacity-70" : "opacity-100"}`}
                  >
                    <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${meta.tint}`}>
                      {meta.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`flex items-center justify-between gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <div className={`text-sm font-semibold ${isCyberpunk ? "text-cyan-100" : "text-slate-900"}`}>{notification.title}</div>
                        {!notification.read ? <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${isCyberpunk ? "bg-cyan-400" : "bg-slate-900"}`} /> : null}
                      </div>
                      <div className={`mt-1 text-sm ${isCyberpunk ? "text-cyan-100/75" : "text-slate-600"}`}>{notification.message}</div>
                      <div className={`mt-2 text-xs ${isCyberpunk ? "text-cyan-200/60" : "text-slate-400"}`}>{formatNotificationTime(notification.createdAt)}</div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className={`flex items-center justify-between px-4 py-3 text-xs ${isCyberpunk ? "border-t border-cyan-500/20 bg-cyan-500/10 text-cyan-200" : "border-t border-slate-200 bg-slate-50 text-slate-500"}`}>
            <span>{isRTL ? "اعلان‌ها" : t("notifications.label")}</span>
            <button type="button" onClick={close} className="font-medium">{t("notifications.close")}</button>
          </div>
        </div>
      </Overlay>
    </div>
  );
};

export default NotificationBell;