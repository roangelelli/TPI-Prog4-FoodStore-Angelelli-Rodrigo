import type { EstadoPedido } from "@/features/pedidos/types/pedido.types";

const clases: Record<EstadoPedido, string> = {
  PENDIENTE: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  EN_PREPARACION: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  ENTREGADO: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  CANCELADO: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

const textos: Record<EstadoPedido, string> = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En preparación",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export default function BadgeEstado({ estado }: { estado: EstadoPedido }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${clases[estado]}`}>
      {textos[estado]}
    </span>
  );
}
