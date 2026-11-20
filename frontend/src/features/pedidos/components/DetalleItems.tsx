import { formatearPrecio } from "@/shared/utils/formato";
import type { DetallePedido } from "../types/pedido.types";

export default function DetalleItems({ items }: { items: DetallePedido[] }) {
  return (
    <ul className="divide-y divide-slate-200 text-sm dark:divide-slate-700">
      {items.map((item) => (
        <li key={item.producto_id} className="flex justify-between py-2">
          <span className="text-slate-700 dark:text-slate-200">
            {item.cantidad} x {item.nombre_producto}
          </span>
          <span className="text-secondary">{formatearPrecio(item.subtotal)}</span>
        </li>
      ))}
    </ul>
  );
}
