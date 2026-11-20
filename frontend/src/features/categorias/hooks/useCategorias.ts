import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { atiendeElInterceptor, handleApiError } from "@/shared/api/handleApiError";
import { useNotificationStore } from "@/store/notificationStore";
import { createCategoria, deleteCategoria, getCategorias, updateCategoria } from "../api/categorias";
import type { Categoria, CategoriaFormData } from "../types/categoria.types";

export function useCategorias() {
  const queryClient = useQueryClient();
  const notificar = useNotificationStore((state) => state.showNotification);

  const listado = useQuery<Categoria[]>({ queryKey: ["categorias"], queryFn: getCategorias });

  const alFallar = (error: unknown) => {
    if (!atiendeElInterceptor(error)) notificar(handleApiError(error));
  };
  const alTerminar = (mensaje: string) => {
    void queryClient.invalidateQueries({ queryKey: ["categorias"] });
    // los productos traen su categoria, se refrescan tambien
    void queryClient.invalidateQueries({ queryKey: ["productos"] });
    notificar(mensaje);
  };

  const crear = useMutation({
    mutationFn: (datos: CategoriaFormData) => createCategoria(datos),
    onSuccess: () => alTerminar("Categoría creada"),
    onError: alFallar,
  });

  const editar = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: CategoriaFormData }) => updateCategoria(id, datos),
    onSuccess: () => alTerminar("Categoría actualizada"),
    onError: alFallar,
  });

  const eliminar = useMutation({
    mutationFn: (id: number) => deleteCategoria(id),
    onSuccess: () => alTerminar("Categoría eliminada"),
    onError: alFallar,
  });

  return { ...listado, categorias: listado.data ?? [], crear, editar, eliminar };
}
