import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "@/shared/ui/Logo";
import { IconoCarrito, IconoSalir } from "@/shared/ui/Icons";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import ThemeToggle from "./ThemeToggle";

const claseEnlace = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${
    isActive ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
  }`;

const ENLACES_ADMIN = [
  { to: "/admin/resumen", texto: "Resumen" },
  { to: "/admin/categorias", texto: "Categorías" },
  { to: "/admin/productos", texto: "Productos" },
  { to: "/admin/pedidos", texto: "Pedidos" },
  { to: "/admin/usuarios", texto: "Usuarios" },
];

export default function Navbar() {
  const usuario = useAuthStore((state) => state.usuario);
  const logout = useAuthStore((state) => state.logout);
  const cantidad = useCartStore((state) => state.items.reduce((suma, i) => suma + i.cantidad, 0));
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-slate-900 text-white shadow dark:bg-slate-950">
      <nav aria-label="Principal" className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
        <Link to="/" className="mr-2 flex items-center gap-2.5">
          <Logo />
          <span className="text-lg font-semibold tracking-wide">Food Store</span>
        </Link>

        <div className="flex flex-1 items-center gap-1">
          <NavLink to="/" end className={claseEnlace}>
            Catálogo
          </NavLink>
          <NavLink to="/carrito" className={claseEnlace}>
            <IconoCarrito />
            Carrito
            {cantidad > 0 && (
              <span className="rounded-full bg-brand px-1.5 text-xs font-semibold leading-5 text-white">
                {cantidad}
              </span>
            )}
          </NavLink>
          {/* el admin gestiona desde Pedidos */}
          {usuario?.role === "user" && (
            <NavLink to="/mis-pedidos" className={claseEnlace}>
              Mis pedidos
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {usuario ? (
            <>
              <div className="ml-2 hidden items-center gap-2.5 sm:flex">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-semibold"
                >
                  {usuario.full_name.charAt(0).toUpperCase()}
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold">{usuario.full_name}</p>
                  <p className="text-xs text-slate-400">{usuario.role === "admin" ? "Administrador" : "Cliente"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={cerrarSesion}
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <IconoSalir />
                <span className="hidden lg:inline">Cerrar sesión</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={claseEnlace}>
                Iniciar sesión
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-lg bg-brand px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
              >
                Registrarse
              </NavLink>
            </>
          )}
        </div>
      </nav>

      {usuario?.role === "admin" && (
        <div className="border-t border-white/10 bg-slate-800 dark:bg-slate-900">
          <nav aria-label="Administración" className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-6 py-2">
            <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Administración</span>
            {ENLACES_ADMIN.map((enlace) => (
              <NavLink key={enlace.to} to={enlace.to} className={claseEnlace}>
                {enlace.texto}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
