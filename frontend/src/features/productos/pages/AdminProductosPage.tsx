import { useMemo, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCategorias } from "@/features/categorias/hooks/useCategorias";
import { handleApiError } from "@/shared/api/handleApiError";
import DataTable from "@/shared/components/DataTable";
import EstadoError from "@/shared/components/EstadoError";
import EstadoVacio from "@/shared/components/EstadoVacio";
import Skeleton from "@/shared/components/Skeleton";
import Button from "@/shared/ui/Button";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import { formatearPrecio } from "@/shared/utils/formato";
import ProductoModal from "../components/ProductoModal";
import StockModal from "../components/StockModal";
import { useProductos, useProductosMutations } from "../hooks/useProductos";
import type { Producto, ProductoFormData } from "../types/producto.types";

const helper = createColumnHelper<Producto>();

export default function AdminProductosPage() {
  // el listado admin trae hasta 100 y se pagina en el cliente
  const { data, isPending, isError, error, refetch } = useProductos({ skip: 0, limit: 100 });
  const { categorias } = useCategorias();
  const { crear, editar, actualizarStock, eliminar } = useProductosMutations();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [enEdicion, setEnEdicion] = useState<Producto | null>(null);
  const [paraStock, setParaStock] = useState<Producto | null>(null);
  const [aEliminar, setAEliminar] = useState<Producto | null>(null);

  const productos = useMemo(() => data?.items ?? [], [data]);

  const columnas = useMemo(
    () => [
      helper.accessor("nombre", { header: "Nombre" }),
      helper.accessor((p) => p.categoria.nombre, { id: "categoria", header: "Categoría" }),
      helper.accessor("precio_base", { header: "Precio", cell: (info) => formatearPrecio(info.getValue()) }),
      helper.accessor("stock", { header: "Stock" }),
      helper.accessor("disponible", {
        header: "Disponible",
        cell: (info) =>
          info.getValue() ? (
            <span className="font-semibold text-success">Sí</span>
          ) : (
            <span className="font-semibold text-error">No</span>
          ),
      }),
      helper.display({
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setEnEdicion(row.original);
                setModalAbierto(true);
              }}
            >
              Editar
            </Button>
            <Button variant="outline" onClick={() => setParaStock(row.original)}>
              Stock
            </Button>
            <Button variant="danger" onClick={() => setAEliminar(row.original)}>
              Eliminar
            </Button>
          </div>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: productos,
    columns: columnas,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const cerrarModal = () => {
    setModalAbierto(false);
    setEnEdicion(null);
  };

  const guardar = (datos: ProductoFormData) => {
    const opciones = { onSuccess: cerrarModal };
    if (enEdicion) editar.mutate({ id: enEdicion.id, datos }, opciones);
    else crear.mutate(datos, opciones);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Productos</h1>
        <Button disabled={categorias.length === 0} onClick={() => setModalAbierto(true)}>
          Nuevo producto
        </Button>
      </div>

      {categorias.length === 0 && (
        <p className="mb-4 text-sm text-secondary">Primero creá una categoría para poder cargar productos.</p>
      )}

      {isPending && (
        <div className="space-y-3">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      )}
      {isError && <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />}
      {data && productos.length === 0 && <EstadoVacio titulo="No hay productos" descripcion="Cargá el primero." />}
      {productos.length > 0 && <DataTable table={table} etiqueta="Productos" />}

      <ProductoModal
        abierto={modalAbierto}
        producto={enEdicion}
        categorias={categorias}
        guardando={crear.isPending || editar.isPending}
        onGuardar={guardar}
        onClose={cerrarModal}
      />

      <StockModal
        producto={paraStock}
        guardando={actualizarStock.isPending}
        onClose={() => setParaStock(null)}
        onGuardar={(datos) => {
          if (paraStock) actualizarStock.mutate({ id: paraStock.id, datos }, { onSuccess: () => setParaStock(null) });
        }}
      />

      <ConfirmModal
        abierto={aEliminar !== null}
        titulo="Eliminar producto"
        mensaje={`¿Eliminar "${aEliminar?.nombre}"? Deja de aparecer en el catálogo, los pedidos anteriores no se modifican.`}
        textoConfirmar="Eliminar"
        cargando={eliminar.isPending}
        onCancelar={() => setAEliminar(null)}
        onConfirmar={() => {
          if (aEliminar) eliminar.mutate(aEliminar.id, { onSuccess: () => setAEliminar(null) });
        }}
      />
    </div>
  );
}
