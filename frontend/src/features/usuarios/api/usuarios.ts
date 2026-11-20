import { api } from "@/shared/api/axiosInstance";
import type { Usuario } from "@/features/auth/types/auth.types";

export async function getUsuarios(): Promise<Usuario[]> {
  return (await api.get<Usuario[]>("/admin/usuarios")).data;
}

export async function activarUsuario(id: number): Promise<Usuario> {
  return (await api.post<Usuario>(`/admin/usuarios/${id}/activar`)).data;
}

export async function desactivarUsuario(id: number): Promise<Usuario> {
  return (await api.post<Usuario>(`/admin/usuarios/${id}/desactivar`)).data;
}
