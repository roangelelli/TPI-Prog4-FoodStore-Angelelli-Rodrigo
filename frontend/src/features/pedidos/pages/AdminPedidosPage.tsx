import { useState } from "react";
import { handleApiError } from "@/shared/api/handleApiError";
import EstadoError from "@/shared/components/EstadoError";
import EstadoVacio from "@/shared/components/EstadoVacio";
import Paginacion from "@/shared/components/Paginacion";
import Skeleton from "@/shared/components/Skeleton";
import Button from "@/shared/ui/Button";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import { claseInput } from "@/shared/ui/Input";
import PedidoCard from "../components/PedidoCard";
import { useCambiarEstadoPedido, usePedidos } from "../hooks/usePedidos";
import { SIGUIENTE_ESTADO } from "../types/pedido.types";
import type { EstadoPedido, Pedido } from "../types/pedido.types";

const LIMITE = 6;

const TEXTO_AVANCE: Partial<Record<EstadoPedido, string>> = {
  PENDIENTE: "Pasar a en preparación",
  EN_PREPARACION: "Marcar como entregado",
};

export default function AdminPedidosPage() {
  const [pagina, setPagina] = useState(0);
  const [estado, setEstado] = useState<EstadoPedido | undefined>(undefined);
  const [aCancelar, setACancelar] = useState<Pedido | null>(null);
  const { data, isPending, isError, error, refetch } = usePedidos(pagina * LIMITE, LIMITE, estado);
  const cambiarEstado = useCambiarEstadoPedido();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Pedidos</h1>
        <select
          aria-label="Filtrar por estado"
          className={`${claseInput} !mt-0 w-auto`}
          value={estado ?? ""}
          onChange={(e) => {
            setEstado(e.target.value ? (e.target.value as EstadoPedido) : undefined);
            setPagina(0);
          }}
        >
          <option value="">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="EN_PREPARACION">En preparación</option>
          <option value="ENTREGADO">Entregado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      {isError && <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />}
      {isPending && (
        <div className="space-y-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      )}
      {data && data.items.length === 0 && <EstadoVacio titulo="No hay pedidos con ese filtro" />}

      {data && data.items.length > 0 && (
        <>
          <div className="space-y-4">
            {data.items.map((pedido) => {
              const siguiente = SIGUIENTE_ESTADO[pedido.estado];
              const puedeCancelar = pedido.estado === "PENDIENTE" || pedido.estado === "EN_PREPARACION";
              return (
                <PedidoCard
                  key={pedido.id}
                  pedido={pedido}
                  acciones={
                    <>
                      {siguiente && (
                        <Button
                          disabled={cambiarEstado.isPending}
                          onClick={() => cambiarEstado.mutate({ id: pedido.id, estado: siguiente })}
                        >
                          {TEXTO_AVANCE[pedido.estado]}
                        </Button>
                      )}
                      {puedeCancelar && (
                        <Button variant="danger" onClick={() => setACancelar(pedido)}>
                          Cancelar
                        </Button>
                      )}
                    </>
                  }
                />
              );
            })}
          </div>
          <Paginacion pagina={pagina} total={data.total} limite={LIMITE} onCambiar={setPagina} />
        </>
      )}

      <ConfirmModal
        abierto={aCancelar !== null}
        titulo="Cancelar pedido"
        mensaje={`¿Cancelar el pedido #${aCancelar?.id}? El stock de los productos se devuelve.`}
        textoConfirmar="Cancelar pedido"
        cargando={cambiarEstado.isPending}
        onCancelar={() => setACancelar(null)}
        onConfirmar={() => {
          if (aCancelar)
            cambiarEstado.mutate({ id: aCancelar.id, estado: "CANCELADO" }, { onSuccess: () => setACancelar(null) });
        }}
      />
    </div>
  );
}
