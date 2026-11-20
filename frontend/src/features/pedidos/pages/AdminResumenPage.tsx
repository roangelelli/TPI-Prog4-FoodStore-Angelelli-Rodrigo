import { handleApiError } from "@/shared/api/handleApiError";
import EstadoError from "@/shared/components/EstadoError";
import Skeleton from "@/shared/components/Skeleton";
import Card from "@/shared/ui/Card";
import { formatearPrecio } from "@/shared/utils/formato";
import { useResumenPedidos } from "../hooks/usePedidos";

export default function AdminResumenPage() {
  const { data, isPending, isError, error, refetch } = useResumenPedidos();

  const tarjetas = data
    ? [
        { titulo: "Pedidos de hoy", valor: String(data.pedidos_hoy) },
        { titulo: "Pendientes", valor: String(data.pendientes) },
        { titulo: "En preparación", valor: String(data.en_preparacion) },
        { titulo: "Entregados", valor: String(data.entregados) },
        { titulo: "Cancelados", valor: String(data.cancelados) },
        { titulo: "Ingresos (entregados)", valor: formatearPrecio(data.ingresos_entregados) },
      ]
    : [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">Resumen</h1>
      {isError && <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isPending && Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-24" />)}
        {tarjetas.map((t) => (
          <Card key={t.titulo}>
            <p className="text-sm text-secondary">{t.titulo}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{t.valor}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
