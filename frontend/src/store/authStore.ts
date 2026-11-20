import { create } from "zustand";
import { persist } from "zustand/middleware";
import { requestLogin, requestLogout, requestMe } from "@/features/auth/api/auth";
import type { Usuario } from "@/features/auth/types/auth.types";

interface AuthState {
  usuario: Usuario | null;
  cargando: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  limpiarSesion: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      cargando: true,

      // pregunta a /auth/me si la cookie sigue valida
      checkSession: async () => {
        try {
          const usuario = await requestMe();
          set({ usuario, cargando: false });
        } catch {
          set({ usuario: null, cargando: false });
        }
      },

      login: async (username, password) => {
        await requestLogin(username, password);
        const usuario = await requestMe();
        set({ usuario, cargando: false });
      },

      logout: async () => {
        try {
          await requestLogout();
        } finally {
          set({ usuario: null });
        }
      },

      limpiarSesion: () => set({ usuario: null }),
    }),
    {
      name: "auth-storage",
      // solo se guarda el usuario, nunca el token
      partialize: (state) => ({ usuario: state.usuario }),
    },
  ),
);
