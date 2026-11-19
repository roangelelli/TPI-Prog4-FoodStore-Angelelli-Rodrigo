import { useForm } from "@tanstack/react-form";
import type { IngredienteFormData } from "@/features/ingredients/types/ingrediente.types";

export const INGREDIENTE_VACIO: IngredienteFormData = { nombre: "" };

/** Formulario tipado de ingredientes (TanStack Form). Lo usa IngredientesPage. */
export function useIngredienteForm(
  valoresIniciales: IngredienteFormData,
  onSubmit: (datos: IngredienteFormData) => void,
) {
  return useForm({
    defaultValues: valoresIniciales,
    onSubmit: ({ value }) => onSubmit({ nombre: value.nombre.trim() }),
  });
}

export type IngredienteFormApi = ReturnType<typeof useIngredienteForm>;
