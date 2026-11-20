import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { atiendeElInterceptor, handleApiError } from "@/shared/api/handleApiError";
import { useNotificationStore } from "@/store/notificationStore";
import { createProducto, deleteProducto, getProductos, patchStock, updateProducto } from "../api/productos";
import type { FiltrosProductos, ProductoFormData, StockFormData } from "../types/producto.types";

export function useProductos(filtros: FiltrosProductos) {
  return useQuery({
    queryKey: ["productos", filtros],
    queryFn: () => getProductos(filtros),
    placeholderData: keepPreviousData,
  });
}

export function useProductosMutations() {
  const queryClient = useQueryClient();
  const notificar = useNotificationStore((state) => state.showNotification);

  const alFallar = (error: unknown) => {
    if (!atiendeElInterceptor(error)) notificar(handleApiError(error));
  };
  const alTerminar = (mensaje: string) => {
    void queryClient.invalidateQueries({ queryKey: ["productos"] });
    notificar(mensaje);
  };

  const crear = useMutation({
    mutationFn: (datos: ProductoFormData) => createProducto(datos),
    onSuccess: () => alTerminar("Producto creado"),
    onError: alFallar,
  });

  const editar = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: ProductoFormData }) => updateProducto(id, datos),
    onSuccess: () => alTerminar("Producto actualizado"),
    onError: alFallar,
  });

  const actualizarStock = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: StockFormData }) => patchStock(id, datos),
    onSuccess: () => alTerminar("Stock actualizado"),
    onError: alFallar,
  });

  const eliminar = useMutation({
    mutationFn: (id: number) => deleteProducto(id),
    onSuccess: () => alTerminar("Producto eliminado"),
    onError: alFallar,
  });

  return { crear, editar, actualizarStock, eliminar };
}
