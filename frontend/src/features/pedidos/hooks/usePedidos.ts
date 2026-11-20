import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { atiendeElInterceptor, handleApiError } from "@/shared/api/handleApiError";
import { useNotificationStore } from "@/store/notificationStore";
import {
  createPedido,
  getPedidos,
  getResumenPedidos,
  patchCancelarPedido,
  patchEstadoPedido,
} from "../api/pedidos";
import type { EstadoPedido, PedidoCreate } from "../types/pedido.types";

export function usePedidos(skip: number, limit: number, estado?: EstadoPedido) {
  return useQuery({
    queryKey: ["pedidos", { skip, limit, estado }],
    queryFn: () => getPedidos(skip, limit, estado),
    placeholderData: keepPreviousData,
  });
}

export function useResumenPedidos() {
  return useQuery({ queryKey: ["pedidos-resumen"], queryFn: getResumenPedidos });
}

// crear, cambiar estado y cancelar tocan pedidos y stock de productos
function useRefrescos() {
  const queryClient = useQueryClient();
  const notificar = useNotificationStore((state) => state.showNotification);
  const refrescar = () => {
    void queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    void queryClient.invalidateQueries({ queryKey: ["pedidos-resumen"] });
    void queryClient.invalidateQueries({ queryKey: ["productos"] });
  };
  const alFallar = (error: unknown) => {
    if (!atiendeElInterceptor(error)) notificar(handleApiError(error));
  };
  return { notificar, refrescar, alFallar };
}

export function useCrearPedido() {
  const { notificar, refrescar, alFallar } = useRefrescos();
  return useMutation({
    mutationFn: (datos: PedidoCreate) => createPedido(datos),
    onSuccess: () => {
      refrescar();
      notificar("Pedido realizado");
    },
    onError: alFallar,
  });
}

export function useCambiarEstadoPedido() {
  const { notificar, refrescar, alFallar } = useRefrescos();
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoPedido }) => patchEstadoPedido(id, estado),
    onSuccess: () => {
      refrescar();
      notificar("Estado actualizado");
    },
    onError: alFallar,
  });
}

export function useCancelarPedido() {
  const { notificar, refrescar, alFallar } = useRefrescos();
  return useMutation({
    mutationFn: (id: number) => patchCancelarPedido(id),
    onSuccess: () => {
      refrescar();
      notificar("Pedido cancelado");
    },
    onError: alFallar,
  });
}
