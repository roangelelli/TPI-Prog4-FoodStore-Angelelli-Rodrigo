import { api } from "@/shared/api/api";
import type {
  LoginCredentials,
  MensajeRespuesta,
  RegisterData,
  UsuarioAuth,
  UsuarioRespuesta,
} from "@/features/auth/types/auth.types";

/** Login OAuth2: formulario (no JSON) y el campo username lleva el email. El servidor
 *  responde con la cookie HttpOnly; el frontend nunca ve el token. */
export const requestLogin = async ({ email, password }: LoginCredentials): Promise<void> => {
  await api.post<MensajeRespuesta>("/auth/token", new URLSearchParams({ username: email, password }));
};

/** Usuario de la sesión actual, o null si no hay sesión válida (401) o la cuenta está
 *  desactivada (400). Devuelve solo lo que guarda el AuthStore. */
export const requestMe = async (): Promise<UsuarioAuth | null> => {
  try {
    const { data } = await api.get<UsuarioRespuesta>("/auth/me");
    return { id: data.id, nombre: data.nombre, apellido: data.apellido, email: data.email, roles: data.roles };
  } catch (error) {
    if (isSinSesion(error)) return null;
    throw error;
  }
};

export const requestLogout = async (): Promise<void> => {
  await api.post<MensajeRespuesta>("/auth/logout");
};

export const requestRegister = async (datos: RegisterData): Promise<UsuarioRespuesta> => {
  const { celular, ...resto } = datos;
  const { data } = await api.post<UsuarioRespuesta>("/auth/register", {
    ...resto,
    celular: celular.trim() === "" ? null : celular.trim(),
  });
  return data;
};

function isSinSesion(error: unknown): boolean {
  const status = (error as { response?: { status?: number } }).response?.status;
  return status === 401 || status === 400;
}
