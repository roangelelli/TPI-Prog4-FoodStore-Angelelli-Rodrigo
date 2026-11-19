import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  activarUsuario,
  desactivarUsuario,
  getUsuarios,
} from "@/features/auth/services/usuarioService";
import type { UsuarioRespuesta } from "@/features/auth/types/auth.types";
import { atiendeElInterceptor } from "@/shared/api/handleApiError";
import { useNotificationStore } from "@/store/notificationStore";
import { handleApiError } from "@/shared/api/handleApiError";

/** Administración de cuentas (solo admin): listado y activar o desactivar. */
export function useUsuarios() {
  const queryClient = useQueryClient();
  const notificar = useNotificationStore((state) => state.showNotification);

  const listado = useQuery<UsuarioRespuesta[]>({
    queryKey: ["usuarios"],
    queryFn: getUsuarios,
  });

  const cambiarEstado = useMutation({
    mutationFn: ({ id, activar }: { id: number; activar: boolean }) =>
      activar ? activarUsuario(id) : desactivarUsuario(id),
    onSuccess: (_usuario, { activar }) => {
      void queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      notificar(activar ? "Cuenta activada" : "Cuenta desactivada");
    },
    onError: (error) => {
      if (!atiendeElInterceptor(error)) notificar(handleApiError(error));
    },
  });

  return { ...listado, usuarios: listado.data, cambiarEstado };
}
