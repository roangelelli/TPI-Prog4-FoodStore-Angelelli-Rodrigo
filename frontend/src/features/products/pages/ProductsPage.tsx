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
import { useCategories, type Categoria } from "@/features/categories";
import ProductoList from "@/features/products/components/ProductoList";
import ProductoModal from "@/features/products/components/ProductoModal";
import { PRODUCTO_VACIO, useProductoForm } from "@/features/products/hooks/useProductoForm";
import { useProducts } from "@/features/products/hooks/useProducts";
import type { Producto, ProductoFormData } from "@/features/products/types/producto.types";
import { formatearPrecio } from "@/features/products/utils/formato";
import { handleApiError } from "@/shared/api/handleApiError";
import Button from "@/shared/components/ui/Button";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import LoadingState from "@/shared/components/ui/LoadingState";
import PageHeader from "@/shared/components/ui/PageHeader";

// Referencias estables: la tabla no debe recibir un arreglo nuevo en cada render.
const SIN_PRODUCTOS: Producto[] = [];
const SIN_CATEGORIAS: Categoria[] = [];
const columnHelper = createColumnHelper<Producto>();
const aFormData = (producto: Producto): ProductoFormData => ({
  nombre: producto.nombre,
  descripcion: producto.descripcion,
  precio_base: producto.precio_base,
  disponible: producto.disponible,
  categorias_ids: producto.categorias.map((c) => c.id),
  categoria_principal_id: producto.categorias.find((c) => c.es_principal)?.id ?? null,
});

export default function ProductsPage() {
  // Los botones de crear, editar y eliminar son solo para admin. Ocultarlos no reemplaza
  // la validación del backend, que responde 403 a un usuario user.
  const puedeEditar = useAuthStore((state) => state.hasRole("admin"));

  // Modal controlado con un estado booleano.
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  // Estado de la tabla (TanStack Table).
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });

  // Datos y mutaciones: toda la interacción con la API vive en los hooks de las features.
  const { productos: data, isPending, isError, error, refetch, crear, editar, eliminar } =
    useProducts();
  // Las categorías disponibles (feature categories, vía su barrel) solo se piden cuando el
  // admin puede asignarlas.
  const { categorias } = useCategories({ enabled: puedeEditar });

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoSeleccionado(null);
  };

  // Formulario (TanStack Form): el envío crea o edita según haya un producto seleccionado.
  // Valores iniciales del formulario: los del producto seleccionado (edición) o vacíos (alta).
  const valoresIniciales = useMemo(
    () => (productoSeleccionado ? aFormData(productoSeleccionado) : PRODUCTO_VACIO),
    [productoSeleccionado],
  );

  const form = useProductoForm(valoresIniciales, (datos) => {
    if (productoSeleccionado) {
      editar.mutate({ original: productoSeleccionado, datos }, { onSuccess: cerrarModal });
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
    setProductoSeleccionado(null);
    form.reset(PRODUCTO_VACIO);
    setModalAbierto(true);
  };

  const abrirEdicion = useCallback(
    (producto: Producto) => {
      reiniciarMutaciones();
      setProductoSeleccionado(producto);
      form.reset(aFormData(producto));
      setModalAbierto(true);
    },
    [form, reiniciarMutaciones],
  );

  const cancelarModal = () => {
    reiniciarMutaciones();
    cerrarModal();
  };

  const eliminarProducto = useCallback(
    (producto: Producto) => {
      if (!window.confirm(`¿Seguro que querés eliminar el producto "${producto.nombre}"?`)) {
        return;
      }
      resetEliminar();
      mutarEliminar(producto.id);
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
      columnHelper.accessor((producto) => producto.categorias.map((c) => c.nombre).join(", "), {
        id: "categorias",
        header: "Categorías",
        cell: ({ row }) =>
          row.original.categorias.length === 0 ? (
            "—"
          ) : (
            <div className="flex flex-wrap gap-1">
              {row.original.categorias.map((c) => (
                <span
                  key={c.id}
                  title={c.es_principal ? "Categoría principal" : undefined}
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    c.es_principal ? "bg-brand/10 font-semibold text-brand" : "bg-slate-100 dark:bg-slate-700"
                  }`}
                >
                  {c.nombre}
                </span>
              ))}
            </div>
          ),
      }),
      columnHelper.accessor("precio_base", {
        header: "Precio",
        cell: (info) => formatearPrecio(info.getValue()),
      }),
      columnHelper.accessor("disponible", {
        header: "Disponible",
        cell: (info) =>
          info.getValue() ? (
            <span className="font-medium text-success">Sí</span>
          ) : (
            <span className="font-medium text-error">No</span>
          ),
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
            <Button variant="danger" onClick={() => eliminarProducto(row.original)}>
              Eliminar
            </Button>
          </div>
        ),
      }),
    ];
  }, [puedeEditar, abrirEdicion, eliminarProducto]);

  const table = useReactTable({
    data: data ?? SIN_PRODUCTOS,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const falla = productoSeleccionado ? editar.error : crear.error;
  const errorModal = falla ? handleApiError(falla) : null;

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <PageHeader
        titulo="Productos"
        textoBoton={puedeEditar ? "+ Nuevo producto" : undefined}
        onNuevo={puedeEditar ? abrirAlta : undefined}
      />

      {eliminar.isError && <ErrorState mensaje={handleApiError(eliminar.error)} />}

      {isPending && <LoadingState mensaje="Cargando productos..." />}

      {isError && <ErrorState mensaje={handleApiError(error)} onReintentar={() => refetch()} />}

      {data && data.length === 0 && (
        <EmptyState
          titulo="No hay productos"
          descripcion={
            puedeEditar
              ? "Todavía no cargaste ningún producto. Creá el primero con el botón de abajo."
              : "Todavía no hay productos cargados."
          }
          accion={puedeEditar ? <Button onClick={abrirAlta}>+ Nuevo producto</Button> : undefined}
        />
      )}

      {data && data.length > 0 && <ProductoList table={table} />}

      <ProductoModal
        abierto={modalAbierto && puedeEditar}
        modoEdicion={productoSeleccionado !== null}
        form={form}
        categorias={categorias ?? SIN_CATEGORIAS}
        guardando={crear.isPending || editar.isPending}
        error={errorModal}
        onClose={cancelarModal}
      />
    </main>
  );
}
