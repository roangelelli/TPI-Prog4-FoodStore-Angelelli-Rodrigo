import { api } from "@/shared/api/axiosInstance";
import type { RegisterData, Usuario } from "../types/auth.types";

export async function requestLogin(username: string, password: string): Promise<void> {
  // el login es un formulario OAuth2, no json
  const form = new URLSearchParams({ username, password });
  await api.post("/auth/token", form);
}

export async function requestLogout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function requestMe(): Promise<Usuario> {
  return (await api.get<Usuario>("/auth/me")).data;
}

export async function requestRegister(datos: RegisterData): Promise<Usuario> {
  return (await api.post<Usuario>("/auth/register", datos)).data;
}
