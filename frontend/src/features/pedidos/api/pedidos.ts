import { api } from "@/shared/api/axiosInstance";
import type {
  EstadoPedido,
  Pedido,
  PedidoCreate,
  PedidosPaginados,
  ResumenPedidos,
} from "../types/pedido.types";

export async function getPedidos(skip: number, limit: number, estado?: EstadoPedido): Promise<PedidosPaginados> {
  const params = { skip, limit, ...(estado ? { estado } : {}) };
  return (await api.get<PedidosPaginados>("/pedidos", { params })).data;
}

export async function createPedido(datos: PedidoCreate): Promise<Pedido> {
  return (await api.post<Pedido>("/pedidos", datos)).data;
}

export async function patchEstadoPedido(id: number, estado: EstadoPedido): Promise<Pedido> {
  return (await api.patch<Pedido>(`/pedidos/${id}/estado`, { estado })).data;
}

export async function patchCancelarPedido(id: number): Promise<Pedido> {
  return (await api.patch<Pedido>(`/pedidos/${id}/cancelar`)).data;
}

export async function getResumenPedidos(): Promise<ResumenPedidos> {
  return (await api.get<ResumenPedidos>("/pedidos/resumen")).data;
}
