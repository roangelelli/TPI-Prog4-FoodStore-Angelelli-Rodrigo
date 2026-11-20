import { useState } from "react";
import { handleApiError } from "@/shared/api/handleApiError";
import EstadoError from "@/shared/components/EstadoError";
import EstadoVacio from "@/shared/components/EstadoVacio";
import Paginacion from "@/shared/components/Paginacion";
import Skeleton from "@/shared/components/Skeleton";
import Button from "@/shared/ui/Button";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import PedidoCard from "../components/PedidoCard";
import { useCancelarPedido, usePedidos } from "../hooks/usePedidos";
import type { Pedido } from "../types/pedido.types";

const LIMITE = 5;

export default function MisPedidosPage() {
  const [pagina, setPagina] = useState(0);
  const [aCancelar, setACancelar] = useState<Pedido | null>(null);
  const { data, isPending, isError, error, refetch } = usePedidos(pagina * LIMITE, LIMITE);
  const cancelar = useCancelarPedido();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">Mis pedidos</h1>

      {isError && <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />}
      {isPending && (
        <div className="space-y-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      )}
      {data && data.items.length === 0 && (
        <EstadoVacio titulo="Todavía no hiciste pedidos" descripcion="Cuando compres, los vas a ver acá." />
      )}

      {data && data.items.length > 0 && (
        <>
          <div className="space-y-4">
            {data.items.map((pedido) => (
              <PedidoCard
                key={pedido.id}
                pedido={pedido}
                acciones={
                  pedido.estado === "PENDIENTE" && (
                    <Button variant="danger" onClick={() => setACancelar(pedido)}>
                      Cancelar pedido
                    </Button>
                  )
                }
              />
            ))}
          </div>
          <Paginacion pagina={pagina} total={data.total} limite={LIMITE} onCambiar={setPagina} />
        </>
      )}

      <ConfirmModal
        abierto={aCancelar !== null}
        titulo="Cancelar pedido"
        mensaje={`¿Cancelar el pedido #${aCancelar?.id}? El stock de los productos se devuelve.`}
        textoConfirmar="Cancelar pedido"
        cargando={cancelar.isPending}
        onCancelar={() => setACancelar(null)}
        onConfirmar={() => {
          if (aCancelar) cancelar.mutate(aCancelar.id, { onSuccess: () => setACancelar(null) });
        }}
      />
    </div>
  );
}
