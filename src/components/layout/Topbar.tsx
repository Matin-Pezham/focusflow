import React, { useEffect, useMemo, useRef } from "react";
import { Globe, Moon, Search, Sun, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../../stores/useThemeStore";
import { useLanguageStore } from "../../stores/useLanguageStore";
import { useTranslation } from "../../hooks/useTranslation";
import { useSearchStore } from "../../stores/useSearchStore";
import { NotificationBell } from "../notifications";
import { Overlay } from "../ui";

const Topbar: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { locale, setLocale } = useLanguageStore();
  const { t, isRTL } = useTranslation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const paletteInputRef = useRef<HTMLInputElement | null>(null);
  const isCyberpunk = theme === "cyberpunk";

  const {
    query,
    isOpen,
    selectedIndex,
    results,
    recentSearches,
    setQuery,
    openSearch,
    closeSearch,
    clearSearch,
    selectNext,
    selectPrevious,
    setSelectedIndex,
    addRecentSearch,
  } = useSearchStore();

  const flattenedResults = useMemo(
    () => results.flatMap((group) => group.items.map((item) => ({ ...item, groupTitle: group.title }))),
    [results]
  );

  useEffect(() => {
    if (!isOpen) return;

    const frame = window.requestAnimationFrame(() => paletteInputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    const handleGlobalShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
    };

    window.addEventListener("keydown", handleGlobalShortcut);
    return () => window.removeEventListener("keydown", handleGlobalShortcut);
  }, [openSearch]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      selectNext();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      selectPrevious();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selectedItem = flattenedResults[selectedIndex];
      if (selectedItem) {
        addRecentSearch(selectedItem.title);
        navigate(selectedItem.route);
        closeSearch();
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
    }
  };

  const handleSelect = (route: string, searchValue: string) => {
    addRecentSearch(searchValue);
    navigate(route);
    closeSearch();
  };

  const handleSearchFocus = () => {
    openSearch();
    requestAnimationFrame(() => searchInputRef.current?.focus());
  };

  const handleClearSearch = () => {
    clearSearch();
    requestAnimationFrame(() => searchInputRef.current?.focus());
  };

  const renderResults = () => {
    if (!query && recentSearches.length > 0) {
      return (
        <div className="space-y-3">
          <div className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${isCyberpunk ? "text-cyan-300" : "text-slate-500"}`}>
            {isRTL ? "اخرین جستجوها" : "Recent"}
          </div>
          <div className="space-y-2">
            {recentSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setQuery(item);
                  addRecentSearch(item);
                }}
                className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-sm transition-colors ${isCyberpunk ? "bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/20" : "bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
              >
                <Search size={14} />
                <span>{item}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (!query && recentSearches.length === 0) {
      return (
        <div className={`rounded-[22px] border border-dashed px-4 py-8 text-center text-sm ${isCyberpunk ? "border-cyan-500/20 text-cyan-100/70" : "border-slate-200 text-slate-500"}`}>
          {t("topbar.searchPlaceholder")}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {results.map((group) => (
          <div key={group.category}>
            <div className={`px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] ${isCyberpunk ? "text-cyan-300" : "text-slate-500"}`}>
              {group.category === "tasks" ? t("topbar.taskLabel") : group.category === "pages" ? (isRTL ? "صفحات" : "Pages") : t("topbar.analyticsLabel")}
            </div>
            <div className="space-y-2">
              {group.items.map((item) => {
                const globalIndex = flattenedResults.findIndex((result) => result.id === item.id && result.category === item.category);
                const isActive = globalIndex === selectedIndex;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(item.route, item.title)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    className={`flex w-full flex-col items-start gap-1 rounded-[18px] px-3 py-3 text-left transition-all ${isActive ? (isCyberpunk ? "bg-cyan-500/15 shadow-[0_0_24px_rgba(34,211,238,0.14)]" : "bg-slate-100") : isCyberpunk ? "hover:bg-cyan-500/10" : "hover:bg-slate-50"}`}
                  >
                    <span className={`text-sm font-medium ${isCyberpunk ? "text-white" : "text-slate-900"}`}>{item.title}</span>
                    <span className={`text-xs ${isCyberpunk ? "text-cyan-200/70" : "text-slate-500"}`}>{item.description}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <header className="w-full" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className={`flex h-[72px] items-center gap-3 rounded-[24px] border px-4 shadow-sm transition-all duration-500 sm:px-5 ${isCyberpunk ? "border-cyan-500/20 bg-[#0f172a]/75 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-2xl" : "border-white/80 bg-white/75 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl"}`}>
          <div className="flex-1">
            <div className="relative max-w-md">
              <Search className={`pointer-events-none absolute ${isRTL ? "right-3" : "left-3"} top-1/2 h-4 w-4 -translate-y-1/2 ${isCyberpunk ? "text-cyan-300" : "text-slate-400"}`} />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={handleSearchFocus}
                onClick={handleSearchFocus}
                onKeyDown={handleKeyDown}
                placeholder={t("topbar.searchPlaceholder")}
                className={`w-full rounded-[16px] border py-2.5 ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} text-sm outline-none transition-all ${isCyberpunk ? "border-cyan-500/20 bg-black/20 text-white placeholder:text-cyan-200/40 focus:border-cyan-400/50 focus:shadow-[0_0_20px_rgba(34,211,238,0.25)]" : "border-slate-200/80 bg-slate-50/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:shadow-[0_10px_30px_rgba(59,130,246,0.10)]"}`}
              />
              {query ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors ${isCyberpunk ? "text-cyan-200 hover:bg-cyan-500/10" : "text-slate-400 hover:bg-slate-200"}`}
                  aria-label={t("topbar.clearLabel")}
                >
                  <X size={14} />
                </button>
              ) : null}

              <Overlay
                isOpen={isOpen}
                onClose={closeSearch}
                backdropClassName="bg-slate-950/55 backdrop-blur-2xl"
                positionClassName="items-center justify-center px-4 py-10 sm:px-6 lg:px-8"
                contentClassName="pointer-events-auto w-full max-w-2xl"
              >
                <div className={`relative overflow-hidden rounded-[32px] border shadow-[0_30px_90px_rgba(15,23,42,0.35)] backdrop-blur-3xl ${isCyberpunk ? "border-cyan-500/25 bg-slate-950/80 text-white" : "border-white/70 bg-white/85 text-slate-900"}`}>
                  <div className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.14),transparent_28%)]`} />
                  <div className="relative p-3 sm:p-4">
                    <div className={`flex items-center gap-3 rounded-[22px] border px-3 py-3 ${isCyberpunk ? "border-cyan-500/20 bg-black/25" : "border-slate-200/80 bg-slate-50/80"}`} dir={isRTL ? "rtl" : "ltr"}>
                      <Search className={`h-4 w-4 ${isCyberpunk ? "text-cyan-300" : "text-slate-400"}`} />
                      <input
                        ref={paletteInputRef}
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t("topbar.searchPlaceholder")}
                        className={`w-full bg-transparent text-sm outline-none placeholder:text-slate-400 ${isCyberpunk ? "text-white placeholder:text-cyan-200/40" : "text-slate-900"}`}
                      />
                      {query ? (
                        <button type="button" onClick={handleClearSearch} className={`rounded-full p-1.5 transition-colors ${isCyberpunk ? "text-cyan-200 hover:bg-cyan-500/10" : "text-slate-400 hover:bg-slate-200"}`}>
                          <X size={14} />
                        </button>
                      ) : null}
                      <button type="button" onClick={closeSearch} className={`rounded-full p-1.5 transition-colors ${isCyberpunk ? "text-cyan-200 hover:bg-cyan-500/10" : "text-slate-400 hover:bg-slate-200"}`} aria-label={t("common.close")}>
                        <X size={14} />
                      </button>
                    </div>

                    <div className="mt-3 max-h-[60vh] overflow-y-auto px-1 py-1">
                      {renderResults()}
                    </div>
                  </div>
                </div>
              </Overlay>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationBell />
            <button onClick={toggleTheme} className={`rounded-[14px] border p-2.5 transition-all duration-300 ${isCyberpunk ? "border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]" : "border-slate-200/80 bg-white/70 text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:bg-slate-50 hover:text-slate-900"}`} aria-label={t("topbar.themeLabel")}>
              {isCyberpunk ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setLocale(locale === "en" ? "fa" : "en")} className={`inline-flex items-center gap-2 rounded-[14px] border px-3 py-2.5 text-sm transition-all duration-300 ${isCyberpunk ? "border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10" : "border-slate-200/80 bg-white/70 text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:bg-slate-50 hover:text-slate-900"}`} aria-label={t("topbar.languageLabel")}>
              <Globe size={16} />
              {locale === "en" ? t("common.persian") : t("common.english")}
            </button>

            <div className={`ml-1 flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className={`hidden sm:block ${isRTL ? "text-right" : "text-left"}`}>
                <div className={`text-xs ${isCyberpunk ? "text-cyan-300" : "text-slate-500"}`}>{t("topbar.welcomeBack")}</div>
                <div className={`font-semibold ${isCyberpunk ? "text-white" : "text-slate-900"}`}>Matin</div>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white ${isCyberpunk ? "from-cyan-400 via-sky-500 to-violet-500 shadow-[0_0_20px_rgba(34,211,238,0.35)]" : "from-indigo-500 via-violet-500 to-pink-500"}`}>
                M
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;