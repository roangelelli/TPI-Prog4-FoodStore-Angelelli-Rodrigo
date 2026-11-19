import { requestRegister } from "@/features/auth/services/authService";
import { useAuthStore } from "@/features/auth/store/authStore";

/** Inicio de sesión, cierre, registro y lectura del store de autenticación, para los componentes. */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const hasRole = useAuthStore((state) => state.hasRole);

  return {
    user,
    status,
    isAuthenticated: status === "authenticated",
    isAdmin: user?.roles.includes("admin") ?? false,
    login,
    logout,
    register: requestRegister,
    hasRole,
  };
}
