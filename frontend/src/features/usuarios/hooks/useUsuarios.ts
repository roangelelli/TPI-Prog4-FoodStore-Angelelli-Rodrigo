import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Usuario } from "@/features/auth/types/auth.types";
import { atiendeElInterceptor, handleApiError } from "@/shared/api/handleApiError";
import { useNotificationStore } from "@/store/notificationStore";
import { activarUsuario, desactivarUsuario, getUsuarios } from "../api/usuarios";

export function useUsuarios() {
  const queryClient = useQueryClient();
  const notificar = useNotificationStore((state) => state.showNotification);

  const listado = useQuery<Usuario[]>({ queryKey: ["usuarios"], queryFn: getUsuarios });

  const alFallar = (error: unknown) => {
    if (!atiendeElInterceptor(error)) notificar(handleApiError(error));
  };
  const alTerminar = (mensaje: string) => {
    void queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    notificar(mensaje);
  };

  const activar = useMutation({
    mutationFn: (id: number) => activarUsuario(id),
    onSuccess: () => alTerminar("Usuario activado"),
    onError: alFallar,
  });

  const desactivar = useMutation({
    mutationFn: (id: number) => desactivarUsuario(id),
    onSuccess: () => alTerminar("Usuario desactivado"),
    onError: alFallar,
  });

  return { ...listado, usuarios: listado.data ?? [], activar, desactivar };
}
