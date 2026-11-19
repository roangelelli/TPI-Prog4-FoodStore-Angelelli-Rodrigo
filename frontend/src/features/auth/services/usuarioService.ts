import { api } from "@/shared/api/api";
import type { UsuarioRespuesta } from "@/features/auth/types/auth.types";

/** Administración de usuarios (solo rol admin). */
export const getUsuarios = async (): Promise<UsuarioRespuesta[]> =>
  (await api.get<UsuarioRespuesta[]>("/auth/admin/usuarios")).data;

export const activarUsuario = async (id: number): Promise<UsuarioRespuesta> =>
  (await api.post<UsuarioRespuesta>(`/auth/admin/usuarios/${id}/activar`)).data;

export const desactivarUsuario = async (id: number): Promise<UsuarioRespuesta> =>
  (await api.post<UsuarioRespuesta>(`/auth/admin/usuarios/${id}/desactivar`)).data;
