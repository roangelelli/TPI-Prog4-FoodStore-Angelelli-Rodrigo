import axios from "axios";

// mensaje del backend cuando detail es un texto (400, 401, 403, 404, 409)
export function obtenerDetalle(error: unknown): string | null {
  if (!axios.isAxiosError(error)) return null;
  const detail = (error.response?.data as { detail?: unknown } | undefined)?.detail;
  return typeof detail === "string" ? detail : null;
}

export function handleApiError(error: unknown): string {
  if (!axios.isAxiosError(error)) return "Error inesperado.";
  if (error.code === "ECONNABORTED") return "El servidor tardó demasiado en responder.";
  if (!error.response) return "No se pudo conectar con el servidor.";

  const { status } = error.response;
  if (status === 422) return "Los datos enviados no son válidos.";
  const detalle = obtenerDetalle(error);
  if (detalle) return detalle;
  if (status === 401) return "La sesión venció. Iniciá sesión de nuevo.";
  if (status === 403) return "No tenés permisos para hacer esto.";
  if (status >= 500) return "Error del servidor. Probá de nuevo más tarde.";
  return "No se pudo completar la operación.";
}

// el interceptor ya avisa los 401 y 403, asi no se repite el mensaje
export function atiendeElInterceptor(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  const status = error.response?.status;
  return status === 401 || status === 403;
}
