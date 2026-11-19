import axios, { type InternalAxiosRequestConfig } from "axios";

/**
 * Instancia única de Axios para toda la aplicación (antes axiosInstance.ts).
 * - baseURL: la raíz de la API (se cambia con la variable VITE_API_URL).
 * - withCredentials: el navegador guarda y envía la cookie HttpOnly access_token entre
 *   orígenes distintos (frontend :5173, backend :8000).
 *
 * Este archivo no importa ningún store: los interceptores de respuesta (que sí necesitan el
 * store de autenticación) viven en setupInterceptors.ts para evitar una importación circular.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1",
  timeout: 10000,
  withCredentials: true,
});

// Interceptor de solicitud: NO maneja el token. Viaja en la cookie HttpOnly, que JavaScript
// no puede leer y el navegador adjunta solo.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.set("Accept-Language", "es");
  return config;
});
