import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategoria,
  deleteCategoria,
  getCategorias,
  updateCategoria,
} from "@/features/categories/services/categoria";
import type { Categoria, CategoriaFormData } from "@/features/categories/types/categoria.types";
import { atiendeElInterceptor, handleApiError } from "@/shared/api/handleApiError";
import { useNotificationStore } from "@/store/notificationStore";

interface Opciones {
  /** false evita pedir el listado (por ejemplo, si el usuario no puede usarlo). */
  enabled?: boolean;
}

/**
 * CRUD de categorías: useQuery para el listado (GET /categorias/) y useMutation para el alta,
 * la edición y la baja. Tras cada mutación invalida el listado y avisa con una notificación.
 */
export function useCategories({ enabled = true }: Opciones = {}) {
  const queryClient = useQueryClient();
  const notificar = useNotificationStore((state) => state.showNotification);

  const listado = useQuery<Categoria[]>({
    queryKey: ["categorias"],
    queryFn: getCategorias,
    enabled,
  });

  const invalidar = () => queryClient.invalidateQueries({ queryKey: ["categorias"] });
  // 401 y 403 los atiende el interceptor de Axios; el resto de los errores se notifican acá.
  const alFallar = (error: unknown) => {
    if (!atiendeElInterceptor(error)) notificar(handleApiError(error));
  };

  const crear = useMutation({
    mutationFn: (datos: CategoriaFormData) => createCategoria(datos),
    onSuccess: () => {
      void invalidar();
      notificar("Categoría creada correctamente");
    },
    onError: alFallar,
  });

  const editar = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: CategoriaFormData }) =>
      updateCategoria(id, datos),
    onSuccess: () => {
      void invalidar();
      notificar("Categoría actualizada correctamente");
    },
    onError: alFallar,
  });

  const eliminar = useMutation({
    mutationFn: (id: number) => deleteCategoria(id),
    onSuccess: () => {
      void invalidar();
      notificar("Categoría eliminada correctamente");
    },
    onError: alFallar,
  });

  return { ...listado, categorias: listado.data, crear, editar, eliminar };
}
