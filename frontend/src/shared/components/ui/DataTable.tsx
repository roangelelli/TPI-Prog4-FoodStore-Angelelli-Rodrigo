import { flexRender } from "@tanstack/react-table";
import type { Table } from "@tanstack/react-table";
import Button from "./Button";

interface DataTableProps<T> {
  /** Instancia creada con useReactTable en la página; este componente solo la dibuja. */
  table: Table<T>;
  etiqueta: string;
}

const FLECHAS = { asc: " ▲", desc: " ▼" } as const;

/** Tabla genérica: encabezados ordenables, filas y botones de paginación. */
export default function DataTable<T>({ table, etiqueta }: DataTableProps<T>) {
  const { pageIndex } = table.getState().pagination;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <table className="w-full text-left" aria-label={etiqueta}>
        <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs font-semibold uppercase tracking-wide text-secondary">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const orden = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    className="px-6 py-3"
                    aria-sort={
                      orden === "asc" ? "ascending" : orden === "desc" ? "descending" : undefined
                    }
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="font-semibold uppercase tracking-wide hover:text-slate-900 dark:hover:text-white dark:text-slate-100 focus-visible:outline-2 focus-visible:outline-brand"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {orden ? FLECHAS[orden] : null}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-100 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 px-6 py-3 text-sm text-secondary">
        <span>
          Página {pageIndex + 1} de {Math.max(table.getPageCount(), 1)}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
