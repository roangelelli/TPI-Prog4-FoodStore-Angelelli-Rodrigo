import { useMemo, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useUsuarios } from "@/features/auth/hooks/useUsuarios";
import type { UsuarioRespuesta } from "@/features/auth/types/auth.types";
import { handleApiError } from "@/shared/api/handleApiError";
import Button from "@/shared/components/ui/Button";
import DataTable from "@/shared/components/ui/DataTable";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import LoadingState from "@/shared/components/ui/LoadingState";
import PageHeader from "@/shared/components/ui/PageHeader";

const SIN_USUARIOS: UsuarioRespuesta[] = [];
const columnHelper = createColumnHelper<UsuarioRespuesta>();

/** Listado de usuarios con su estado y los botones Activar y Desactivar (solo admin). */
export default function AdminUsersPage() {
  const miId = useAuth().user?.id;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });

  // Consulta y mutaciones viven en el hook de la feature.
  const { usuarios: data, isPending, isError, error, refetch, cambiarEstado } = useUsuarios();
  const { mutate: mutarEstado, reset: resetEstado } = cambiarEstado;

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", { header: "N°" }),
      columnHelper.accessor((u) => `${u.nombre} ${u.apellido}`, {
        id: "nombre",
        header: "Nombre",
        cell: (info) => <span className="font-medium text-slate-900 dark:text-slate-100">{info.getValue()}</span>,
      }),
      columnHelper.accessor("email", { header: "Email" }),
      columnHelper.accessor((u) => u.roles.join(", "), {
        id: "roles",
        header: "Rol",
        cell: (info) => info.getValue() || "—",
      }),
      columnHelper.accessor("activo", {
        header: "Estado",
        cell: (info) =>
          info.getValue() ? (
            <span className="font-medium text-success">Activo</span>
          ) : (
            <span className="font-medium text-error">Desactivado</span>
          ),
      }),
      columnHelper.display({
        id: "acciones",
        header: () => <span className="block text-right">Acciones</span>,
        cell: ({ row }) => {
          const usuario = row.original;
          return (
            <div className="flex justify-end">
              {usuario.activo ? (
                <Button
                  variant="danger"
                  disabled={usuario.id === miId}
                  title={usuario.id === miId ? "No podés desactivar tu propia cuenta" : undefined}
                  onClick={() => {
                    if (!window.confirm(`¿Desactivar la cuenta de ${usuario.email}?`)) return;
                    resetEstado();
                    mutarEstado({ id: usuario.id, activar: false });
                  }}
                >
                  Desactivar
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    resetEstado();
                    mutarEstado({ id: usuario.id, activar: true });
                  }}
                >
                  Activar
                </Button>
              )}
            </div>
          );
        },
      }),
    ],
    [miId, mutarEstado, resetEstado],
  );

  const table = useReactTable({
    data: data ?? SIN_USUARIOS,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <PageHeader titulo="Usuarios" />

      {cambiarEstado.isError && <ErrorState mensaje={handleApiError(cambiarEstado.error)} />}

      {isPending && <LoadingState mensaje="Cargando usuarios..." />}

      {isError && <ErrorState mensaje={handleApiError(error)} onReintentar={() => refetch()} />}

      {data && data.length === 0 && <EmptyState titulo="No hay usuarios" />}

      {data && data.length > 0 && <DataTable table={table} etiqueta="Listado de usuarios" />}
    </main>
  );
}
