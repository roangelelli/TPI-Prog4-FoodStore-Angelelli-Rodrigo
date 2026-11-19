import type { AxiosError } from "axios";
import { useAuthStore } from "@/features/auth";
import { useNotificationStore } from "@/store/notificationStore";
import { api } from "./api";

// Peticiones que responden 401 como parte de su funcionamiento normal: un 401 en el login
// son credenciales incorrectas (el formulario muestra su mensaje) y /auth/me ya lo maneja
// checkAuth del store.
const RUTAS_DE_AUTH = ["/auth/token", "/auth/me"];

/**
 * Interceptor de respuesta (se importa una sola vez en main.tsx):
 * - 401 (sesión vencida o inexistente): limpia la sesión del store. ProtectedRoute detecta el
 *   cambio y lleva al login. No se recarga la página: así no hay recargas en bucle.
 * - 403 (sesión válida, sin permisos): muestra una notificación de acceso denegado. No cierra
 *   la sesión ni redirige al login.
 * En ambos casos el error se propaga (Promise.reject) para que cada hook pueda reaccionar.
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "";
    const esDeAuth = RUTAS_DE_AUTH.some((ruta) => url.includes(ruta));

    if (status === 401 && !esDeAuth) {
      useAuthStore.setState({ user: null, status: "unauthenticated" });
    }
    if (status === 403) {
      useNotificationStore
        .getState()
        .showNotification("Acceso denegado: no tenés permisos para realizar esta acción.");
    }
    return Promise.reject(error);
  },
);
