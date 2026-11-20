import { useMemo } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Usuario } from "@/features/auth/types/auth.types";
import { handleApiError } from "@/shared/api/handleApiError";
import DataTable from "@/shared/components/DataTable";
import EstadoError from "@/shared/components/EstadoError";
import Skeleton from "@/shared/components/Skeleton";
import Button from "@/shared/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useUsuarios } from "../hooks/useUsuarios";

const helper = createColumnHelper<Usuario>();

export default function AdminUsuariosPage() {
  const miId = useAuthStore((state) => state.usuario?.id);
  const { usuarios, isPending, isError, error, refetch, activar, desactivar } = useUsuarios();

  const columnas = useMemo(
    () => [
      helper.accessor("username", { header: "Usuario" }),
      helper.accessor("full_name", { header: "Nombre" }),
      helper.accessor("email", { header: "Email" }),
      helper.accessor("role", { header: "Rol", cell: (info) => (info.getValue() === "admin" ? "Administrador" : "Cliente") }),
      helper.accessor("disabled", {
        header: "Estado",
        cell: (info) =>
          info.getValue() ? (
            <span className="font-semibold text-error">Desactivado</span>
          ) : (
            <span className="font-semibold text-success">Activo</span>
          ),
      }),
      helper.display({
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => {
          const u = row.original;
          if (u.disabled) {
            return (
              <Button variant="outline" disabled={activar.isPending} onClick={() => activar.mutate(u.id)}>
                Activar
              </Button>
            );
          }
          // el admin no se desactiva a si mismo
          if (u.id === miId) return <span className="text-xs text-secondary">Tu cuenta</span>;
          return (
            <Button variant="danger" disabled={desactivar.isPending} onClick={() => desactivar.mutate(u.id)}>
              Desactivar
            </Button>
          );
        },
      }),
    ],
    [miId, activar, desactivar],
  );

  const table = useReactTable({
    data: usuarios,
    columns: columnas,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">Usuarios</h1>
      {isPending && (
        <div className="space-y-3">
          <Skeleton />
          <Skeleton />
        </div>
      )}
      {isError && <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />}
      {usuarios.length > 0 && <DataTable table={table} etiqueta="Usuarios" />}
    </div>
  );
}
