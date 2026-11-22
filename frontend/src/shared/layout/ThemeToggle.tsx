import { IconoLuna, IconoSol } from "@/shared/ui/Icons";
import { useThemeStore } from "@/store/themeStore";

export default function ThemeToggle() {
  const darkMode = useThemeStore((state) => state.darkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const texto = darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={texto}
      title={texto}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {darkMode ? <IconoSol /> : <IconoLuna />}
    </button>
  );
}
