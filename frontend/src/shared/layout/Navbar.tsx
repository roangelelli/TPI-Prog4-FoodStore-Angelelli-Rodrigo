import { NavLink, useNavigate } from "react-router-dom";
import Button from "@/shared/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import ThemeToggle from "./ThemeToggle";

const claseEnlace = ({ isActive }: { isActive: boolean }) =>
  isActive ? "text-white underline underline-offset-4" : "text-slate-300 hover:text-white";

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
    <nav className="bg-slate-900 text-white shadow dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <span className="text-lg font-semibold tracking-wide">Food Store</span>

        <div className="flex flex-wrap gap-5 text-sm font-medium">
          <NavLink to="/" end className={claseEnlace}>
            Catálogo
          </NavLink>
          <NavLink to="/carrito" className={claseEnlace}>
            Carrito{cantidad > 0 && ` (${cantidad})`}
          </NavLink>
          {usuario && (
            <NavLink to="/mis-pedidos" className={claseEnlace}>
              Mis pedidos
            </NavLink>
          )}
          {usuario?.role === "admin" &&
            ENLACES_ADMIN.map((enlace) => (
              <NavLink key={enlace.to} to={enlace.to} className={claseEnlace}>
                {enlace.texto}
              </NavLink>
            ))}
        </div>

        <div className="flex items-center gap-4 text-sm">
          {usuario ? (
            <>
              <span>
                <span className="font-semibold">{usuario.full_name}</span>
                <span className="ml-2 rounded-full bg-white/15 px-2 py-0.5 text-xs">
                  {usuario.role === "admin" ? "Administrador" : "Cliente"}
                </span>
              </span>
              <ThemeToggle />
              <Button variant="outline" onClick={cerrarSesion} className="border-white text-white hover:bg-white/10">
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={claseEnlace}>
                Iniciar sesión
              </NavLink>
              <NavLink to="/register" className={claseEnlace}>
                Registrarse
              </NavLink>
              <ThemeToggle />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
