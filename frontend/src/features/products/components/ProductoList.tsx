import type { Table } from "@tanstack/react-table";
import type { Producto } from "@/features/products/types/producto.types";
import DataTable from "@/shared/components/ui/DataTable";

interface ProductoListProps {
  table: Table<Producto>;
}

export default function ProductoList({ table }: ProductoListProps) {
  return <DataTable table={table} etiqueta="Listado de productos" />;
}
