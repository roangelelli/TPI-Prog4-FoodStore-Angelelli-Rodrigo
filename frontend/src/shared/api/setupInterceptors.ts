import type { AxiosError } from "axios";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { api } from "./axiosInstance";
import { obtenerDetalle } from "./handleApiError";

// en estas rutas el 401 es parte del flujo normal
const RUTAS_DE_AUTH = ["/auth/token", "/auth/me"];

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "";
    const esDeAuth = RUTAS_DE_AUTH.some((ruta) => url.includes(ruta));
    const desactivada = status === 400 && obtenerDetalle(error) === "Cuenta de usuario desactivada";

    // sesion vencida o cuenta desactivada: se limpia y ProtectedRoute manda al login
    if ((status === 401 && !esDeAuth) || desactivada) {
      useAuthStore.getState().limpiarSesion();
    }
    if (status === 403) {
      useNotificationStore.getState().showNotification("Acceso denegado: no tenés permisos.");
    }
    return Promise.reject(error);
  },
);
