import { useCallback, useMemo, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { useAuthStore } from "@/features/auth";
import IngredienteList from "@/features/ingredients/components/IngredienteList";
import IngredienteModal from "@/features/ingredients/components/IngredienteModal";
import { INGREDIENTE_VACIO, useIngredienteForm } from "@/features/ingredients/hooks/useIngredienteForm";
import { useIngredients } from "@/features/ingredients/hooks/useIngredients";
import type { Ingrediente, IngredienteFormData } from "@/features/ingredients/types/ingrediente.types";
import { handleApiError } from "@/shared/api/handleApiError";
import Button from "@/shared/components/ui/Button";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import LoadingState from "@/shared/components/ui/LoadingState";
import PageHeader from "@/shared/components/ui/PageHeader";

// Referencias estables: la tabla no debe recibir un arreglo nuevo en cada render.
const SIN_INGREDIENTES: Ingrediente[] = [];
const columnHelper = createColumnHelper<Ingrediente>();
const aFormData = (ingrediente: Ingrediente): IngredienteFormData => ({
  nombre: ingrediente.nombre,
});

export default function IngredientesPage() {
  // Los botones de crear, editar y eliminar son solo para admin. Ocultarlos no reemplaza
  // la validación del backend, que responde 403 a un usuario user.
  const puedeEditar = useAuthStore((state) => state.hasRole("admin"));

  // Modal controlado con un estado booleano.
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState<Ingrediente | null>(null);

  // Estado de la tabla (TanStack Table).
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });

  // Datos y mutaciones: toda la interacción con la API vive en el hook de la feature.
  const { ingredientes: data, isPending, isError, error, refetch, crear, editar, eliminar } =
    useIngredients();

  const cerrarModal = () => {
    setModalAbierto(false);
    setIngredienteSeleccionado(null);
  };

  // Formulario (TanStack Form): el envío crea o edita según haya un ingrediente seleccionado.
  // Valores iniciales del formulario: los de el ingrediente seleccionado (edición) o vacíos (alta).
  const valoresIniciales = useMemo(
    () => (ingredienteSeleccionado ? aFormData(ingredienteSeleccionado) : INGREDIENTE_VACIO),
    [ingredienteSeleccionado],
  );

  const form = useIngredienteForm(valoresIniciales, (datos) => {
    if (ingredienteSeleccionado) {
      editar.mutate({ id: ingredienteSeleccionado.id, datos }, { onSuccess: cerrarModal });
    } else {
      crear.mutate(datos, { onSuccess: cerrarModal });
    }
  });

  // Funciones estables de las mutaciones: se usan como dependencias de los callbacks.
  const { reset: resetCrear } = crear;
  const { reset: resetEditar } = editar;
  const { reset: resetEliminar, mutate: mutarEliminar } = eliminar;

  const reiniciarMutaciones = useCallback(() => {
    resetCrear();
    resetEditar();
    resetEliminar();
  }, [resetCrear, resetEditar, resetEliminar]);

  const abrirAlta = () => {
    reiniciarMutaciones();
    setIngredienteSeleccionado(null);
    form.reset(INGREDIENTE_VACIO);
    setModalAbierto(true);
  };

  const abrirEdicion = useCallback(
    (ingrediente: Ingrediente) => {
      reiniciarMutaciones();
      setIngredienteSeleccionado(ingrediente);
      form.reset(aFormData(ingrediente));
      setModalAbierto(true);
    },
    [form, reiniciarMutaciones],
  );

  const cancelarModal = () => {
    reiniciarMutaciones();
    cerrarModal();
  };

  const eliminarIngrediente = useCallback(
    (ingrediente: Ingrediente) => {
      if (!window.confirm(`¿Seguro que querés eliminar el ingrediente "${ingrediente.nombre}"?`)) {
        return;
      }
      resetEliminar();
      mutarEliminar(ingrediente.id);
    },
    [resetEliminar, mutarEliminar],
  );

  const columns = useMemo(() => {
    const base = [
      columnHelper.accessor("id", { header: "N°" }),
      columnHelper.accessor("nombre", {
        header: "Nombre",
        cell: (info) => <span className="font-medium text-slate-900 dark:text-slate-100">{info.getValue()}</span>,
      }),
    ];
    if (!puedeEditar) return base;
    return [
      ...base,
      columnHelper.display({
        id: "acciones",
        header: () => <span className="block text-right">Acciones</span>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => abrirEdicion(row.original)}>
              Editar
            </Button>
            <Button variant="danger" onClick={() => eliminarIngrediente(row.original)}>
              Eliminar
            </Button>
          </div>
        ),
      }),
    ];
  }, [puedeEditar, abrirEdicion, eliminarIngrediente]);

  const table = useReactTable({
    data: data ?? SIN_INGREDIENTES,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const errorModal = (() => {
    const falla = ingredienteSeleccionado ? editar.error : crear.error;
    return falla ? handleApiError(falla) : null;
  })();

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <PageHeader
        titulo="Ingredientes"
        textoBoton={puedeEditar ? "+ Nuevo ingrediente" : undefined}
        onNuevo={puedeEditar ? abrirAlta : undefined}
      />

      {eliminar.isError && <ErrorState mensaje={handleApiError(eliminar.error)} />}

      {isPending && <LoadingState mensaje="Cargando ingredientes..." />}

      {isError && <ErrorState mensaje={handleApiError(error)} onReintentar={() => refetch()} />}

      {data && data.length === 0 && (
        <EmptyState
          titulo="No hay ingredientes"
          descripcion={
            puedeEditar
              ? "Todavía no cargaste ningún ingrediente. Creá el primero con el botón de abajo."
              : "Todavía no hay ingredientes cargados."
          }
          accion={puedeEditar ? <Button onClick={abrirAlta}>+ Nuevo ingrediente</Button> : undefined}
        />
      )}

      {data && data.length > 0 && <IngredienteList table={table} />}

      <IngredienteModal
        abierto={modalAbierto && puedeEditar}
        modoEdicion={ingredienteSeleccionado !== null}
        form={form}
        guardando={crear.isPending || editar.isPending}
        error={errorModal}
        onClose={cancelarModal}
      />
    </main>
  );
}
