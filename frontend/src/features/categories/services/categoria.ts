import type { Categoria, CategoriaFormData } from "@/features/categories/types/categoria.types";
import { crearServicioCrud } from "@/shared/api/crud";

const servicio = crearServicioCrud<Categoria, CategoriaFormData>("categorias");

export const getCategorias = servicio.getAll;
export const createCategoria = servicio.create;
export const updateCategoria = servicio.update;
export const deleteCategoria = servicio.remove;
