import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore, type Role } from "@/features/auth";
import LoadingState from "@/shared/components/ui/LoadingState";

interface ProtectedRouteProps {
  /** Roles que pueden entrar. Si se omite, alcanza con tener sesión. */
  allowedRoles?: Role[];
}

/**
 * Guardián de rutas. Se usa como ruta padre sin path: las rutas protegidas son sus hijas y
 * se muestran a través de <Outlet />. Orden de las verificaciones:
 *   1. la sesión se está verificando (GET /auth/me) → indicador de carga, sin redirigir;
 *   2. sin sesión → /login (guarda la pantalla pedida para volver después del login);
 *   3. sesión sin el rol permitido → /unauthorized;
 *   4. todo correcto → la ruta hija.
 * Organiza la navegación, pero no reemplaza al backend, que valida la cookie y el rol en
 * cada petición (401 y 403).
 */
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const status = useAuthStore((state) => state.status);
  const hasRole = useAuthStore((state) => state.hasRole);
  const location = useLocation();

  if (status === "checking") {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8">
        <LoadingState mensaje="Verificando sesión…" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !hasRole(...allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
