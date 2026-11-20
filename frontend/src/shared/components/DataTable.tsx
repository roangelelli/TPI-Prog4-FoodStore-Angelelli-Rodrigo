import { flexRender } from "@tanstack/react-table";
import type { Table } from "@tanstack/react-table";
import Button from "@/shared/ui/Button";

interface DataTableProps<T> {
  table: Table<T>;
  etiqueta: string;
}

const FLECHAS = { asc: " ▲", desc: " ▼" } as const;

export default function DataTable<T>({ table, etiqueta }: DataTableProps<T>) {
  const { pageIndex } = table.getState().pagination;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left" aria-label={etiqueta}>
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-secondary dark:bg-slate-700/50">
            {table.getHeaderGroups().map((grupo) => (
              <tr key={grupo.id}>
                {grupo.headers.map((header) => {
                  const orden = header.column.getIsSorted();
                  return (
                    <th key={header.id} className="px-4 py-3">
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="font-semibold uppercase tracking-wide hover:text-slate-900 dark:hover:text-white"
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
              <tr
                key={row.id}
                className="border-t border-slate-100 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-secondary dark:border-slate-700">
        <span>
          Página {pageIndex + 1} de {Math.max(table.getPageCount(), 1)}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Anterior
          </Button>
          <Button variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
