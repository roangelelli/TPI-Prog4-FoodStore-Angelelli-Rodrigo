import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProducto,
  deleteProducto,
  getProductos,
  sincronizarCategorias,
  updateProducto,
} from "@/features/products/services/producto";
import type { Producto, ProductoFormData } from "@/features/products/types/producto.types";
import { atiendeElInterceptor, handleApiError } from "@/shared/api/handleApiError";
import { useNotificationStore } from "@/store/notificationStore";

/**
 * CRUD de productos: useQuery para el listado (GET /productos/, cada producto trae sus
 * categorías) y useMutation para el alta, la edición y la baja. El alta y la edición también
 * dejan sincronizadas las categorías del producto (tabla ProductoCategoria).
 */
export function useProducts() {
  const queryClient = useQueryClient();
  const notificar = useNotificationStore((state) => state.showNotification);

  const listado = useQuery<Producto[]>({
    queryKey: ["productos"],
    queryFn: getProductos,
  });

  const invalidar = () => queryClient.invalidateQueries({ queryKey: ["productos"] });
  // 401 y 403 los atiende el interceptor de Axios; el resto de los errores se notifican acá.
  const alFallar = (error: unknown) => {
    if (!atiendeElInterceptor(error)) notificar(handleApiError(error));
  };

  const crear = useMutation({
    mutationFn: async (datos: ProductoFormData) => {
      const { categorias_ids, categoria_principal_id, ...producto } = datos;
      const creado = await createProducto(producto);
      await sincronizarCategorias(creado.id, [], categorias_ids, categoria_principal_id);
      return creado;
    },
    onSuccess: () => {
      void invalidar();
      notificar("Producto creado correctamente");
    },
    onError: alFallar,
  });

  const editar = useMutation({
    mutationFn: async ({ original, datos }: { original: Producto; datos: ProductoFormData }) => {
      const { categorias_ids, categoria_principal_id, ...producto } = datos;
      const actualizado = await updateProducto(original.id, producto);
      await sincronizarCategorias(
        original.id,
        original.categorias,
        categorias_ids,
        categoria_principal_id,
      );
      return actualizado;
    },
    onSuccess: () => {
      void invalidar();
      notificar("Producto actualizado correctamente");
    },
    onError: alFallar,
  });

  const eliminar = useMutation({
    mutationFn: (id: number) => deleteProducto(id),
    onSuccess: () => {
      void invalidar();
      notificar("Producto eliminado correctamente");
    },
    onError: alFallar,
  });

  return { ...listado, productos: listado.data, crear, editar, eliminar };
}
