import { useMemo, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import DataTable from "@/shared/components/DataTable";
import EstadoError from "@/shared/components/EstadoError";
import EstadoVacio from "@/shared/components/EstadoVacio";
import Skeleton from "@/shared/components/Skeleton";
import Button from "@/shared/ui/Button";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import { handleApiError } from "@/shared/api/handleApiError";
import CategoriaModal from "../components/CategoriaModal";
import { useCategorias } from "../hooks/useCategorias";
import type { Categoria } from "../types/categoria.types";

const helper = createColumnHelper<Categoria>();

export default function AdminCategoriasPage() {
  const { categorias, isPending, isError, error, refetch, crear, editar, eliminar } = useCategorias();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [enEdicion, setEnEdicion] = useState<Categoria | null>(null);
  const [aEliminar, setAEliminar] = useState<Categoria | null>(null);

  const columnas = useMemo(
    () => [
      helper.accessor("id", { header: "ID" }),
      helper.accessor("nombre", { header: "Nombre" }),
      helper.accessor("descripcion", { header: "Descripción", cell: (info) => info.getValue() ?? "-" }),
      helper.display({
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setEnEdicion(row.original);
                setModalAbierto(true);
              }}
            >
              Editar
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
    data: categorias,
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

  const guardar = (datos: { nombre: string; descripcion: string }) => {
    const opciones = { onSuccess: cerrarModal };
    if (enEdicion) editar.mutate({ id: enEdicion.id, datos }, opciones);
    else crear.mutate(datos, opciones);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Categorías</h1>
        <Button onClick={() => setModalAbierto(true)}>Nueva categoría</Button>
      </div>

      {isPending && (
        <div className="space-y-3">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      )}
      {isError && <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />}
      {!isPending && !isError && categorias.length === 0 && (
        <EstadoVacio titulo="No hay categorías" descripcion="Creá la primera para armar el catálogo." />
      )}
      {categorias.length > 0 && <DataTable table={table} etiqueta="Categorías" />}

      <CategoriaModal
        abierto={modalAbierto}
        categoria={enEdicion}
        guardando={crear.isPending || editar.isPending}
        onGuardar={guardar}
        onClose={cerrarModal}
      />

      <ConfirmModal
        abierto={aEliminar !== null}
        titulo="Eliminar categoría"
        mensaje={`¿Eliminar "${aEliminar?.nombre}"? Sus productos siguen en el catálogo: para sacarlos también hay que eliminarlos.`}
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
