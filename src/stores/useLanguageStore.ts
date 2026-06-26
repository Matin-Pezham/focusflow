import { create } from "zustand";
import type { Locale } from "../i18n";

interface LanguageStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const getInitialLocale = (): Locale => {
  if (typeof window === "undefined") return "en";

  const stored = window.localStorage.getItem("focusflow-language") as Locale | null;
  return stored === "fa" ? "fa" : "en";
};

export const useLanguageStore = create<LanguageStore>((set) => ({
  locale: getInitialLocale(),
  setLocale: (locale) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("focusflow-language", locale);
    }

    set({ locale });
  },
  toggleLocale: () =>
    set((state) => {
      const nextLocale: Locale = state.locale === "en" ? "fa" : "en";
      if (typeof window !== "undefined") {
        window.localStorage.setItem("focusflow-language", nextLocale);
      }
      return { locale: nextLocale };
    }),
}));
