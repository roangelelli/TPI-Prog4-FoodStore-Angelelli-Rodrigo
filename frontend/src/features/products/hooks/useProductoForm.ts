import { useForm } from "@tanstack/react-form";
import type { ProductoFormData } from "@/features/products/types/producto.types";

export const PRODUCTO_VACIO: ProductoFormData = {
  nombre: "",
  descripcion: "",
  precio_base: 0,
  disponible: true,
  categorias_ids: [],
  categoria_principal_id: null,
};

/** Formulario tipado de productos (TanStack Form). Lo usa ProductsPage. */
export function useProductoForm(
  valoresIniciales: ProductoFormData,
  onSubmit: (datos: ProductoFormData) => void,
) {
  return useForm({
    defaultValues: valoresIniciales,
    onSubmit: ({ value }) =>
      onSubmit({
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim(),
        precio_base: value.precio_base,
        disponible: value.disponible,
        categorias_ids: value.categorias_ids,
        categoria_principal_id: value.categoria_principal_id,
      }),
  });
}

export type ProductoFormApi = ReturnType<typeof useProductoForm>;
