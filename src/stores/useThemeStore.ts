import { create } from "zustand";

type ThemeType = "light" | "cyberpunk";

interface ThemeStore {
  theme: ThemeType;

  toggleTheme: () => void;

  setTheme: (theme: ThemeType) => void;
}

export const useThemeStore =
  create<ThemeStore>((set) => ({
    theme:
      (localStorage.getItem("focusflow-theme") as ThemeType) ||
      "light",

    toggleTheme: () =>
      set((state) => {
        const nextTheme =
          state.theme === "light"
            ? "cyberpunk"
            : "light";

        localStorage.setItem(
          "focusflow-theme",
          nextTheme
        );

        return {
          theme: nextTheme,
        };
      }),

    setTheme: (theme) => {
      localStorage.setItem(
        "focusflow-theme",
        theme
      );

      set({ theme });
    },
  }));