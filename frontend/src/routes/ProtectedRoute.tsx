import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { Role } from "@/features/auth/types/auth.types";
import Skeleton from "@/shared/components/Skeleton";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const usuario = useAuthStore((state) => state.usuario);
  const cargando = useAuthStore((state) => state.cargando);
  const location = useLocation();

  // mientras checkSession confirma la sesion no se redirige
  if (cargando) {
    return (
      <div role="status" className="space-y-3">
        <p className="text-sm text-secondary">Verificando sesión...</p>
        <Skeleton />
      </div>
    );
  }
  if (!usuario) return <Navigate to="/login" replace state={{ from: location }} />;
  if (allowedRoles && !allowedRoles.includes(usuario.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
}
