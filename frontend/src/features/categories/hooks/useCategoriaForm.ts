import { useForm } from "@tanstack/react-form";
import type { CategoriaFormData } from "@/features/categories/types/categoria.types";

export const CATEGORIA_VACIA: CategoriaFormData = { nombre: "", descripcion: "" };

/**
 * Formulario tipado de categorías (TanStack Form). Lo usa CategoriasPage, que
 * decide qué hacer con los datos al enviar (crear o editar) y lo pasa por props
 * al modal. El tipo de los valores y de los nombres de campo se infiere de
 * CATEGORIA_VACIA.
 */
export function useCategoriaForm(
  valoresIniciales: CategoriaFormData,
  onSubmit: (datos: CategoriaFormData) => void,
) {
  return useForm({
    defaultValues: valoresIniciales,
    onSubmit: ({ value }) =>
      onSubmit({ nombre: value.nombre.trim(), descripcion: value.descripcion.trim() }),
  });
}

export type CategoriaFormApi = ReturnType<typeof useCategoriaForm>;
