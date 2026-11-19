import type { Ingrediente, IngredienteFormData } from "@/features/ingredients/types/ingrediente.types";
import { crearServicioCrud } from "@/shared/api/crud";

const servicio = crearServicioCrud<Ingrediente, IngredienteFormData>("ingredientes");

export const getIngredientes = servicio.getAll;
export const createIngrediente = servicio.create;
export const updateIngrediente = servicio.update;
export const deleteIngrediente = servicio.remove;
