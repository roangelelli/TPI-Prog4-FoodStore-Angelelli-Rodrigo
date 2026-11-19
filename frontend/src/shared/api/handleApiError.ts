import axios from "axios";

/** Mensaje del backend (campo detail) cuando es una cadena: 400, 401, 404 y 409. */
export function obtenerDetalle(error: unknown): string | null {
  if (!axios.isAxiosError(error)) return null;
  const detail = (error.response?.data as { detail?: unknown } | undefined)?.detail;
  return typeof detail === "string" ? detail : null;
}

/** Traduce cualquier error de Axios a un mensaje claro para el usuario. */
export function handleApiError(error: unknown): string {
  if (!axios.isAxiosError(error)) return "Error inesperado.";
  if (error.code === "ECONNABORTED") return "El servidor tardó demasiado en responder.";
  if (!error.response) return "No se pudo conectar con el servidor.";

  const { status } = error.response;
  switch (status) {
    case 401:
      return "La sesión venció. Es necesario iniciar sesión de nuevo.";
    case 403:
      return "No tiene permisos para realizar esta acción.";
    case 422:
      return "Los datos enviados no son válidos.";
  }
  // 400, 404, 409: el mensaje del backend es el más preciso.
  const detalle = obtenerDetalle(error);
  if (detalle) return detalle;
  if (status < 500) return "No se pudo completar la operación.";
  return "Error del servidor. Intente nuevamente más tarde.";
}

/**
 * 401 y 403 ya los atiende el interceptor de setupInterceptors.ts (sesión vencida y acceso
 * denegado). Los hooks no los vuelven a notificar.
 */
export function atiendeElInterceptor(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  const status = error.response?.status;
  return status === 401 || status === 403;
}
