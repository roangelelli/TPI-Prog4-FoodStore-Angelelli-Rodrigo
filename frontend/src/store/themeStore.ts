import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeStore {
  darkMode: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleTheme: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    { name: "theme-storage" },
  ),
);

const aplicarTema = (darkMode: boolean) =>
  document.documentElement.classList.toggle("dark", darkMode);

aplicarTema(useThemeStore.getState().darkMode);
useThemeStore.subscribe((state) => aplicarTema(state.darkMode));
