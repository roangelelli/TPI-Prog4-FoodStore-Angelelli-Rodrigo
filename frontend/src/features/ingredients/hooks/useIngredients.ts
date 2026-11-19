import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createIngrediente,
  deleteIngrediente,
  getIngredientes,
  updateIngrediente,
} from "@/features/ingredients/services/ingrediente";
import type { Ingrediente, IngredienteFormData } from "@/features/ingredients/types/ingrediente.types";
import { atiendeElInterceptor, handleApiError } from "@/shared/api/handleApiError";
import { useNotificationStore } from "@/store/notificationStore";

interface Opciones {
  /** false evita pedir el listado (por ejemplo, si el usuario no puede usarlo). */
  enabled?: boolean;
}

/**
 * CRUD de ingredientes: useQuery para el listado (GET /ingredientes/) y useMutation para el alta,
 * la edición y la baja. Tras cada mutación invalida el listado y avisa con una notificación.
 */
export function useIngredients({ enabled = true }: Opciones = {}) {
  const queryClient = useQueryClient();
  const notificar = useNotificationStore((state) => state.showNotification);

  const listado = useQuery<Ingrediente[]>({
    queryKey: ["ingredientes"],
    queryFn: getIngredientes,
    enabled,
  });

  const invalidar = () => queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
  // 401 y 403 los atiende el interceptor de Axios; el resto de los errores se notifican acá.
  const alFallar = (error: unknown) => {
    if (!atiendeElInterceptor(error)) notificar(handleApiError(error));
  };

  const crear = useMutation({
    mutationFn: (datos: IngredienteFormData) => createIngrediente(datos),
    onSuccess: () => {
      void invalidar();
      notificar("Ingrediente creado correctamente");
    },
    onError: alFallar,
  });

  const editar = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: IngredienteFormData }) =>
      updateIngrediente(id, datos),
    onSuccess: () => {
      void invalidar();
      notificar("Ingrediente actualizado correctamente");
    },
    onError: alFallar,
  });

  const eliminar = useMutation({
    mutationFn: (id: number) => deleteIngrediente(id),
    onSuccess: () => {
      void invalidar();
      notificar("Ingrediente eliminado correctamente");
    },
    onError: alFallar,
  });

  return { ...listado, ingredientes: listado.data, crear, editar, eliminar };
}
