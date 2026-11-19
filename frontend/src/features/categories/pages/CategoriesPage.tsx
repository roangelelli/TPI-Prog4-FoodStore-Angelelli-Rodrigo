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
import CategoriaList from "@/features/categories/components/CategoriaList";
import CategoriaModal from "@/features/categories/components/CategoriaModal";
import { CATEGORIA_VACIA, useCategoriaForm } from "@/features/categories/hooks/useCategoriaForm";
import { useCategories } from "@/features/categories/hooks/useCategories";
import type { Categoria, CategoriaFormData } from "@/features/categories/types/categoria.types";
import { handleApiError } from "@/shared/api/handleApiError";
import Button from "@/shared/components/ui/Button";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import LoadingState from "@/shared/components/ui/LoadingState";
import PageHeader from "@/shared/components/ui/PageHeader";

// Referencias estables: la tabla no debe recibir un arreglo nuevo en cada render.
const SIN_CATEGORIAS: Categoria[] = [];
const columnHelper = createColumnHelper<Categoria>();
const aFormData = (categoria: Categoria): CategoriaFormData => ({
  nombre: categoria.nombre,
  descripcion: categoria.descripcion,
});

export default function CategoriesPage() {
  // Los botones de crear, editar y eliminar son solo para admin. Ocultarlos no reemplaza
  // la validación del backend, que responde 403 a un usuario user.
  const puedeEditar = useAuthStore((state) => state.hasRole("admin"));

  // Modal controlado con un estado booleano.
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);

  // Estado de la tabla (TanStack Table).
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });

  // Datos y mutaciones: toda la interacción con la API vive en el hook de la feature.
  const { categorias: data, isPending, isError, error, refetch, crear, editar, eliminar } =
    useCategories();

  const cerrarModal = () => {
    setModalAbierto(false);
    setCategoriaSeleccionada(null);
  };

  // Formulario (TanStack Form): el envío crea o edita según haya una categoría seleccionada.
  // Valores iniciales del formulario: los de la categoria seleccionada (edición) o vacíos (alta).
  const valoresIniciales = useMemo(
    () => (categoriaSeleccionada ? aFormData(categoriaSeleccionada) : CATEGORIA_VACIA),
    [categoriaSeleccionada],
  );

  const form = useCategoriaForm(valoresIniciales, (datos) => {
    if (categoriaSeleccionada) {
      editar.mutate({ id: categoriaSeleccionada.id, datos }, { onSuccess: cerrarModal });
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
    setCategoriaSeleccionada(null);
    form.reset(CATEGORIA_VACIA);
    setModalAbierto(true);
  };

  const abrirEdicion = useCallback(
    (categoria: Categoria) => {
      reiniciarMutaciones();
      setCategoriaSeleccionada(categoria);
      form.reset(aFormData(categoria));
      setModalAbierto(true);
    },
    [form, reiniciarMutaciones],
  );

  const cancelarModal = () => {
    reiniciarMutaciones();
    cerrarModal();
  };

  const eliminarCategoria = useCallback(
    (categoria: Categoria) => {
      if (!window.confirm(`¿Seguro que querés eliminar la categoría "${categoria.nombre}"?`)) {
        return;
      }
      resetEliminar();
      mutarEliminar(categoria.id);
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
      columnHelper.accessor("descripcion", {
        header: "Descripción",
        cell: (info) => info.getValue() || "—",
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
            <Button variant="danger" onClick={() => eliminarCategoria(row.original)}>
              Eliminar
            </Button>
          </div>
        ),
      }),
    ];
  }, [puedeEditar, abrirEdicion, eliminarCategoria]);

  const table = useReactTable({
    data: data ?? SIN_CATEGORIAS,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const errorModal = (() => {
    const falla = categoriaSeleccionada ? editar.error : crear.error;
    return falla ? handleApiError(falla) : null;
  })();

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <PageHeader
        titulo="Categorías"
        textoBoton={puedeEditar ? "+ Nueva categoría" : undefined}
        onNuevo={puedeEditar ? abrirAlta : undefined}
      />

      {eliminar.isError && <ErrorState mensaje={handleApiError(eliminar.error)} />}

      {isPending && <LoadingState mensaje="Cargando categorías..." />}

      {isError && <ErrorState mensaje={handleApiError(error)} onReintentar={() => refetch()} />}

      {data && data.length === 0 && (
        <EmptyState
          titulo="No hay categorías"
          descripcion={
            puedeEditar
              ? "Todavía no cargaste ninguna categoría. Creá la primera para armar el catálogo."
              : "Todavía no hay categorías cargadas."
          }
          accion={puedeEditar ? <Button onClick={abrirAlta}>+ Nueva categoría</Button> : undefined}
        />
      )}

      {data && data.length > 0 && <CategoriaList table={table} />}

      <CategoriaModal
        abierto={modalAbierto && puedeEditar}
        modoEdicion={categoriaSeleccionada !== null}
        form={form}
        guardando={crear.isPending || editar.isPending}
        error={errorModal}
        onClose={cancelarModal}
      />
    </main>
  );
}
