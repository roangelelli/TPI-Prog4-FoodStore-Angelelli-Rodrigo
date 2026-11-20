import { api } from "@/shared/api/axiosInstance";
import type { Categoria, CategoriaFormData } from "../types/categoria.types";

export async function getCategorias(): Promise<Categoria[]> {
  return (await api.get<Categoria[]>("/categorias")).data;
}

export async function createCategoria(datos: CategoriaFormData): Promise<Categoria> {
  return (await api.post<Categoria>("/categorias", datos)).data;
}

export async function updateCategoria(id: number, datos: CategoriaFormData): Promise<Categoria> {
  return (await api.put<Categoria>(`/categorias/${id}`, datos)).data;
}

export async function deleteCategoria(id: number): Promise<void> {
  await api.delete(`/categorias/${id}`);
}
