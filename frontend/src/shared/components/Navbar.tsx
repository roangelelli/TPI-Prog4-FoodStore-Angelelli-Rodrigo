import { NavLink, useNavigate } from "react-router-dom";
import { etiquetaRol, useAuth } from "@/features/auth";
import Button from "@/shared/components/ui/Button";
import ThemeToggle from "@/shared/components/ThemeToggle";

const claseEnlace = ({ isActive }: { isActive: boolean }) =>
  isActive ? "text-white underline underline-offset-4" : "text-slate-300 hover:text-white";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav className="bg-slate-900 text-white shadow dark:bg-slate-950">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <span className="text-lg font-semibold tracking-wide">Food Store</span>

        {user ? (
          <>
            <div className="flex gap-6 text-sm font-medium">
              <NavLink to="/categories" className={claseEnlace}>
                Categorías
              </NavLink>
              <NavLink to="/products" className={claseEnlace}>
                Productos
              </NavLink>
              <NavLink to="/ingredients" className={claseEnlace}>
                Ingredientes
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin/users" className={claseEnlace}>
                  Usuarios
                </NavLink>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span>
                <span className="font-semibold">
                  {user.nombre} {user.apellido}
                </span>
                <span className="ml-2 rounded-full bg-white/15 px-2 py-0.5 text-xs">
                  {etiquetaRol(user)}
                </span>
              </span>
              <ThemeToggle />
              <Button variant="outline" onClick={cerrarSesion} className="border-white text-white hover:bg-white/10">
                Cerrar sesión
              </Button>
            </div>
          </>
        ) : (
          <div className="flex gap-6 text-sm font-medium">
            <NavLink to="/login" className={claseEnlace}>
              Iniciar sesión
            </NavLink>
            <NavLink to="/register" className={claseEnlace}>
              Registrarse
            </NavLink>
            <ThemeToggle />
          </div>
        )}
      </div>
    </nav>
  );
}
