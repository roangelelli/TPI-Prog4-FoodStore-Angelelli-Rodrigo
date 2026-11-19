import { useThemeStore } from "@/store/themeStore";

/** Botón que alterna entre modo claro y oscuro (themeStore). */
export default function ThemeToggle() {
  const darkMode = useThemeStore((state) => state.darkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-lg border border-white/60 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {darkMode ? "Modo claro" : "Modo oscuro"}
    </button>
  );
}
