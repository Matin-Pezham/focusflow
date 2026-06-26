import React from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useThemeStore } from "../../stores/useThemeStore";
import { useNotificationStore, formatNotificationTime } from "../../stores/useNotificationStore";
import { useTranslation } from "../../hooks/useTranslation";

const NotificationBell: React.FC = () => {
  const { theme } = useThemeStore();
  const { t, isRTL } = useTranslation();
  const isCyberpunk = theme === "cyberpunk";

  const { notifications, unreadCount, isOpen, toggleOpen, markAsRead, markAllAsRead, clearNotifications, close } = useNotificationStore();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        className={`relative rounded-xl border p-2.5 transition-all duration-300 ${isCyberpunk ? "border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`}
        aria-label={t("notifications.label")}
      >
        <Bell size={18} />
        {unreadCount > 0 ? (
          <span className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold ${isCyberpunk ? "bg-cyan-400 text-slate-950" : "bg-rose-500 text-white"}`}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className={`absolute ${isRTL ? "left-0" : "right-0"} z-30 mt-3 w-[min(92vw,360px)] overflow-hidden rounded-[24px] border shadow-2xl backdrop-blur-2xl ${isCyberpunk ? "border-cyan-500/20 bg-slate-950/95 text-white" : "border-slate-200 bg-white/95 text-slate-900"}`}>
          <div className={`flex items-center justify-between border-b px-4 py-3 ${isCyberpunk ? "border-cyan-500/20" : "border-slate-200"}`}>
            <div>
              <div className="text-sm font-semibold">{t("notifications.title")}</div>
              <div className={`text-xs ${isCyberpunk ? "text-cyan-200/70" : "text-slate-500"}`}>{unreadCount} {t("notifications.unread")}</div>
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

          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className={`px-4 py-8 text-center text-sm ${isCyberpunk ? "text-cyan-100/70" : "text-slate-500"}`}>
                {t("notifications.empty")}
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => markAsRead(notification.id)}
                  className={`flex w-full flex-col items-start gap-1 border-b px-4 py-3 text-left transition-colors ${isCyberpunk ? "border-cyan-500/10 hover:bg-cyan-500/10" : "border-slate-100 hover:bg-slate-50"} ${notification.read ? "opacity-70" : "opacity-100"}`}
                >
                  <div className="flex w-full items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className={`text-sm font-semibold ${isCyberpunk ? "text-cyan-100" : "text-slate-900"}`}>{notification.title}</div>
                      <div className={`mt-1 text-sm ${isCyberpunk ? "text-cyan-100/75" : "text-slate-600"}`}>{notification.message}</div>
                    </div>
                    {!notification.read ? <span className={`mt-1 h-2.5 w-2.5 rounded-full ${isCyberpunk ? "bg-cyan-400" : "bg-slate-900"}`} /> : null}
                  </div>
                  <div className={`text-xs ${isCyberpunk ? "text-cyan-200/60" : "text-slate-400"}`}>{formatNotificationTime(notification.createdAt)}</div>
                </button>
              ))
            )}
          </div>

          <div className={`px-4 py-3 text-center text-xs ${isCyberpunk ? "border-t border-cyan-500/20 bg-cyan-500/10 text-cyan-200" : "border-t border-slate-200 bg-slate-50 text-slate-500"}`}>
            <button type="button" onClick={close} className="font-medium">{t("notifications.close")}</button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NotificationBell;