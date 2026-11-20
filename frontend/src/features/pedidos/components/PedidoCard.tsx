import type { ReactNode } from "react";
import BadgeEstado from "@/shared/ui/BadgeEstado";
import Card from "@/shared/ui/Card";
import { formatearFecha, formatearPrecio } from "@/shared/utils/formato";
import type { Pedido } from "../types/pedido.types";
import DetalleItems from "./DetalleItems";

interface PedidoCardProps {
  pedido: Pedido;
  acciones?: ReactNode;
}

export default function PedidoCard({ pedido, acciones }: PedidoCardProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Pedido #{pedido.id}</h3>
          <p className="text-xs text-secondary">{formatearFecha(pedido.created_at)}</p>
        </div>
        <BadgeEstado estado={pedido.estado} />
      </div>

      <div className="mt-3">
        <DetalleItems items={pedido.items} />
      </div>

      <dl className="mt-3 grid gap-1 text-sm text-secondary">
        <div>
          <dt className="inline font-medium">Entrega: </dt>
          <dd className="inline">{pedido.direccion_entrega}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Pago: </dt>
          <dd className="inline">{pedido.forma_pago === "EFECTIVO" ? "Efectivo" : "Transferencia"}</dd>
        </div>
        {pedido.notas && (
          <div>
            <dt className="inline font-medium">Notas: </dt>
            <dd className="inline">{pedido.notas}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatearPrecio(pedido.total)}</span>
        {acciones && <div className="flex gap-2">{acciones}</div>}
      </div>
    </Card>
  );
}
