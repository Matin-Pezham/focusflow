import React, { useMemo, useRef } from "react";
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
    clearRecentSearches,
  } = useSearchStore();

  const flattenedResults = useMemo(
    () => results.flatMap((group) => group.items.map((item) => ({ ...item, groupTitle: group.title }))),
    [results]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      selectNext();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      selectPrevious();
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selectedItem = flattenedResults[selectedIndex];
      if (selectedItem) {
        addRecentSearch(selectedItem.title);
        navigate(selectedItem.route);
        closeSearch();
      }
    }

    if (event.key === "Escape") {
      event.preventDefault();
      clearSearch();
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

  return (
    <header className="w-full" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className={`flex h-[72px] items-center gap-3 rounded-[28px] border px-4 shadow-sm transition-all duration-500 sm:px-5 ${isCyberpunk ? "border-cyan-500/20 bg-[#0f172a]/75 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-2xl" : "border-slate-200/80 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl"}`}>
          <div className="flex-1">
            <div className="relative max-w-md">
              <Search className={`pointer-events-none absolute ${isRTL ? "right-3" : "left-3"} top-1/2 h-4 w-4 -translate-y-1/2 ${isCyberpunk ? "text-cyan-300" : "text-slate-400"}`} />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={handleSearchFocus}
                onKeyDown={handleKeyDown}
                placeholder={t("topbar.searchPlaceholder")}
                className={`w-full rounded-2xl border py-2.5 ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} text-sm outline-none transition-all ${isCyberpunk ? "border-cyan-500/20 bg-black/20 text-white placeholder:text-cyan-200/40 focus:border-cyan-400/50 focus:shadow-[0_0_20px_rgba(34,211,238,0.25)]" : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-slate-300"}`}
              />
              {query ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors ${isCyberpunk ? "text-cyan-200 hover:bg-cyan-500/10" : "text-slate-400 hover:bg-slate-200"}`}
                  aria-label={t("topbar.clearLabel")}
                >
                  <X size={14} />
                </button>
              ) : null}

              <Overlay
                isOpen={isOpen}
                onClose={closeSearch}
                backdropClassName="bg-slate-950/70 backdrop-blur-xl"
                positionClassName="items-start justify-center px-4 pt-24 sm:px-6 lg:px-8"
                contentClassName="w-full max-w-2xl"
                className=""
              >
                <div className={`overflow-hidden rounded-[28px] border shadow-[0_30px_80px_rgba(15,23,42,0.35)] backdrop-blur-2xl ${isCyberpunk ? "border-cyan-500/25 bg-slate-950/85 text-white" : "border-slate-200/80 bg-white/90 text-slate-900"}`}>
                  <div className={`flex items-center justify-between border-b px-4 py-3 ${isCyberpunk ? "border-cyan-500/20" : "border-slate-200"}`}>
                    <div className="text-sm font-semibold">{t("topbar.searchPlaceholder")}</div>
                    <button type="button" onClick={closeSearch} className={`rounded-full p-2 transition-colors ${isCyberpunk ? "text-cyan-200 hover:bg-cyan-500/10" : "text-slate-500 hover:bg-slate-100"}`}>
                      <X size={16} />
                    </button>
                  </div>

                  <div className="max-h-[70vh] overflow-y-auto p-3 sm:p-4">
                    {!query && recentSearches.length > 0 ? (
                      <div className="space-y-3">
                        <div className={`text-xs font-semibold uppercase tracking-[0.25em] ${isCyberpunk ? "text-cyan-300" : "text-slate-500"}`}>Recent</div>
                        <div className="space-y-2">
                          {recentSearches.map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                setQuery(item);
                                addRecentSearch(item);
                              }}
                              className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm transition-colors ${isCyberpunk ? "bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/20" : "bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                            >
                              <Search size={14} />
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {!query && recentSearches.length === 0 ? (
                      <div className={`rounded-2xl border border-dashed px-4 py-8 text-center text-sm ${isCyberpunk ? "border-cyan-500/20 text-cyan-100/70" : "border-slate-200 text-slate-500"}`}>
                        {t("topbar.searchPlaceholder")}
                      </div>
                    ) : null}

                    {query ? (
                      <div className="space-y-3">
                        {results.map((group) => (
                          <div key={group.category}>
                            <div className={`px-2 py-2 text-xs font-semibold uppercase tracking-[0.25em] ${isCyberpunk ? "text-cyan-300" : "text-slate-500"}`}>
                              {group.category === "tasks" ? t("topbar.taskLabel") : group.category === "goals" ? t("topbar.goalLabel") : t("topbar.analyticsLabel")}
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
                                    className={`flex w-full flex-col items-start gap-1 rounded-2xl px-3 py-3 text-left transition-colors ${isActive ? (isCyberpunk ? "bg-cyan-500/15" : "bg-slate-100") : isCyberpunk ? "hover:bg-cyan-500/10" : "hover:bg-slate-50"}`}
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
                    ) : null}
                  </div>
                </div>
              </Overlay>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationBell />
            <button onClick={toggleTheme} className={`rounded-xl border p-2.5 transition-all duration-300 ${isCyberpunk ? "border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`} aria-label={t("topbar.themeLabel")}>
              {isCyberpunk ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setLocale(locale === "en" ? "fa" : "en")} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-all duration-300 ${isCyberpunk ? "border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`} aria-label={t("topbar.languageLabel")}>
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