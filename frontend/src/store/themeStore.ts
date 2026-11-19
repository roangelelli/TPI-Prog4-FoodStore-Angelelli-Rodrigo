import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeStore {
  darkMode: boolean;
  toggleTheme: () => void;
}

/** Tema visual. Es una preferencia de interfaz, por eso sí se persiste en localStorage. */
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleTheme: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    { name: "theme-storage" }, // clave en localStorage
  ),
);

// Tailwind aplica la variante dark: cuando <html> tiene la clase "dark" (ver index.css).
// El store es la única fuente de verdad: cada cambio, y el valor restaurado al cargar la
// página, se reflejan en esa clase.
const aplicarTema = (darkMode: boolean) =>
  document.documentElement.classList.toggle("dark", darkMode);

aplicarTema(useThemeStore.getState().darkMode);
useThemeStore.subscribe((state) => aplicarTema(state.darkMode));
