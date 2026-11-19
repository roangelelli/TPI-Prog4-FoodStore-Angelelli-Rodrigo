import { create } from "zustand";
import { requestLogin, requestLogout, requestMe } from "@/features/auth/services/authService";
import type { Role, UsuarioAuth } from "@/features/auth/types/auth.types";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

interface AuthState {
  /** Datos del usuario autenticado. El token NO se guarda: vive en la cookie HttpOnly. */
  user: UsuarioAuth | null;
  /** "checking" mientras se confirma la sesión con GET /auth/me al iniciar la aplicación. */
  status: AuthStatus;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** true si el usuario tiene al menos uno de los roles indicados. */
  hasRole: (...roles: Role[]) => boolean;
}

/**
 * Store de autenticación. No usa persist: la sesión la guarda el navegador en la cookie
 * HttpOnly y el usuario se recupera con /auth/me. El estado "checking" cubre la espera, así
 * que nunca se muestran datos desactualizados ni se redirige antes de tiempo.
 */
export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  status: "checking", // al arrancar, la sesión todavía no se verificó

  // Rehidratación: GET /auth/me con la cookie. null si venció o no existe.
  checkAuth: async () => {
    try {
      const user = await requestMe();
      set({ user, status: user ? "authenticated" : "unauthenticated" });
    } catch {
      set({ user: null, status: "unauthenticated" }); // backend caído o error de red
    }
  },

  // POST /auth/token (el servidor guarda la cookie) y luego GET /auth/me.
  // Si las credenciales son incorrectas, lanza el error para que LoginPage lo muestre.
  login: async (email, password) => {
    await requestLogin({ email, password });
    await get().checkAuth();
  },

  // POST /auth/logout borra la cookie en el navegador; después se limpia el store.
  logout: async () => {
    try {
      await requestLogout();
    } finally {
      set({ user: null, status: "unauthenticated" });
    }
  },

  hasRole: (...roles) => {
    const user = get().user;
    return user !== null && user.roles.some((rol) => roles.includes(rol));
  },
}));
