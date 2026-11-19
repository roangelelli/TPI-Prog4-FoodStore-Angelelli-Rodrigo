import type { Table } from "@tanstack/react-table";
import type { Categoria } from "@/features/categories/types/categoria.types";
import DataTable from "@/shared/components/ui/DataTable";

interface CategoriaListProps {
  table: Table<Categoria>;
}

export default function CategoriaList({ table }: CategoriaListProps) {
  return <DataTable table={table} etiqueta="Listado de categorías" />;
}
